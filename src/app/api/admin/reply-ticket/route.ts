import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: caller } = await admin
      .from("profiles").select("role").eq("id", user.id).single();
    if (caller?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { ticketId, reply, closeTicket } = await req.json() as {
      ticketId: string;
      reply?: string;
      closeTicket?: boolean;
    };

    if (!ticketId) return NextResponse.json({ error: "ticketId required" }, { status: 400 });

    const { data: ticket, error: fetchErr } = await admin
      .from("support_tickets")
      .select("id, subject, contributor_id")
      .eq("id", ticketId)
      .single();

    if (fetchErr || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const newStatus = closeTicket ? "closed" : reply ? "replied" : "closed";

    const { error: updateErr } = await admin
      .from("support_tickets")
      .update({
        ...(reply ? { admin_reply: reply, replied_at: now } : {}),
        status:     newStatus,
        updated_at: now,
      })
      .eq("id", ticketId);

    if (updateErr) {
      console.error("[reply-ticket] update error:", updateErr.message);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Notify contributor
    if (reply || closeTicket) {
      const title   = closeTicket && !reply ? "Support Ticket Closed" : "Support Ticket Replied";
      const message = reply
        ? `Your ticket "${ticket.subject}" has a new reply from support.`
        : `Your ticket "${ticket.subject}" has been closed.`;

      const { error: notifErr } = await admin.from("notifications").insert({
        user_id: ticket.contributor_id,
        title,
        message,
        type: "support",
      });
      if (notifErr) console.error("[reply-ticket] notification error:", notifErr.message);
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("[reply-ticket] unhandled:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
