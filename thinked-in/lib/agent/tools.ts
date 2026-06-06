import type Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  searchByMeaning,
  queryByFilter,
  getNetworkStats,
  keywordSearch,
  searchMessages,
  type ConnectionRow,
  type Filters,
} from "./retrieval";
import { toCard } from "./cards";
import type { ProfileCardData } from "../types";

export type MessagesMode = "full" | "metadata" | "none";

const FILTER_PROPS = {
  country: { type: "string", description: "Canonical country, e.g. 'united kingdom'. UK/England all map here." },
  city: { type: "string" },
  seniority: { type: "string", enum: ["founder", "c-suite", "vp", "director", "manager", "ic"] },
  industry: { type: "string" },
  company: { type: "string", description: "Company name; matched fuzzily." },
} as const;

const REL_FILTER_PROPS = {
  relationship_strength: { type: "string", enum: ["close", "active", "warm", "dormant", "none"] },
  last_contacted_after: { type: "string", description: "ISO date." },
  min_message_count: { type: "integer" },
} as const;

/** Build the Anthropic tool list for the user's messages mode. */
export function toolsForMode(mode: MessagesMode): Anthropic.Tool[] {
  const relAllowed = mode !== "none";
  const filterProps = relAllowed ? { ...FILTER_PROPS, ...REL_FILTER_PROPS } : FILTER_PROPS;

  const tools: Anthropic.Tool[] = [
    {
      name: "search_by_meaning",
      description:
        "Semantic search for people matching a DESCRIPTION of the ideal candidate (your words, " +
        "not the user's raw sentence). Use for 'find someone who…' / goal-implies-a-person queries. " +
        "Over-fetch (limit 30-40) then judge.",
      input_schema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Your description of the ideal person to find." },
          filters: { type: "object", properties: filterProps },
          limit: { type: "integer" },
        },
        required: ["query"],
      },
    },
    {
      name: "query_by_filter",
      description:
        "Exact counts/lists by attribute. mode='count' returns an exact number over the whole network. " +
        "Use for 'how many…', 'list all…', 'who works at X', 'who do I know well'. " +
        (relAllowed ? "Relationship filters available." : ""),
      input_schema: {
        type: "object",
        properties: {
          filters: { type: "object", properties: filterProps },
          mode: { type: "string", enum: ["count", "list"] },
          limit: { type: "integer" },
        },
        required: ["filters", "mode"],
      },
    },
    {
      name: "get_network_stats",
      description:
        "Aggregate the whole network by a dimension (returns counts per group + enrichment coverage). " +
        "Use for 'summarize my network', 'what industries am I strong in'" +
        (relAllowed ? ", 'how much of my network do I keep in touch with'." : "."),
      input_schema: {
        type: "object",
        properties: {
          group_by: {
            type: "string",
            enum: relAllowed
              ? ["industry", "country", "seniority", "relationship_strength"]
              : ["industry", "country", "seniority"],
          },
        },
      },
    },
    {
      name: "keyword_search",
      description:
        "Lexical search for a SPECIFIC word (niche skill, named tool, exact title) that semantic search " +
        "might miss. Complements search_by_meaning — run both and merge when a query has a concrete keyword.",
      input_schema: {
        type: "object",
        properties: {
          terms: { type: "array", items: { type: "string" } },
          fields: { type: "array", items: { type: "string", enum: ["position", "company", "summary", "skills"] } },
          limit: { type: "integer" },
        },
        required: ["terms"],
      },
    },
  ];

  if (mode === "full") {
    tools.push({
      name: "search_messages",
      description:
        "Semantic search over the user's MESSAGE history (what was discussed), joined to the connection. " +
        "Use when the question is about what was said/discussed, not just who someone is.",
      input_schema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Description of the topic to find." },
          limit: { type: "integer" },
        },
        required: ["query"],
      },
    });
  }
  return tools;
}

export interface ToolContext {
  supa: SupabaseClient;
  /** Clerk-verified user id; every query is scoped to it. */
  userId: string;
  /** Accumulates people surfaced by any tool, for the UI 'matches' cards. */
  collectCards: (cards: ProfileCardData[]) => void;
}

/** Execute one tool call; returns a compact JSON-able result for the model. */
export async function runTool(
  name: string,
  input: Record<string, unknown>,
  ctx: ToolContext,
): Promise<unknown> {
  const { supa, userId, collectCards } = ctx;

  switch (name) {
    case "search_by_meaning": {
      const rows = await searchByMeaning(
        supa,
        userId,
        String(input.query ?? ""),
        (input.filters as Filters) ?? {},
        typeof input.limit === "number" ? input.limit : 30,
      );
      collectCards(rows.map(toCard));
      return rows.map(summarizeRow);
    }
    case "query_by_filter": {
      const mode = input.mode === "count" ? "count" : "list";
      const res = await queryByFilter(
        supa,
        userId,
        (input.filters as Filters) ?? {},
        mode,
        typeof input.limit === "number" ? input.limit : 40,
      );
      if (Array.isArray(res)) {
        collectCards(res.map(toCard));
        return res.map(summarizeRow);
      }
      return res; // { count }
    }
    case "get_network_stats": {
      const g = (input.group_by as "industry" | "country" | "seniority" | "relationship_strength") ?? "industry";
      return getNetworkStats(supa, userId, g);
    }
    case "keyword_search": {
      const rows = await keywordSearch(
        supa,
        userId,
        (input.terms as string[]) ?? [],
        (input.fields as ("position" | "company" | "summary" | "skills")[]) ?? undefined,
        typeof input.limit === "number" ? input.limit : 40,
      );
      collectCards(rows.map(toCard));
      return rows.map(summarizeRow);
    }
    case "search_messages": {
      const hits = await searchMessages(supa, userId, String(input.query ?? ""), typeof input.limit === "number" ? input.limit : 20);
      // Surface the connected people as cards too (when matched).
      collectCards(
        hits
          .filter((h) => h.connection_id)
          .map((h) =>
            toCard({
              id: h.connection_id!,
              first_name: h.first_name,
              last_name: h.last_name,
              position: null,
              company: h.company,
              location: null,
              country: null,
              seniority: null,
              industry: null,
              summary: null,
              linkedin_url: h.linkedin_url,
              relationship_strength: null,
              last_contacted: null,
            }),
          ),
      );
      return hits.map((h) => ({
        with: [h.first_name, h.last_name].filter(Boolean).join(" "),
        company: h.company,
        direction: h.direction,
        sent_at: h.sent_at,
        subject: h.subject,
        snippet: h.content?.slice(0, 280) ?? null,
      }));
    }
    default:
      return { error: `unknown tool ${name}` };
  }
}

/** Trim a row to what the model needs to reason + cite (keeps tokens down). */
function summarizeRow(r: ConnectionRow) {
  return {
    name: [r.first_name, r.last_name].filter(Boolean).join(" "),
    position: r.position,
    company: r.company,
    location: r.location ?? r.country,
    seniority: r.seniority,
    industry: r.industry,
    relationship: r.relationship_strength,
    last_contacted: r.last_contacted,
    summary: r.summary?.slice(0, 200) ?? null,
    linkedin_url: r.linkedin_url,
  };
}
