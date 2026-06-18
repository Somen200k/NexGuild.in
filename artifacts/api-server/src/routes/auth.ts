import { Router } from "express";
import { createServerClient } from "../lib/supabase-server";
import { FROM_NOREPLY, getResend, welcomeHtml } from "../lib/email";

const router = Router();

router.post("/auth/admin-check", async (req, res) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("[admin-check] SUPABASE_URL present:", !!supabaseUrl);
  console.log("[admin-check] SERVICE_ROLE_KEY present:", !!serviceKey);

  const token: string | undefined = req.body?.access_token;
  console.log("[admin-check] access_token present:", !!token);

  if (!token) {
    console.error("[admin-check] No access_token in request body");
    return res.status(400).json({ isAdmin: false, reason: "no_token" });
  }

  const admin = createServerClient();
  const { data: { user }, error: userError } = await admin.auth.getUser(token);
  console.log("[admin-check] getUser → id:", user?.id, "email:", user?.email);
  if (userError) console.error("[admin-check] getUser error:", userError.message);

  if (userError || !user) {
    return res.status(401).json({ isAdmin: false, reason: "invalid_token" });
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  console.log("[admin-check] profile:", JSON.stringify(profile));
  if (profileError) console.error("[admin-check] profileError:", profileError.message, "code:", profileError.code);

  if (profileError) {
    return res.status(500).json({ isAdmin: false, reason: "profile_error" });
  }

  const isAdmin = profile?.role === "admin" || profile?.role === "owner";
  console.log("[admin-check] role:", profile?.role, "→ isAdmin:", isAdmin);

  return res.json({ isAdmin });
});

router.post("/auth/welcome", async (req, res) => {
  const { email, name } = req.body ?? {};

  if (!email || !name) {
    return res.status(400).json({ error: "email and name required" });
  }

  const resend = getResend();
  if (!resend) {
    return res.json({ ok: true, skipped: "no RESEND_API_KEY" });
  }

  const { error } = await resend.emails.send({
    from:    FROM_NOREPLY,
    to:      email,
    subject: "Welcome to NexGuild! 🎉",
    html:    welcomeHtml(name),
  });

  if (error) console.error("[welcome-email] Resend error:", error);

  return res.json({ ok: true });
});

export default router;
