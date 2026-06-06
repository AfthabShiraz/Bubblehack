/**
 * List Clerk users (id + email) so we can find your user id after you sign up.
 *
 *   npx tsx --env-file=.env.local scripts/clerk-users.ts
 */
async function main() {
  const key = process.env.CLERK_SECRET_KEY;
  if (!key) {
    console.error("Missing CLERK_SECRET_KEY in .env.local");
    process.exit(1);
  }
  const res = await fetch("https://api.clerk.com/v1/users?limit=50&order_by=-created_at", {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.error("Clerk API error:", res.status, await res.text());
    process.exit(1);
  }
  const users = (await res.json()) as Array<{
    id: string;
    email_addresses?: { email_address: string }[];
    created_at: number;
  }>;
  if (!users.length) {
    console.log("No Clerk users yet — sign up in the app first.");
    return;
  }
  console.log(`${users.length} Clerk user(s):\n`);
  for (const u of users) {
    const email = u.email_addresses?.[0]?.email_address ?? "(no email)";
    console.log(`  ${u.id}   ${email}`);
  }
}

main().catch((e) => {
  console.error("clerk-users failed:", e.message);
  process.exit(1);
});
