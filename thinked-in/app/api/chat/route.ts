import type { NextRequest } from "next/server";
import { isAuthorized } from "@/lib/server-auth";
import { searchNetwork } from "@/lib/mock-search";
import { networkConnections } from "@/lib/mock-data";
import type { Connection, PostData, ProfileCardData } from "@/lib/types";

// Chat is powered by Gemini (gemini-3.1-flash-lite) with FUNCTION CALLING: the
// model decides how to present results — a person/group of people (show_people)
// or a drafted post/message (show_post) — or just answers in text. The chosen
// people are grounded by id in the user's network, so the cards always match
// the reply.
//
// Wire protocol = newline-delimited JSON:
//   {"type":"matches","matches":[...]}   — profile cards
//   {"type":"post","post":{...}}         — a drafted post/message card
//   {"type":"delta","text":"..."}        — streamed text (typed slowly)
export const runtime = "nodejs";

const GEMINI_MODEL = "gemini-3.1-flash-lite";
const TYPING_DELAY_MS = 55;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SYSTEM_INSTRUCTION =
  "You are thinkedin, which helps a user explore their LinkedIn network. You have tools " +
  "to present results in the most useful format:\n" +
  "- show_people: surface the best 1-5 matching connections (by their id) with a one-sentence intro. " +
  "Use this for 'find/who/show me' style questions.\n" +
  "- show_post: draft a short LinkedIn-style post or outreach message when the user asks to write, " +
  "draft, or share something (optionally about a connection).\n" +
  "Otherwise, just reply in at most two short sentences. Be concise, reference people by name, and " +
  "only use ids from the provided connections.";

const TOOLS = [
  {
    functionDeclarations: [
      {
        name: "show_people",
        description:
          "Show one or more matching connections as profile cards with a short intro.",
        parameters: {
          type: "OBJECT",
          properties: {
            intro: {
              type: "STRING",
              description: "One short sentence introducing the matches.",
            },
            person_ids: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "IDs of the connections to show, best first (1-5).",
            },
          },
          required: ["intro", "person_ids"],
        },
      },
      {
        name: "show_post",
        description:
          "Draft a short LinkedIn-style post or outreach message related to a connection or topic.",
        parameters: {
          type: "OBJECT",
          properties: {
            author_id: {
              type: "STRING",
              description: "ID of the related connection, if any.",
            },
            title: { type: "STRING", description: "Short title/subject." },
            body: { type: "STRING", description: "The post or message body." },
          },
          required: ["title", "body"],
        },
      },
    ],
  },
];

interface HistoryItem {
  role: "user" | "assistant";
  content: string;
}

type GeminiResult =
  | { kind: "people"; intro: string; ids: string[] }
  | { kind: "post"; authorId?: string; title: string; body: string }
  | { kind: "text"; text: string };

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let message = "";
  let history: HistoryItem[] = [];
  try {
    const body = await request.json();
    message = typeof body?.message === "string" ? body.message : "";
    if (Array.isArray(body?.history)) history = body.history;
  } catch {
    // empty message handled below
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      const typeOut = async (text: string) => {
        for (const token of text.match(/\S+\s*/g) ?? [text]) {
          send({ type: "delta", text: token });
          await sleep(TYPING_DELAY_MS);
        }
      };

      try {
        const result = await callGemini(message, history);

        if (result.kind === "people") {
          const people = result.ids
            .map((id) => networkConnections.find((c) => c.id === id))
            .filter((c): c is Connection => Boolean(c));
          if (people.length) {
            send({ type: "matches", matches: people.map(toCard) });
            await typeOut(result.intro || "Here are the best matches.");
          } else {
            await fallback(message, send, typeOut);
          }
        } else if (result.kind === "post") {
          const author = result.authorId
            ? networkConnections.find((c) => c.id === result.authorId)
            : undefined;
          const post: PostData = {
            author: author
              ? {
                  name: author.name,
                  role: `${author.position} · ${author.company}`,
                  avatarUrl: author.avatarUrl,
                }
              : undefined,
            title: result.title,
            body: result.body,
          };
          send({ type: "post", post });
          await typeOut("Here's a draft you can use 👇");
        } else {
          await typeOut(result.text);
        }
      } catch {
        await fallback(message, send, typeOut);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

function toCard(c: Connection): ProfileCardData {
  return {
    id: c.id,
    name: c.name,
    position: c.position,
    company: c.company,
    location: c.location,
    avatarUrl: c.avatarUrl,
    linkedinUrl: c.linkedinUrl,
  };
}

// Deterministic fallback if Gemini is unavailable.
async function fallback(
  message: string,
  send: (obj: unknown) => void,
  typeOut: (text: string) => Promise<void>,
) {
  const { matches, reply } = searchNetwork(message);
  if (matches.length) send({ type: "matches", matches });
  await typeOut(reply);
}

function candidateBlock(): string {
  return networkConnections
    .map(
      (c) =>
        `[${c.id}] ${c.name} — ${c.position} at ${c.company}` +
        `${c.location ? ` (${c.location})` : ""}. ${c.summary ?? ""} ` +
        `(seniority: ${c.seniority}, industry: ${c.industry ?? "n/a"})`,
    )
    .join("\n");
}

async function callGemini(
  message: string,
  history: HistoryItem[],
): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const contents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    {
      role: "user",
      parts: [
        {
          text: `${message}\n\nConnections in the user's network:\n${candidateBlock()}`,
        },
      ],
    },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        tools: TOOLS,
        toolConfig: { functionCallingConfig: { mode: "AUTO" } },
        generationConfig: {
          thinkingConfig: { thinkingBudget: 0 },
          temperature: 0.4,
          maxOutputTokens: 320,
        },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini request failed: ${res.status}`);

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const fc = parts.find(
    (p: { functionCall?: { name: string; args?: Record<string, unknown> } }) =>
      p.functionCall,
  )?.functionCall;

  if (fc?.name === "show_people") {
    const ids = Array.isArray(fc.args?.person_ids)
      ? (fc.args.person_ids as unknown[]).map(String)
      : [];
    return {
      kind: "people",
      intro: typeof fc.args?.intro === "string" ? fc.args.intro : "",
      ids,
    };
  }
  if (fc?.name === "show_post") {
    return {
      kind: "post",
      authorId: fc.args?.author_id ? String(fc.args.author_id) : undefined,
      title: String(fc.args?.title ?? ""),
      body: String(fc.args?.body ?? ""),
    };
  }

  const text = parts
    .map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();
  if (text) return { kind: "text", text };
  throw new Error("Gemini returned no usable result");
}
