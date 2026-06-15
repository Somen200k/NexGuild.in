import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createServerClient();

  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // role = 'contributor' OR role IS NULL (catches new users before role is set)
  const { data, error } = await admin
    .from("profiles")
    .select("id, full_name, email, country, status, nexcoins, joined_at")
    .or("role.eq.contributor,role.is.null")
    .order("joined_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ contributors: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createServerClient();

  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: callerProfile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (callerProfile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const { contributorId, status } = body ?? {};

  if (!contributorId || !["active", "suspended", "banned"].includes(status)) {
    return NextResponse.json({ error: "contributorId and valid status are required." }, { status: 400 });
  }

  const { error } = await admin
    .from("profiles")
    .update({ status })
    .eq("id", contributorId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
