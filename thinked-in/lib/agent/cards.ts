import type { ProfileCardData } from "../types";
import type { ConnectionRow } from "./retrieval";

const fullName = (r: ConnectionRow) =>
  [r.first_name, r.last_name].filter(Boolean).join(" ").trim() || "Unknown";

/** Deterministic placeholder avatar (no avatar field in our schema/CSV yet). */
function avatarFor(name: string): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
}

/** Map a retrieval row to the card shape the chat UI renders. */
export function toCard(r: ConnectionRow): ProfileCardData {
  const name = fullName(r);
  const location = r.location ?? r.country ?? null;
  return {
    id: r.id,
    name,
    position: r.position ?? "",
    company: r.company ?? "",
    location,
    avatarUrl: avatarFor(name),
    linkedinUrl: r.linkedin_url ?? "",
  };
}

/** De-dupe by id, preserving order (multiple searches can overlap). */
export function dedupeCards(cards: ProfileCardData[]): ProfileCardData[] {
  const seen = new Set<string>();
  const out: ProfileCardData[] = [];
  for (const c of cards) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}
