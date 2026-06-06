/**
 * Move all loaded data from one user_id to another (no re-embedding).
 * Use to point the demo-loaded network at your real Clerk user id.
 *
 *   npx tsx --env-file=.env.local scripts/restamp-user.ts --from demo --to user_2abc...
 */
import { createAdminClient } from "../lib/supabase/admin";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const from = arg("--from") ?? "demo";
const to = arg("--to");
if (!to) {
  console.error("Missing --to <clerk_user_id>");
  process.exit(1);
}

async function main() {
  const supa = createAdminClient();
  const tables = ["connections", "messages", "user_settings", "profile_research", "upload_jobs"];
  for (const t of tables) {
    const { error, count } = await supa
      .from(t)
      .update({ user_id: to }, { count: "exact" })
      .eq("user_id", from);
    if (error) console.log(`  ${t}: ERROR ${error.message}`);
    else console.log(`  ${t}: moved ${count ?? 0} rows`);
  }
  console.log(`\n✅ Re-stamped data ${from} -> ${to}\n`);
}

main().catch((e) => {
  console.error("restamp failed:", e.message);
  process.exit(1);
});
