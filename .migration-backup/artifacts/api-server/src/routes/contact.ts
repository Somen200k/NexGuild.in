import { Router } from "express";
import { Resend } from "resend";

const router = Router();

const TO_EMAIL   = "nexguild.in@gmail.com";
const FROM_EMAIL = "noreply@nexguild.in";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

router.post("/contact", async (req, res) => {
  const { name, email, company, projectType, budget, timeline, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: "Email service not configured." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from:    `NexGuild Contact Form <${FROM_EMAIL}>`,
    to:      TO_EMAIL,
    replyTo: email,
    subject: `New Contact: ${esc(name)}${company ? ` — ${esc(company)}` : ""}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;">
        <h2 style="color:#F59E0B;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#888;width:130px;">Name</td><td>${esc(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          ${company ? `<tr><td style="padding:8px 0;color:#888;">Company</td><td>${esc(company)}</td></tr>` : ""}
          ${projectType ? `<tr><td style="padding:8px 0;color:#888;">Project Type</td><td>${esc(projectType)}</td></tr>` : ""}
          ${budget ? `<tr><td style="padding:8px 0;color:#888;">Budget</td><td>${esc(budget)}</td></tr>` : ""}
          ${timeline ? `<tr><td style="padding:8px 0;color:#888;">Timeline</td><td>${esc(timeline)}</td></tr>` : ""}
        </table>
        <h3 style="color:#F59E0B;">Message</h3>
        <p style="white-space:pre-wrap;background:#f9f9f9;padding:16px;border-radius:6px;">${esc(message)}</p>
      </div>`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return res.status(500).json({ error: "Failed to send message." });
  }
  return res.json({ success: true });
});

router.post("/contributor-contact", async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: "Email service not configured." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from:    `NexGuild <${FROM_EMAIL}>`,
    to:      TO_EMAIL,
    replyTo: email,
    subject: `Contributor Inquiry from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;">
        <h2 style="color:#14b8a6;">Contributor Inquiry</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#888;width:80px;">Name</td><td>${name}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
        </table>
        <h3 style="color:#14b8a6;">Message</h3>
        <p style="white-space:pre-wrap;background:#f9f9f9;padding:16px;border-radius:6px;">${message}</p>
      </div>`,
  });

  if (error) {
    console.error("[contributor-contact] Resend error:", error);
    return res.status(500).json({ error: "Failed to send message." });
  }
  return res.json({ success: true });
});

export default router;
