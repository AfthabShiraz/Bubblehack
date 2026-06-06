import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runAgent, type AgentTurnInput } from "@/lib/agent/run";
import type { MessagesMode } from "@/lib/agent/tools";

export const maxDuration = 60;

// Wire protocol (newline-delimited JSON), matching the existing UI:
//   {"type":"matches","matches":[...]}   (cumulative; last one wins)
//   {"type":"delta","text":"..."}        (many)
//
// Auth: userId comes from Clerk's server-verified session. Every DB query is
// scoped to it explicitly (service-role client), so data is isolated per user.
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let message = "";
  let history: AgentTurnInput[] = [];
  try {
    const body = await request.json();
    message = typeof body?.message === "string" ? body.message : "";
    if (Array.isArray(body?.history)) history = body.history;
  } catch {
    /* empty handled below */
  }

  const supa = createAdminClient();
  const { data: settings } = await supa
    .from("user_settings")
    .select("messages_mode")
    .eq("user_id", userId)
    .maybeSingle();
  const mode = (settings?.messages_mode ?? "none") as MessagesMode;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        await runAgent({
          supa,
          userId,
          mode,
          message,
          history,
          onText: (text) => send({ type: "delta", text }),
          onMatches: (matches) => send({ type: "matches", matches }),
        });
      } catch (e) {
        send({
          type: "delta",
          text: "\n\n_(Sorry — I hit an error reaching your network: " + (e instanceof Error ? e.message : String(e)) + ")_",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
