import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

async function verifyAdminOrOwner(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const admin = createServerClient();
  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user) return null;
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role: string } | null)?.role;
  if (role !== "admin" && role !== "owner") return null;
  return { admin, role };
}

export async function GET(req: NextRequest) {
  const ctx = await verifyAdminOrOwner(req);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await ctx.admin
    .from("profiles")
    .select("id, full_name, email, country, status, nexcoins, joined_at")
    .or("role.eq.contributor,role.is.null")
    .order("joined_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contributors: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const ctx = await verifyAdminOrOwner(req);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { contributorId, status } = (body ?? {}) as { contributorId?: string; status?: string };

  if (!contributorId || !["active", "suspended", "banned"].includes(status ?? "")) {
    return NextResponse.json({ error: "contributorId and valid status are required." }, { status: 400 });
  }

  // Protect owner from being banned
  const { data: target } = await ctx.admin.from("profiles").select("role").eq("id", contributorId).single();
  if ((target as { role: string } | null)?.role === "owner") {
    return NextResponse.json({ error: "Cannot modify the owner account." }, { status: 403 });
  }

  const { error } = await ctx.admin.from("profiles").update({ status }).eq("id", contributorId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
