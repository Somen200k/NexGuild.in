import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const admin = createServerClient();
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return null;
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role: string } | null)?.role;
  if (role !== "admin" && role !== "owner") return null;
  return { admin, userId: user.id };
}

export async function POST(req: NextRequest) {
  const ctx = await verifyAdmin(req);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { title, message, target } = (body ?? {}) as { title?: string; message?: string; target?: string };
  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
  }

  const { admin, userId } = ctx;
  const targetVal = target ?? "all";

  const { data: ann, error: insertErr } = await admin
    .from("announcements")
    .insert({ title: title.trim(), message: message.trim(), target: targetVal, created_by: userId })
    .select("id, title, message, target, created_at")
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

  const { data: targetUsers } = await admin
    .from("profiles")
    .select("id, status, joined_at")
    .eq("role", "contributor");

  if (targetUsers) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const eligible = (targetUsers as { id: string; status: string; joined_at: string }[]).filter((u) => {
      if (targetVal === "all") return true;
      if (targetVal === "active") return u.status === "active";
      if (targetVal === "new") return u.joined_at >= thirtyDaysAgo;
      return true;
    });
    if (eligible.length > 0) {
      await admin.from("notifications").insert(
        eligible.map((u) => ({
          user_id: u.id,
          title: `📢 ${title.trim()}`,
          message: message.trim(),
          type: "announcement",
        }))
      );
    }
  }

  return NextResponse.json({ ok: true, announcement: ann });
}
