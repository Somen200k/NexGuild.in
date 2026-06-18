import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const router = Router();

const CAT_LABELS: Record<string, string> = {
  general: "General Inquiry", task: "Task Issue", coins: "Payment / Coins Issue",
  account: "Account Problem", voucher: "Voucher Issue", bug: "Bug Report",
};

function makeAdmin() {
  return createClient(
    process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    { auth: { persistSession: false } }
  );
}

router.post("/support/create-ticket", async (req, res) => {
  const svc = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: { user }, error: authErr } = await svc.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });

    const { subject, message, category = "general" } = req.body ?? {};
    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "subject and message required" });
    }

    const { data: profile } = await svc.from("profiles").select("full_name, email").eq("id", user.id).single();
    const contributorName  = profile?.full_name ?? "Contributor";
    const contributorEmail = profile?.email ?? user.email ?? "unknown";

    const { data: ticket, error: ticketErr } = await svc
      .from("support_tickets")
      .insert({ contributor_id: user.id, subject: subject.trim(), message: message.trim(), category, status: "open" })
      .select("id, subject, message, category, status, priority, admin_reply, replied_at, created_at, updated_at")
      .single();

    if (ticketErr || !ticket) {
      console.error("[create-ticket] insert error:", ticketErr?.message);
      return res.status(500).json({ error: ticketErr?.message ?? "Insert failed" });
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "NexGuild <noreply@nexguild.in>",
        to:   "nexguild.in@gmail.com",
        subject: `New Support Ticket: ${subject.trim()}`,
        html: `<div style="font-family:sans-serif;max-width:560px;">
          <h2>New Support Ticket</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#888;width:120px;">From</td><td>${contributorName} (${contributorEmail})</td></tr>
            <tr><td style="padding:6px 0;color:#888;">Category</td><td>${CAT_LABELS[category] ?? category}</td></tr>
            <tr><td style="padding:6px 0;color:#888;">Message</td><td style="white-space:pre-wrap;">${message.trim()}</td></tr>
          </table>
          <p><a href="https://nexguild.in/admin/support">View in admin dashboard</a></p>
        </div>`,
      }).catch((e: unknown) => console.error("[create-ticket] email error:", e));
    }

    return res.json({ ticket });
  } catch (err) {
    console.error("[create-ticket] unhandled:", err);
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/support/send-message", async (req, res) => {
  const svc = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: { user }, error: authErr } = await svc.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });

    const { ticketId, message } = req.body ?? {};
    if (!ticketId || !message?.trim()) {
      return res.status(400).json({ error: "ticketId and message required" });
    }

    const { data: ticket, error: ticketErr } = await svc
      .from("support_tickets")
      .select("id, subject, status, contributor_id")
      .eq("id", ticketId)
      .eq("contributor_id", user.id)
      .single();

    if (ticketErr || !ticket) return res.status(404).json({ error: "Ticket not found" });
    if (ticket.status === "closed") return res.status(400).json({ error: "Ticket is closed" });

    const { data: newMsg, error: msgErr } = await svc
      .from("ticket_messages")
      .insert({ ticket_id: ticketId, sender_id: user.id, sender_type: "contributor", message: message.trim() })
      .select("id, ticket_id, sender_id, sender_type, message, created_at")
      .single();

    if (msgErr || !newMsg) {
      return res.status(500).json({ error: msgErr?.message ?? "Insert failed" });
    }

    await svc.from("support_tickets")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", ticketId);

    const { data: profile } = await svc.from("profiles").select("full_name").eq("id", user.id).single();
    const contributorName = profile?.full_name ?? "Contributor";

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:    "NexGuild <noreply@nexguild.in>",
        to:      "nexguild.in@gmail.com",
        subject: `Re: ${ticket.subject} [new reply from ${contributorName}]`,
        html: `<div style="font-family:sans-serif;max-width:560px;">
          <h2>New Reply on Ticket: ${ticket.subject}</h2>
          <p><strong>${contributorName}</strong> sent a follow-up: ${message.trim()}</p>
          <p><a href="https://nexguild.in/admin/support">View in admin dashboard</a></p>
        </div>`,
      }).catch((e: unknown) => console.error("[send-message] email error:", e));
    }

    return res.json({ message: newMsg });
  } catch (err) {
    console.error("[send-message] unhandled:", err);
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
