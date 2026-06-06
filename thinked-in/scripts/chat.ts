/**
 * Interactive terminal chat with your network (no localhost needed).
 * Launch once, ask many questions. Shows live "fetching" activity per tool.
 *
 *   npm run chat                       # uses user "demo"
 *   npm run chat -- --user user_2abc   # a specific user
 *
 * Type a question and press enter. Type 'exit' or Ctrl-C to quit.
 */
import * as readline from "node:readline";
import { createAdminClient } from "../lib/supabase/admin";
import { runAgent, type AgentTurnInput } from "../lib/agent/run";
import type { MessagesMode } from "../lib/agent/tools";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const userId = arg("--user") ?? "demo";

const C = {
  cyan: "\x1b[36m", dim: "\x1b[90m", green: "\x1b[32m",
  yellow: "\x1b[33m", bold: "\x1b[1m", reset: "\x1b[0m",
};

// Friendly labels for each tool's "fetching" line.
const TOOL_LABEL: Record<string, (i: Record<string, unknown>) => string> = {
  search_by_meaning: (i) => `searching profiles for “${String(i.query ?? "").slice(0, 50)}”`,
  keyword_search: (i) => `keyword search: ${(i.terms as string[] | undefined)?.join(", ") ?? ""}`,
  query_by_filter: (i) => `${i.mode === "count" ? "counting" : "listing"} by filters ${JSON.stringify(i.filters ?? {})}`.slice(0, 70),
  get_network_stats: (i) => `summarizing network by ${String(i.group_by ?? "industry")}`,
  search_messages: (i) => `searching messages for “${String(i.query ?? "").slice(0, 50)}”`,
};

/** Single-line spinner that can be relabeled and cleared cleanly. */
class Spinner {
  private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  private i = 0;
  private timer: NodeJS.Timeout | null = null;
  private label = "";
  start(label: string) {
    this.label = label;
    if (this.timer) return;
    this.timer = setInterval(() => {
      process.stdout.write(`\r${C.yellow}${this.frames[this.i = (this.i + 1) % this.frames.length]}${C.reset} ${C.dim}${this.label}${C.reset}\x1b[K`);
    }, 80);
  }
  setLabel(label: string) { this.label = label; }
  /** Stop and erase the spinner line. */
  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    process.stdout.write("\r\x1b[K");
  }
}

async function main() {
  // Immediate feedback so the user never stares at a blank screen during startup.
  const boot = new Spinner();
  boot.start("connecting to your network…");

  const supa = createAdminClient();
  const [{ count }, { data: s }] = await Promise.all([
    supa.from("connections").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supa.from("user_settings").select("messages_mode").eq("user_id", userId).maybeSingle(),
  ]);
  const mode = (s?.messages_mode ?? "none") as MessagesMode;
  boot.stop();

  if (!count) {
    console.error(`No data for user "${userId}". Run enrich.ts first, or pass --user <id>.`);
    process.exit(1);
  }
  console.log(`\n${C.green}${C.bold}thinkedin${C.reset}  ${C.dim}·${C.reset}  ${count} connections  ${C.dim}·${C.reset}  messages: ${mode}`);
  console.log(`${C.dim}Ask anything about your network. Type 'exit' to quit.${C.reset}\n`);

  const history: AgentTurnInput[] = [];
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let closed = false;
  rl.on("close", () => { closed = true; });

  const ask = () => {
    if (closed) return;
    rl.question(`${C.cyan}${C.bold}you ›${C.reset} `, async (q) => {
      const text = q.trim();
      if (!text) return ask();
      if (["exit", "quit", "q"].includes(text.toLowerCase())) { rl.close(); return; }

      const spin = new Spinner();
      spin.start("thinking…");
      let answer = "";
      let cards: string[] = [];

      try {
        await runAgent({
          supa,
          userId,
          mode,
          message: text,
          history: [...history],
          onToolCall: (name, input) => {
            // Pause spinner, print the activity line on its own row, resume.
            spin.stop();
            const label = TOOL_LABEL[name]?.(input) ?? name;
            console.log(`  ${C.dim}↳ ${label}${C.reset}`);
            spin.start("fetching…");
          },
          onToolResult: (name, n) => {
            spin.setLabel(n !== null ? `got ${n} result${n === 1 ? "" : "s"}, thinking…` : "thinking…");
          },
          // Buffer the answer rather than interleaving tokens with the spinner.
          onText: (t) => { answer += t; },
          onMatches: (m) => { cards = m.map((c) => c.name); },
        });
      } catch (e) {
        answer = answer || `(error: ${e instanceof Error ? e.message : String(e)})`;
      }
      spin.stop();
      // Print the full answer once, cleanly.
      process.stdout.write(`${C.green}thinkedin ›${C.reset} ${answer.trim()}\n`);
      if (cards.length) console.log(`${C.dim}— people: ${cards.slice(0, 8).join(", ")}${cards.length > 8 ? `, +${cards.length - 8} more` : ""}${C.reset}`);
      history.push({ role: "user", content: text }, { role: "assistant", content: answer });
      console.log("");
      ask();
    });
  };
  ask();
}

main().catch((e) => {
  console.error("chat failed:", e.message);
  process.exit(1);
});
