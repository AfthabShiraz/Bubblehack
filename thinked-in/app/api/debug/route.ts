import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// TEMPORARY unauthenticated diagnostic — REMOVE after debugging prod data access.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid") ?? "";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  let rowsAny = 0, rowsMine = 0;
  let anyErr: unknown = null, mineErr: unknown = null;
  let sampleUserIds: string[] = [];
  try {
    const supa = createAdminClient();
    const any = await supa.from("connections").select("id, user_id").limit(5);
    rowsAny = any.data?.length ?? 0;
    anyErr = any.error ?? null;
    sampleUserIds = [...new Set((any.data ?? []).map((r) => r.user_id as string))];
    if (uid) {
      const mine = await supa.from("connections").select("id").eq("user_id", uid).limit(3);
      rowsMine = mine.data?.length ?? 0;
      mineErr = mine.error ?? null;
    }
  } catch (e) {
    anyErr = e instanceof Error ? e.message : String(e);
  }

  return Response.json({
    supabaseHost: url.replace(/^https?:\/\//, "").split(".")[0],
    serviceKeyLen: svc.length,
    serviceKeyPrefix: svc.slice(0, 6),
    rowsAnyUser: rowsAny,
    rowsForUid: rowsMine,
    sampleUserIds,
    anyErr,
    mineErr,
  });
}
