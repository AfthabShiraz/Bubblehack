/**
 * Timed, NON-destructive Apify scrape to (a) measure throughput and (b) capture
 * the actor's real output shape. Does NOT write to Supabase.
 *
 *   npx tsx --env-file=.env.local scripts/apify-timed.ts [--limit 10] [csvPath]
 */
import { readFileSync } from "node:fs";
import { parseConnections } from "../lib/data/connections";
import { scrapeProfiles } from "../lib/apify";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const limit = arg("--limit") ? Number(arg("--limit")) : 10;
const csvPath = process.argv.slice(2).find((a) => a.endsWith(".csv")) ?? "../Connections.csv";

async function main() {
  const conns = parseConnections(readFileSync(csvPath, "utf8"));
  const urls = conns.map((c) => c.linkedinUrl).filter((u): u is string => !!u).slice(0, limit);
  console.log(`Scraping ${urls.length} profiles in one Apify run...`);

  const t0 = Date.now();
  const items = await scrapeProfiles(urls);
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  console.log(`\n⏱  ${secs}s for ${urls.length} profiles  (~${(Number(secs) / urls.length).toFixed(1)}s/profile)`);
  console.log(`returned ${items.length} items`);

  if (items[0]) {
    if ((items[0] as Record<string, unknown>).error) {
      console.log("\n❌ actor error:", (items[0] as Record<string, unknown>).error);
      return;
    }
    console.log("\noutput keys:", Object.keys(items[0]).join(", "));
    console.log("\nfirst item (truncated):");
    console.log(JSON.stringify(items[0], null, 2).slice(0, 3000));
  }
}

main().catch((e) => {
  console.error("\n❌ apify-timed failed:", e.message);
  process.exit(1);
});
