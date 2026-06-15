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
  if ((profile as { role: string } | null)?.role !== "admin") return null;
  return admin;
}

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await admin
    .from("coupons")
    .select("id, code, discount_percent, discount_coins, max_uses, used_count, expires_at, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupons: data ?? [] });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as {
    action: "create" | "delete" | "toggle";
    id?: string;
    is_active?: boolean;
    code?: string;
    discount_type?: "percent" | "coins";
    discount_value?: number;
    max_uses?: number;
    expires_at?: string | null;
  };

  if (body.action === "create") {
    const { code, discount_type, discount_value = 0, max_uses = 1, expires_at } = body;
    if (!code?.trim()) return NextResponse.json({ error: "Code is required." }, { status: 400 });

    const { data, error } = await admin
      .from("coupons")
      .insert({
        code:             code.trim().toUpperCase(),
        discount_percent: discount_type === "percent" ? discount_value : 0,
        discount_coins:   discount_type === "coins"   ? discount_value : 0,
        max_uses:         max_uses,
        used_count:       0,
        expires_at:       expires_at || null,
        is_active:        true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ coupon: data });
  }

  if (body.action === "delete") {
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await admin.from("coupons").delete().eq("id", body.id);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "toggle") {
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await admin.from("coupons").update({ is_active: body.is_active }).eq("id", body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
