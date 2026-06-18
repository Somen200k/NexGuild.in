import { Router } from "express";
import { createServerClient } from "../lib/supabase.js";
import { Resend } from "resend";

const router = Router();

const CAT_LABELS: Record<string, string> = {
  general: "General Inquiry", task: "Task Issue", coins: "Payment / Coins Issue",
  account: "Account Problem", voucher: "Voucher Issue", bug: "Bug Report",
};

router.post("/support/create-ticket", async (req, res) => {
  try {
    const svc = createServerClient();
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: { user }, error: authErr } = await svc.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });

    const { subject, message, category = "general" } = req.body as {
      subject: string; message: string; category?: string;
    };
    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "subject and message required" });
    }

    const { data: profile } = await svc.from("profiles").select("full_name, email").eq("id", user.id).single();
    const contributorName  = (profile as { full_name: string | null } | null)?.full_name ?? "Contributor";
    const contributorEmail = (profile as { email: string | null } | null)?.email ?? user.email ?? "unknown";

    const { data: ticket, error: ticketErr } = await svc
      .from("support_tickets")
      .insert({ contributor_id: user.id, subject: subject.trim(), message: message.trim(), category, status: "open" })
      .select("id, subject, message, category, status, priority, admin_reply, replied_at, created_at, updated_at")
      .single();

    if (ticketErr || !ticket) {
      return res.status(500).json({ error: ticketErr?.message ?? "Insert failed" });
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const t = ticket as { id: string };
      resend.emails.send({
        from: "NexGuild <noreply@nexguild.in>",
        to:   "nexguild.in@gmail.com",
        subject: `New Support Ticket: ${subject.trim()}`,
        html: `<div style="font-family:sans-serif;max-width:560px;background:#0f0f0f;color:#e5e5e5;border-radius:12px;overflow:hidden;padding:24px;">
          <h1 style="color:#14b8a6;">New Support Ticket</h1>
          <p>From: ${contributorName} (${contributorEmail})</p>
          <p>Category: ${CAT_LABELS[category] ?? category}</p>
          <p>ID: ${t.id}</p>
          <p style="white-space:pre-wrap;">${message.trim()}</p>
        </div>`,
      }).catch((e: unknown) => console.error("[create-ticket] email error:", e));
    }

    return res.json({ ticket });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/support/send-message", async (req, res) => {
  try {
    const svc = createServerClient();
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: { user }, error: authErr } = await svc.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });

    const { ticketId, message } = req.body as { ticketId: string; message: string };
    if (!ticketId || !message?.trim()) {
      return res.status(400).json({ error: "ticketId and message required" });
    }

    const { data: ticket, error: ticketErr } = await svc
      .from("support_tickets")
      .select("id, subject, status, contributor_id")
      .eq("id", ticketId).eq("contributor_id", user.id).single();

    if (ticketErr || !ticket) return res.status(404).json({ error: "Ticket not found" });
    if ((ticket as { status: string }).status === "closed") {
      return res.status(400).json({ error: "Ticket is closed" });
    }

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

    const { data: prof } = await svc.from("profiles").select("full_name").eq("id", user.id).single();
    const contributorName = (prof as { full_name: string | null } | null)?.full_name ?? "Contributor";

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const t = ticket as { subject: string };
      resend.emails.send({
        from: "NexGuild <noreply@nexguild.in>",
        to:   "nexguild.in@gmail.com",
        subject: `Re: ${t.subject} [new reply from ${contributorName}]`,
        html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#0f0f0f;color:#e5e5e5;border-radius:12px;">
          <h2 style="color:#14b8a6;">New Reply on Ticket: ${t.subject}</h2>
          <p>${contributorName} wrote:</p>
          <p style="white-space:pre-wrap;">${message.trim()}</p>
        </div>`,
      }).catch((e: unknown) => console.error("[send-message] email error:", e));
    }

    return res.json({ message: newMsg });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
