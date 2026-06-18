import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { SupabaseClient } from "@supabase/supabase-js";

async function verifyAdmin(req: NextRequest): Promise<SupabaseClient | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const admin = createServerClient();
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) return null;
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role: string } | null)?.role;
  if (role !== "admin" && role !== "owner") return null;
  return admin;
}

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data } = await admin
    .from("voucher_inventory")
    .select("voucher_id, is_available");

  return NextResponse.json({ availability: data ?? [] });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { voucherId, isAvailable } = await req.json() as { voucherId: string; isAvailable: boolean };

  await admin
    .from("voucher_inventory")
    .upsert(
      { voucher_id: voucherId, is_available: isAvailable, updated_at: new Date().toISOString() },
      { onConflict: "voucher_id" }
    );

  return NextResponse.json({ ok: true });
}
