import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toolsForMode, runTool, type MessagesMode, type ToolContext } from "./tools";
import { systemPrompt } from "./prompt";
import { dedupeCards } from "./cards";
import type { ProfileCardData } from "../types";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const MAX_STEPS = 6;

export interface AgentTurnInput {
  role: "user" | "assistant";
  content: string;
}

export interface RunAgentOptions {
  supa: SupabaseClient;
  mode: MessagesMode;
  message: string;
  history?: AgentTurnInput[];
  /** Called with each streamed text token of the final answer. */
  onText: (text: string) => void;
  /** Called with the cumulative, deduped list of surfaced people. */
  onMatches: (matches: ProfileCardData[]) => void;
  anthropic?: Anthropic;
}

/**
 * Drives the Claude tool-use loop over the user's network. Shared by the chat
 * route (streams to the client) and the CLI test harness (prints to console).
 */
export async function runAgent(opts: RunAgentOptions): Promise<void> {
  const anthropic = opts.anthropic ?? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const tools = toolsForMode(opts.mode);
  const system = systemPrompt(opts.mode);

  const collected: ProfileCardData[] = [];
  const ctx: ToolContext = {
    supa: opts.supa,
    collectCards: (cards) => collected.push(...cards),
  };

  const messages: Anthropic.MessageParam[] = [
    ...(opts.history ?? []).map((h) => ({ role: h.role, content: h.content })),
    { role: "user" as const, content: opts.message },
  ];

  for (let step = 0; step < MAX_STEPS; step++) {
    const turn = anthropic.messages.stream({ model: MODEL, max_tokens: 2000, system, tools, messages });
    turn.on("text", (t) => opts.onText(t));
    const msg = await turn.finalMessage();

    const toolUses = msg.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (toolUses.length === 0) break; // end_turn — final answer already streamed

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      let out: unknown;
      try {
        out = await runTool(tu.name, tu.input as Record<string, unknown>, ctx);
      } catch (e) {
        out = { error: e instanceof Error ? e.message : String(e) };
      }
      results.push({ type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(out) });
    }
    if (collected.length) opts.onMatches(dedupeCards(collected));

    messages.push({ role: "assistant", content: msg.content });
    messages.push({ role: "user", content: results });
  }
}
