import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const admin = createServerClient();
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return null;
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as { role: string } | null)?.role !== "admin") return null;
  return { admin };
}

export async function GET(req: NextRequest) {
  const ctx = await verifyAdmin(req);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { admin } = ctx;

  const [{ data: admins }, { data: settings }] = await Promise.all([
    admin.from("profiles")
      .select("id, full_name, email, role, joined_at")
      .eq("role", "admin")
      .order("joined_at", { ascending: true }),
    admin.from("platform_settings")
      .select("key, value")
      .eq("key", "maintenance_mode")
      .limit(1),
  ]);

  const maintenance = (settings as { key: string; value: string }[] | null)?.[0]?.value === "true";

  return NextResponse.json({ admins: admins ?? [], maintenance });
}

export async function PATCH(req: NextRequest) {
  const ctx = await verifyAdmin(req);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { admin } = ctx;

  const body = await req.json().catch(() => null);
  if (!body?.action) return NextResponse.json({ error: "action required" }, { status: 400 });

  if (body.action === "maintenance") {
    const value = body.value === true ? "true" : "false";
    const { error } = await admin.from("platform_settings").upsert(
      { key: "maintenance_mode", value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, maintenance: body.value });
  }

  if (body.action === "promote") {
    const email = body.email?.trim()?.toLowerCase();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

    const { data: target } = await admin.from("profiles").select("id").eq("email", email).single();
    if (!target) return NextResponse.json({ error: "No account found with that email address." }, { status: 404 });

    const { error } = await admin.from("profiles").update({ role: "admin" }).eq("id", (target as { id: string }).id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: updated } = await admin.from("profiles")
      .select("id, full_name, email, role, joined_at")
      .eq("role", "admin")
      .order("joined_at", { ascending: true });
    return NextResponse.json({ ok: true, admins: updated ?? [] });
  }

  if (body.action === "demote") {
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await admin.from("profiles").update({ role: "contributor" }).eq("id", body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
