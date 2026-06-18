import { Router } from "express";
import { createServerClient } from "../lib/supabase.js";
import { getResend, welcomeHtml, FROM_NOREPLY } from "../lib/email.js";

const router = Router();

router.post("/auth/admin-check", async (req, res) => {
  const token: string | undefined = req.body?.access_token;
  if (!token) {
    return res.status(400).json({ isAdmin: false, reason: "no_token" });
  }
  try {
    const admin = createServerClient();
    const { data: { user }, error: userError } = await admin.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ isAdmin: false, reason: "invalid_token" });
    }
    const { data: profile, error: profileError } = await admin
      .from("profiles").select("role, email").eq("id", user.id).single();
    if (profileError) {
      return res.status(500).json({ isAdmin: false, reason: "profile_error" });
    }
    const isAdmin = (profile as { role: string } | null)?.role === "admin" ||
                    (profile as { role: string } | null)?.role === "owner";
    return res.json({ isAdmin });
  } catch (err) {
    console.error("[auth/admin-check] unhandled:", err);
    return res.status(500).json({ isAdmin: false, reason: "server_error" });
  }
});

router.post("/auth/welcome", async (req, res) => {
  const { email, name } = (req.body ?? {}) as { email?: string; name?: string };
  if (!email || !name) {
    return res.status(400).json({ error: "email and name required" });
  }
  const resend = getResend();
  if (!resend) {
    return res.json({ ok: true, skipped: "no RESEND_API_KEY" });
  }
  const { error } = await resend.emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: "Welcome to NexGuild! 🎉",
    html: welcomeHtml(name),
  });
  if (error) console.error("[auth/welcome] Resend error:", error);
  return res.json({ ok: true });
});

export default router;
