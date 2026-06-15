import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

const SECTION_KEYS = [
  "maintenance_org",
  "maintenance_contributor",
  "maintenance_dashboard",
  "maintenance_store",
  "maintenance_offerwalls",
  "maintenance_signup",
] as const;

type SectionKey = typeof SECTION_KEYS[number];

async function verifyAdminOrOwner(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const admin = createServerClient();
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return null;
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role: string } | null)?.role;
  if (role !== "admin" && role !== "owner") return null;
  return { admin, userId: user.id, role };
}

export async function GET(req: NextRequest) {
  const ctx = await verifyAdminOrOwner(req);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { admin } = ctx;

  const [{ data: staff }, { data: settings }] = await Promise.all([
    admin.from("profiles")
      .select("id, full_name, email, role, joined_at")
      .or("role.eq.admin,role.eq.owner")
      .order("joined_at", { ascending: true }),
    admin.from("platform_settings")
      .select("key, value")
      .in("key", [...SECTION_KEYS]),
  ]);

  const maintenanceSections = Object.fromEntries(
    SECTION_KEYS.map((k) => [
      k.replace("maintenance_", ""),
      (settings as { key: string; value: string }[] | null)?.find((r) => r.key === k)?.value === "true",
    ])
  ) as Record<string, boolean>;

  return NextResponse.json({ admins: staff ?? [], maintenanceSections });
}

export async function PATCH(req: NextRequest) {
  const ctx = await verifyAdminOrOwner(req);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { admin, role } = ctx;

  const body = await req.json().catch(() => null);
  if (!body?.action) return NextResponse.json({ error: "action required" }, { status: 400 });

  // Section maintenance — any admin or owner
  if (body.action === "maintenance_section") {
    const section = body.section as string;
    const key = `maintenance_${section}` as SectionKey;
    if (!SECTION_KEYS.includes(key)) {
      return NextResponse.json({ error: "Invalid section." }, { status: 400 });
    }
    const value = body.value === true ? "true" : "false";
    const { error } = await admin.from("platform_settings").upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // promote / demote — owner only
  if (body.action === "promote" || body.action === "demote") {
    if (role !== "owner") {
      return NextResponse.json({ error: "Only the owner can manage admin roles." }, { status: 403 });
    }
  }

  if (body.action === "promote") {
    const email = body.email?.trim()?.toLowerCase();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

    const { data: target } = await admin.from("profiles").select("id, role").eq("email", email).single();
    if (!target) return NextResponse.json({ error: "No account found with that email address." }, { status: 404 });

    const tgt = target as { id: string; role: string };
    if (tgt.role === "owner") {
      return NextResponse.json({ error: "Cannot modify the owner account." }, { status: 403 });
    }

    const { error } = await admin.from("profiles").update({ role: "admin" }).eq("id", tgt.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: updated } = await admin.from("profiles")
      .select("id, full_name, email, role, joined_at")
      .or("role.eq.admin,role.eq.owner")
      .order("joined_at", { ascending: true });
    return NextResponse.json({ ok: true, admins: updated ?? [] });
  }

  if (body.action === "demote") {
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const { data: target } = await admin.from("profiles").select("role").eq("id", body.id).single();
    if ((target as { role: string } | null)?.role === "owner") {
      return NextResponse.json({ error: "Cannot modify the owner account." }, { status: 403 });
    }

    await admin.from("profiles").update({ role: "contributor" }).eq("id", body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
