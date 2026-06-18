import { Router } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createServerClient, createAnonClient } from "../lib/supabase-server";
import {
  FROM_NOREPLY, getResend,
  taskApprovedHtml, taskRejectedHtml, resubmissionRequestedHtml,
  newTaskHtml, announcementHtml, coinsReceivedHtml, coinsDeductedHtml,
  accountBannedHtml, assignmentApprovedHtml, assignmentRejectedHtml,
} from "../lib/email";
import { Resend } from "resend";

const router = Router();

function makeAdmin(): SupabaseClient {
  return createClient(
    process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    { auth: { persistSession: false } }
  );
}

async function verifyAdminToken(token: string): Promise<{ admin: SupabaseClient; user: { id: string } } | null> {
  const admin = createServerClient();
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) return null;
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role: string } | null)?.role;
  if (role !== "admin" && role !== "owner") return null;
  return { admin, user };
}

// ── Stats ────────────────────────────────────────────────────────────────────

router.get("/admin/stats", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { admin } = ctx;
  const [
    { count: contributors },
    { count: activeTasks },
    { count: pendingReviews },
    { count: pendingAssignments },
    { count: pendingVouchers },
    { data: coinsData },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "contributor"),
    admin.from("tasks").select("*", { count: "exact", head: true }).eq("status", "active"),
    admin.from("submissions").select("*", { count: "exact", head: true }).in("status", ["submitted", "pending"]),
    admin.from("assignments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("voucher_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("submissions").select("coins_awarded").eq("status", "approved"),
  ]);

  const totalCoins = (coinsData ?? []).reduce(
    (s: number, r: { coins_awarded: number | null }) => s + (r.coins_awarded ?? 0), 0
  );

  return res.json({ contributors: contributors ?? 0, activeTasks: activeTasks ?? 0, pendingReviews: pendingReviews ?? 0, pendingAssignments: pendingAssignments ?? 0, pendingVouchers: pendingVouchers ?? 0, totalCoins });
});

// ── Contributors ─────────────────────────────────────────────────────────────

router.get("/admin/contributors", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await ctx.admin
    .from("profiles")
    .select("id, full_name, email, country, status, nexcoins, joined_at")
    .or("role.eq.contributor,role.is.null")
    .order("joined_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ contributors: data ?? [] });
});

router.patch("/admin/contributors", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { contributorId, status, reason } = req.body ?? {};
  if (!contributorId || !["active", "suspended", "banned"].includes(status ?? "")) {
    return res.status(400).json({ error: "contributorId and valid status are required." });
  }
  if (status === "banned" && !reason?.trim()) {
    return res.status(400).json({ error: "A ban reason is required." });
  }

  const { data: target } = await ctx.admin.from("profiles").select("role, full_name, email").eq("id", contributorId).single();
  const t = target as { role: string; full_name: string | null; email: string | null } | null;
  if (t?.role === "owner") return res.status(403).json({ error: "Cannot modify the owner account." });

  const { error } = await ctx.admin.from("profiles").update({ status }).eq("id", contributorId);
  if (error) return res.status(500).json({ error: error.message });

  if (status === "banned") {
    await ctx.admin.auth.admin.signOut(contributorId, "others").catch(() => {});
    const resend = getResend();
    if (resend && t?.email) {
      resend.emails.send({ from: FROM_NOREPLY, to: t.email, subject: "Your NexGuild account has been suspended", html: accountBannedHtml(t.full_name ?? "Contributor", reason.trim()) }).catch((e: unknown) => console.error("[ban] email error:", e));
    }
  }
  return res.json({ ok: true });
});

router.get("/admin/contributors/:id", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.params;
  const [
    { data: profile },
    { data: submissions },
    { data: transactions },
    { data: tickets },
  ] = await Promise.all([
    ctx.admin.from("profiles").select("id, full_name, email, country, status, nexcoins, joined_at, role").eq("id", id).single(),
    ctx.admin.from("submissions").select("id, status, coins_awarded, submitted_at, tasks(title)").eq("contributor_id", id).order("submitted_at", { ascending: false }).limit(20),
    ctx.admin.from("coin_transactions").select("id, type, amount, description, created_at").eq("contributor_id", id).order("created_at", { ascending: false }).limit(20),
    ctx.admin.from("support_tickets").select("id, subject, status, created_at").eq("contributor_id", id).order("created_at", { ascending: false }).limit(10),
  ]);

  if (!profile) return res.status(404).json({ error: "Not found" });
  return res.json({ profile, submissions: submissions ?? [], transactions: transactions ?? [], tickets: tickets ?? [] });
});

router.delete("/admin/contributors/:id", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.params;
  const { data: target } = await ctx.admin.from("profiles").select("role").eq("id", id).single();
  if ((target as { role: string } | null)?.role === "owner") return res.status(403).json({ error: "Cannot delete the owner account." });

  await ctx.admin.from("profiles").delete().eq("id", id);
  const { error } = await ctx.admin.auth.admin.deleteUser(id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true });
});

// ── Tasks ─────────────────────────────────────────────────────────────────────

router.post("/admin/tasks", async (req, res) => {
  const admin = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });

    const { data: caller } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (caller?.role !== "admin" && caller?.role !== "owner") return res.status(403).json({ error: "Forbidden" });

    const { title, task_type, description, requirements, pay_per_task, total_slots, deadline, assignment_required, assignment_type, required_language, required_skills, is_private, is_featured, validation_time, payment_time, terms, steps, assignment_instructions, assignment_questions, assignment_passing_score, status } = req.body ?? {};

    if (!title?.trim() || !task_type || !description?.trim()) {
      return res.status(400).json({ error: "title, task_type, and description are required." });
    }

    const { data: task, error: insertErr } = await admin.from("tasks").insert({
      title: title.trim(), task_type, description: description.trim(),
      requirements: requirements?.trim() || null, pay_per_task: pay_per_task ?? null,
      total_slots: total_slots ?? null, deadline: deadline || null,
      assignment_required: assignment_required ?? false,
      assignment_type: assignment_required ? (assignment_type ?? "text") : null,
      assignment_instructions: assignment_required ? (assignment_instructions ?? null) : null,
      assignment_questions: assignment_required ? (assignment_questions ?? []) : [],
      assignment_passing_score: assignment_passing_score ?? 70,
      required_language: required_language ?? "Any", required_skills: required_skills ?? [],
      is_private: is_private ?? false, is_featured: is_featured ?? false,
      validation_time: validation_time ?? "48 hours", payment_time: payment_time ?? "72 hours",
      terms: terms?.trim() || null, steps: steps ?? [], status,
    }).select("id, title, task_type, pay_per_task, total_slots").single();

    if (insertErr || !task) {
      console.error("[admin/tasks] insert error:", insertErr?.message);
      return res.status(500).json({ error: insertErr?.message ?? "Failed to create task" });
    }

    if (status === "active") {
      const resend = getResend();
      if (resend) {
        const { data: contributors } = await admin.from("profiles").select("full_name, email").eq("role", "contributor").not("email", "is", null);
        const profiles = (contributors ?? []) as { full_name: string | null; email: string }[];
        if (profiles.length > 0) {
          const emails = profiles.map((p) => ({ from: FROM_NOREPLY, to: p.email, subject: `New task available: ${task.title}`, html: newTaskHtml(p.full_name ?? "Contributor", task.title, task.task_type ?? "", task.pay_per_task ?? 0, task.total_slots ?? null, task.id) }));
          const CHUNK = 100;
          for (let i = 0; i < emails.length; i += CHUNK) {
            const { error: batchErr } = await resend.batch.send(emails.slice(i, i + CHUNK));
            if (batchErr) console.error("[admin/tasks] batch email error:", batchErr);
          }
        }
      }
    }
    return res.json({ ok: true, task });
  } catch (err) {
    console.error("[admin/tasks] unhandled:", err);
    return res.status(500).json({ error: String(err) });
  }
});

// ── Submissions ───────────────────────────────────────────────────────────────

router.get("/admin/submissions", async (req, res) => {
  const admin = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });
    const { data: caller } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (caller?.role !== "admin" && caller?.role !== "owner") return res.status(403).json({ error: "Forbidden" });

    const { data, error } = await admin.from("submissions").select(`id, contributor_id, status, notes, files, coins_awarded, feedback, submitted_at, tasks ( id, title, pay_per_task ), profiles ( full_name, email )`).order("submitted_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ submissions: data ?? [] });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/admin/review-submission", async (req, res) => {
  const admin = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });
    const { data: callerProfile } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (callerProfile?.role !== "admin" && callerProfile?.role !== "owner") return res.status(403).json({ error: "Forbidden" });

    const { submissionId, action, feedback, coinsOverride } = req.body ?? {};
    const { data: sub, error: subFetchErr } = await admin.from("submissions").select("id, contributor_id, tasks(pay_per_task, title)").eq("id", submissionId).single();
    if (subFetchErr || !sub) return res.status(404).json({ error: "Submission not found" });

    const now = new Date().toISOString();
    const taskMeta = sub.tasks as unknown as { pay_per_task: number | null; title: string } | null;
    const taskTitle = taskMeta?.title ?? "a task";

    if (action === "approve") {
      const coins: number = coinsOverride ?? taskMeta?.pay_per_task ?? 0;
      const { error: e1 } = await admin.from("submissions").update({ status: "approved", coins_awarded: coins, feedback: feedback ?? null, reviewed_by: user.id, reviewed_at: now }).eq("id", submissionId);
      if (e1) return res.status(500).json({ error: "Failed to update submission: " + e1.message });

      const { error: e2 } = await admin.rpc("increment_nexcoins", { p_contributor_id: sub.contributor_id, p_coins: coins });
      if (e2) {
        const { data: p } = await admin.from("profiles").select("nexcoins").eq("id", sub.contributor_id).single();
        const current = (p as { nexcoins: number | null } | null)?.nexcoins ?? 0;
        await admin.from("profiles").update({ nexcoins: current + coins }).eq("id", sub.contributor_id);
      }

      await admin.from("coin_transactions").insert({ contributor_id: sub.contributor_id, amount: coins, type: "earned", source: "task", description: `Task approved: ${taskTitle}` });
      await admin.from("notifications").insert({ user_id: sub.contributor_id, title: "Submission Approved!", message: `Your submission for "${taskTitle}" was approved. +${coins} NexCoins added.`, type: "submission_approved" });

      const resend = getResend();
      if (resend) {
        const { data: contrib } = await admin.from("profiles").select("full_name, email, nexcoins").eq("id", sub.contributor_id).single();
        const p = contrib as { full_name: string | null; email: string | null; nexcoins: number | null } | null;
        if (p?.email) {
          resend.emails.send({ from: FROM_NOREPLY, to: p.email, subject: `Your submission was approved! +${coins} NexCoins`, html: taskApprovedHtml(p.full_name ?? "Contributor", taskTitle, coins, p.nexcoins ?? coins) }).catch((e: unknown) => console.error("[review-submission] email error:", e));
        }
      }
      return res.json({ success: true, coins_awarded: coins });
    }

    if (action === "reject") {
      await admin.from("submissions").update({ status: "rejected", feedback: feedback ?? null, reviewed_by: user.id, reviewed_at: now }).eq("id", submissionId);
      await admin.from("notifications").insert({ user_id: sub.contributor_id, title: "Submission Rejected", message: `Your submission for "${taskTitle}" was not approved.${feedback ? ` Reason: ${feedback}` : ""} You can re-submit.`, type: "submission_rejected" });
      const resend = getResend();
      if (resend) {
        const { data: contrib } = await admin.from("profiles").select("full_name, email").eq("id", sub.contributor_id).single();
        const p = contrib as { full_name: string | null; email: string | null } | null;
        if (p?.email) resend.emails.send({ from: FROM_NOREPLY, to: p.email, subject: `Submission feedback — ${taskTitle}`, html: taskRejectedHtml(p.full_name ?? "Contributor", taskTitle, feedback ?? null) }).catch((e: unknown) => console.error("[review-submission] reject email error:", e));
      }
      return res.json({ success: true });
    }

    if (action === "request_resubmit") {
      if (!feedback?.trim()) return res.status(400).json({ error: "Feedback is required when requesting resubmission" });
      await admin.from("submissions").update({ status: "resubmit_requested", feedback: feedback.trim(), reviewed_by: user.id, reviewed_at: now }).eq("id", submissionId);
      await admin.from("notifications").insert({ user_id: sub.contributor_id, title: "Changes Requested", message: `Admin requested changes to your submission for "${taskTitle}". Tap to resubmit.`, type: "resubmit_requested" });
      const resend = getResend();
      if (resend) {
        const { data: contrib } = await admin.from("profiles").select("full_name, email").eq("id", sub.contributor_id).single();
        const p = contrib as { full_name: string | null; email: string | null } | null;
        if (p?.email) resend.emails.send({ from: FROM_NOREPLY, to: p.email, subject: `Changes requested for your submission — ${taskTitle}`, html: resubmissionRequestedHtml(p.full_name ?? "Contributor", taskTitle, feedback.trim()) }).catch((e: unknown) => console.error("[review-submission] resubmit email error:", e));
      }
      return res.json({ success: true });
    }
    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error("[review-submission] unhandled:", err);
    return res.status(500).json({ error: String(err) });
  }
});

// ── Send / Deduct Coins ───────────────────────────────────────────────────────

router.post("/admin/send-coins", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { contributorId, amount, reason } = req.body ?? {};
  if (!contributorId) return res.status(400).json({ error: "contributorId is required." });
  if (!amount || amount <= 0 || !Number.isInteger(amount)) return res.status(400).json({ error: "Amount must be a positive integer." });

  const { data: profile } = await ctx.admin.from("profiles").select("nexcoins, full_name, email").eq("id", contributorId).single();
  if (!profile) return res.status(404).json({ error: "Contributor not found." });
  const p = profile as { nexcoins: number; full_name: string | null; email: string | null };
  const newBalance = (p.nexcoins ?? 0) + amount;
  await ctx.admin.from("profiles").update({ nexcoins: newBalance }).eq("id", contributorId);
  await ctx.admin.from("coin_transactions").insert({ contributor_id: contributorId, amount, type: "bonus", source: "admin", description: reason?.trim() || "Bonus NexCoins from admin", created_at: new Date().toISOString() });
  await ctx.admin.from("notifications").insert({ user_id: contributorId, title: `You received ${amount.toLocaleString()} bonus NexCoins!`, message: reason?.trim() ? `${amount.toLocaleString()} NexCoins added. Reason: ${reason.trim()}` : `${amount.toLocaleString()} NexCoins have been added to your account.`, type: "bonus_coins" });

  const resend = getResend();
  if (resend && p.email) resend.emails.send({ from: FROM_NOREPLY, to: p.email, subject: `You received ${amount.toLocaleString()} NexCoins! 🎉`, html: coinsReceivedHtml(p.full_name ?? "Contributor", amount, reason?.trim() || null, newBalance) }).catch((e: unknown) => console.error("[send-coins] email error:", e));

  return res.json({ success: true, newBalance, amountSent: amount });
});

router.post("/admin/deduct-coins", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { contributorId, amount, reason } = req.body ?? {};
  if (!contributorId) return res.status(400).json({ error: "contributorId is required." });
  if (!amount || amount <= 0 || !Number.isInteger(amount)) return res.status(400).json({ error: "Amount must be a positive integer." });

  const { data: profile } = await ctx.admin.from("profiles").select("nexcoins, full_name, email").eq("id", contributorId).single();
  if (!profile) return res.status(404).json({ error: "Contributor not found." });
  const p = profile as { nexcoins: number; full_name: string | null; email: string | null };
  const current = p.nexcoins ?? 0;
  const newBalance = Math.max(0, current - amount);
  const deducted = current - newBalance;
  if (deducted === 0) return res.status(400).json({ error: "Contributor has 0 coins — nothing to deduct." });

  await ctx.admin.from("profiles").update({ nexcoins: newBalance }).eq("id", contributorId);
  await ctx.admin.from("coin_transactions").insert({ contributor_id: contributorId, amount: deducted, type: "deducted", source: "admin", description: reason?.trim() || "Coins deducted by admin", created_at: new Date().toISOString() });
  await ctx.admin.from("notifications").insert({ user_id: contributorId, title: `${deducted.toLocaleString()} NexCoins deducted`, message: reason?.trim() ? `${deducted.toLocaleString()} NexCoins have been deducted. Reason: ${reason.trim()}` : `${deducted.toLocaleString()} NexCoins have been deducted by the admin.`, type: "system" });

  const resend = getResend();
  if (resend && p.email) resend.emails.send({ from: FROM_NOREPLY, to: p.email, subject: `${deducted.toLocaleString()} NexCoins deducted`, html: coinsDeductedHtml(p.full_name ?? "Contributor", deducted, reason?.trim() || null, newBalance) }).catch((e: unknown) => console.error("[deduct-coins] email error:", e));

  return res.json({ success: true, newBalance, amountDeducted: deducted });
});

// ── Announcements ─────────────────────────────────────────────────────────────

router.post("/admin/announcements", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { title, message, target } = req.body ?? {};
  if (!title?.trim() || !message?.trim()) return res.status(400).json({ error: "Title and message are required." });

  const targetVal = target ?? "all";
  const { data: ann, error: insertErr } = await ctx.admin.from("announcements").insert({ title: title.trim(), message: message.trim(), target: targetVal, created_by: ctx.user.id }).select("id, title, message, target, created_at").single();
  if (insertErr) return res.status(500).json({ error: insertErr.message });

  let query = ctx.admin.from("profiles").select("id, full_name, email");
  if (targetVal === "all") { query = query.in("role", ["contributor", "admin", "owner"]); }
  else if (targetVal === "active") { query = query.eq("role", "contributor").eq("status", "active"); }
  else if (targetVal === "new") { const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); query = query.eq("role", "contributor").gte("joined_at", thirtyDaysAgo); }
  else { query = query.in("role", ["contributor", "admin", "owner"]); }

  const { data: targetUsers } = await query;
  const users = (targetUsers ?? []) as { id: string; full_name: string | null; email: string | null }[];

  let notifsSent = 0;
  if (users.length > 0) {
    const rows = users.map((u) => ({ user_id: u.id, title: `📢 ${title.trim()}`, message: message.trim(), type: "announcement", is_read: false }));
    const { error: notifErr } = await ctx.admin.from("notifications").insert(rows);
    if (!notifErr) notifsSent = rows.length;

    const resend = getResend();
    if (resend) {
      const withEmail = users.filter((u) => !!u.email);
      const emails = withEmail.map((u) => ({ from: FROM_NOREPLY, to: u.email!, subject: `[NexGuild] ${title.trim()}`, html: announcementHtml(u.full_name ?? "Contributor", title.trim(), message.trim()) }));
      const CHUNK = 100;
      for (let i = 0; i < emails.length; i += CHUNK) {
        const { error: batchErr } = await resend.batch.send(emails.slice(i, i + CHUNK));
        if (batchErr) console.error("[announcements] batch email error:", batchErr);
      }
    }
  }
  return res.json({ ok: true, announcement: ann, notifsSent });
});

// ── Assignments ───────────────────────────────────────────────────────────────

router.get("/admin/assignments", async (req, res) => {
  const admin = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });
    const { data: caller } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (caller?.role !== "admin" && caller?.role !== "owner") return res.status(403).json({ error: "Forbidden" });

    const { data, error } = await admin.from("assignments").select(`id, contributor_id, task_id, submission_type, answers, file_url, status, feedback, submitted_at, tasks ( id, title, assignment_type, assignment_questions, assignment_passing_score ), profiles ( full_name, email )`).order("submitted_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ assignments: data ?? [] });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/admin/review-assignment", async (req, res) => {
  const admin = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });
    const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin" && profile?.role !== "owner") return res.status(403).json({ error: "Forbidden" });

    const { assignmentId, action, feedback } = req.body ?? {};
    const { data: assignment, error: aErr } = await admin.from("assignments").select("*, tasks(id, title)").eq("id", assignmentId).single();
    if (aErr || !assignment) return res.status(404).json({ error: "Assignment not found" });

    const taskMeta = assignment.tasks as unknown as { id: string; title: string } | null;
    const taskTitle = taskMeta?.title ?? "a task";
    const taskId    = taskMeta?.id ?? "";
    const now = new Date().toISOString();

    await admin.from("assignments").update({ status: action === "approve" ? "approved" : "rejected", feedback: feedback ?? null, reviewed_by: user.id, reviewed_at: now }).eq("id", assignmentId);

    if (action === "approve") {
      await admin.from("notifications").insert({ user_id: assignment.contributor_id, title: "Assignment Approved!", message: `Your assignment for "${taskTitle}" was approved.`, type: "assignment_approved" });
    } else {
      await admin.from("notifications").insert({ user_id: assignment.contributor_id, title: "Assignment Rejected", message: `Your assignment for "${taskTitle}" was not approved.${feedback ? ` Reason: ${feedback}` : ""}`, type: "assignment_rejected" });
    }

    const resend = getResend();
    if (resend) {
      const { data: contrib } = await admin.from("profiles").select("full_name, email").eq("id", assignment.contributor_id).single();
      const p = contrib as { full_name: string | null; email: string | null } | null;
      if (p?.email) {
        if (action === "approve") {
          resend.emails.send({ from: FROM_NOREPLY, to: p.email, subject: `Assignment approved! You can now start "${taskTitle}"`, html: assignmentApprovedHtml(p.full_name ?? "Contributor", taskTitle, taskId) }).catch((e: unknown) => console.error("[review-assignment] email error:", e));
        } else {
          resend.emails.send({ from: FROM_NOREPLY, to: p.email, subject: `Assignment feedback — ${taskTitle}`, html: assignmentRejectedHtml(p.full_name ?? "Contributor", taskTitle, feedback ?? null) }).catch((e: unknown) => console.error("[review-assignment] email error:", e));
        }
      }
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// ── Projects ──────────────────────────────────────────────────────────────────

router.get("/admin/projects", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await ctx.admin.from("projects").select("id, name, client_name, project_type, budget, deadline, status, created_at").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ projects: data ?? [] });
});

router.post("/admin/projects", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body ?? {};
  if (!body.name?.trim()) return res.status(400).json({ error: "Project name is required." });

  const { data, error } = await ctx.admin.from("projects").insert({ name: body.name.trim(), client_name: body.client_name?.trim() || null, description: body.description?.trim() || null, project_type: body.project_type?.trim() || null, budget: body.budget ? parseFloat(body.budget) : null, deadline: body.deadline || null, status: body.status || "active", notes: body.notes?.trim() || null, created_by: ctx.user.id }).select("id").single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true, id: (data as { id: string }).id });
});

// ── Reply Ticket ──────────────────────────────────────────────────────────────

router.post("/admin/reply-ticket", async (req, res) => {
  const admin = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });
    const { data: caller } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (caller?.role !== "admin" && caller?.role !== "owner") return res.status(403).json({ error: "Forbidden" });

    const { ticketId, reply, closeTicket } = req.body ?? {};
    if (!ticketId) return res.status(400).json({ error: "ticketId required" });

    const { data: ticket, error: fetchErr } = await admin.from("support_tickets").select("id, subject, contributor_id, profiles(full_name, email)").eq("id", ticketId).single();
    if (fetchErr || !ticket) return res.status(404).json({ error: "Ticket not found" });

    type Profile = { full_name: string | null; email: string | null };
    const contributor  = ticket.profiles as unknown as Profile | null;
    const contribEmail = contributor?.email ?? null;
    const contribName  = contributor?.full_name ?? "Contributor";

    const now = new Date().toISOString();
    const newStatus = closeTicket ? "closed" : reply ? "replied" : "closed";

    await admin.from("support_tickets").update({ ...(reply ? { admin_reply: reply, replied_at: now } : {}), status: newStatus, updated_at: now }).eq("id", ticketId);

    let newMsg = null;
    if (reply) {
      const { data: msgData } = await admin.from("ticket_messages").insert({ ticket_id: ticketId, sender_id: user.id, sender_type: "admin", message: reply }).select("id, ticket_id, sender_id, sender_type, message, created_at").single();
      newMsg = msgData;
    }

    if (reply || closeTicket) {
      const title   = closeTicket && !reply ? "Support Ticket Closed" : "Support Ticket Replied";
      const message = reply ? `Your ticket "${ticket.subject}" has a new reply from support.` : `Your ticket "${ticket.subject}" has been closed.`;
      await admin.from("notifications").insert({ user_id: ticket.contributor_id, title, message, type: "support" });
    }

    if (reply && process.env.RESEND_API_KEY && contribEmail) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({ from: "NexGuild <noreply@nexguild.in>", to: contribEmail, subject: `Re: ${ticket.subject}`, html: `<div style="font-family:sans-serif;max-width:560px;"><h2>Support Reply: ${ticket.subject}</h2><p>Hi ${contribName}, here is our reply:</p><p style="white-space:pre-wrap;">${reply}</p><p><a href="https://nexguild.in/dashboard/support">View in your dashboard</a></p></div>` }).catch((e: unknown) => console.error("[reply-ticket] email error:", e));
    }
    return res.json({ success: true, status: newStatus, message: newMsg });
  } catch (err) {
    console.error("[reply-ticket] unhandled:", err);
    return res.status(500).json({ error: String(err) });
  }
});

// ── Deliver Voucher ───────────────────────────────────────────────────────────

router.post("/admin/deliver-voucher", async (req, res) => {
  const admin = makeAdmin();
  try {
    const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });
    const { data: callerProfile } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (callerProfile?.role !== "admin" && callerProfile?.role !== "owner") return res.status(403).json({ error: "Forbidden" });

    const { requestId, voucherCode } = req.body ?? {};
    if (!requestId || !voucherCode?.trim()) return res.status(400).json({ error: "requestId and voucherCode are required" });

    const { data: vr, error: fetchErr } = await admin.from("voucher_requests").select("id, voucher_type, coins_spent, contributor_id, profiles(full_name, email)").eq("id", requestId).single();
    if (fetchErr || !vr) return res.status(404).json({ error: "Voucher request not found" });

    const deliveredAt = new Date().toISOString();
    const { error: updateErr } = await admin.from("voucher_requests").update({ status: "delivered", voucher_code: voucherCode.trim(), delivered_at: deliveredAt }).eq("id", requestId);
    if (updateErr) return res.status(500).json({ error: "Failed to update: " + updateErr.message });

    type Profile = { full_name: string | null; email: string | null };
    const contributor = vr.profiles as unknown as Profile | null;
    const name  = contributor?.full_name ?? "Contributor";
    const email = contributor?.email ?? null;

    if (process.env.RESEND_API_KEY && email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      resend.emails.send({ from: "NexGuild <noreply@nexguild.in>", to: email, subject: "Your NexGuild Voucher is Ready!", html: `<div style="font-family:sans-serif;max-width:560px;"><h2>Voucher Delivered!</h2><p>Hi ${name}, your <strong>${vr.voucher_type}</strong> voucher is ready.</p><p style="font-size:24px;font-weight:bold;color:#14b8a6;">${voucherCode.trim()}</p><p>You can also find it in your dashboard under Store → My Requests.</p></div>` }).catch((e: unknown) => console.error("[deliver-voucher] email error:", e));
    }

    await admin.from("notifications").insert({ user_id: vr.contributor_id, title: "Voucher Delivered!", message: `Your ${vr.voucher_type} code is ready. Check My Vouchers in your dashboard.`, type: "voucher" });
    return res.json({ success: true });
  } catch (err) {
    console.error("[deliver-voucher] unhandled:", err);
    return res.status(500).json({ error: String(err) });
  }
});

// ── Settings ──────────────────────────────────────────────────────────────────

const SECTION_KEYS = ["maintenance_org","maintenance_contributor","maintenance_dashboard","maintenance_store","maintenance_offerwalls","maintenance_signup"] as const;
type SectionKey = typeof SECTION_KEYS[number];

router.get("/admin/settings", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const [{ data: staff }, { data: settings }] = await Promise.all([
    ctx.admin.from("profiles").select("id, full_name, email, role, joined_at").or("role.eq.admin,role.eq.owner").order("joined_at", { ascending: true }),
    ctx.admin.from("platform_settings").select("key, value").in("key", [...SECTION_KEYS]),
  ]);

  const maintenanceSections = Object.fromEntries(SECTION_KEYS.map((k) => [k.replace("maintenance_", ""), (settings as { key: string; value: string }[] | null)?.find((r) => r.key === k)?.value === "true"]));
  return res.json({ admins: staff ?? [], maintenanceSections });
});

router.patch("/admin/settings", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body ?? {};
  if (!body.action) return res.status(400).json({ error: "action required" });

  if (body.action === "maintenance_section") {
    const key = `maintenance_${body.section}` as SectionKey;
    if (!SECTION_KEYS.includes(key)) return res.status(400).json({ error: "Invalid section." });
    const value = body.value === true ? "true" : "false";
    const { error } = await ctx.admin.from("platform_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }

  if (body.action === "promote") {
    const { data: caller } = await ctx.admin.from("profiles").select("role").eq("id", ctx.user.id).single();
    if ((caller as { role: string } | null)?.role !== "owner") return res.status(403).json({ error: "Only the owner can manage admin roles." });
    const email = body.email?.trim()?.toLowerCase();
    if (!email) return res.status(400).json({ error: "email required" });
    const { data: target } = await ctx.admin.from("profiles").select("id, role").eq("email", email).single();
    if (!target) return res.status(404).json({ error: "No account found with that email address." });
    const tgt = target as { id: string; role: string };
    if (tgt.role === "owner") return res.status(403).json({ error: "Cannot modify the owner account." });
    const { error } = await ctx.admin.from("profiles").update({ role: "admin" }).eq("id", tgt.id);
    if (error) return res.status(500).json({ error: error.message });
    const { data: updated } = await ctx.admin.from("profiles").select("id, full_name, email, role, joined_at").or("role.eq.admin,role.eq.owner").order("joined_at", { ascending: true });
    return res.json({ ok: true, admins: updated ?? [] });
  }

  if (body.action === "demote") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    const { data: target } = await ctx.admin.from("profiles").select("role").eq("id", body.id).single();
    if ((target as { role: string } | null)?.role === "owner") return res.status(403).json({ error: "Cannot modify the owner account." });
    await ctx.admin.from("profiles").update({ role: "contributor" }).eq("id", body.id);
    return res.json({ ok: true });
  }
  return res.status(400).json({ error: "Unknown action" });
});

// ── Coupons ───────────────────────────────────────────────────────────────────

router.get("/admin/coupons", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(403).json({ error: "Forbidden" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(403).json({ error: "Forbidden" });

  const { data, error } = await ctx.admin.from("coupons").select("id, code, discount_percent, discount_coins, max_uses, used_count, expires_at, is_active, created_at").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ coupons: data ?? [] });
});

router.post("/admin/coupons", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(403).json({ error: "Forbidden" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(403).json({ error: "Forbidden" });

  const body = req.body ?? {};
  if (body.action === "create") {
    const { code, discount_type, discount_value = 0, max_uses = 1, expires_at } = body;
    if (!code?.trim()) return res.status(400).json({ error: "Code is required." });
    const { data, error } = await ctx.admin.from("coupons").insert({ code: code.trim().toUpperCase(), discount_percent: discount_type === "percent" ? discount_value : 0, discount_coins: discount_type === "coins" ? discount_value : 0, max_uses, used_count: 0, expires_at: expires_at || null, is_active: true }).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ coupon: data });
  }
  if (body.action === "delete") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    await ctx.admin.from("coupons").delete().eq("id", body.id);
    return res.json({ ok: true });
  }
  if (body.action === "toggle") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    await ctx.admin.from("coupons").update({ is_active: body.is_active }).eq("id", body.id);
    return res.json({ ok: true });
  }
  return res.status(400).json({ error: "Unknown action" });
});

// ── Voucher Catalog ───────────────────────────────────────────────────────────

router.get("/admin/voucher-catalog", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(403).json({ error: "Forbidden" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(403).json({ error: "Forbidden" });

  const { data, error } = await ctx.admin.from("voucher_inventory").select("id, brand_name, description, value_inr, coins_required, category, emoji, is_available, created_at").order("brand_name").order("value_inr");
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ vouchers: data ?? [] });
});

router.post("/admin/voucher-catalog", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(403).json({ error: "Forbidden" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(403).json({ error: "Forbidden" });

  const body = req.body ?? {};
  if (body.action === "create") {
    const { brand_name, description, value_inr, coins_required, category, emoji } = body;
    if (!brand_name?.trim()) return res.status(400).json({ error: "Brand name is required." });
    if (!value_inr || value_inr <= 0) return res.status(400).json({ error: "Value must be positive." });
    if (!coins_required || coins_required <= 0) return res.status(400).json({ error: "Coins required must be positive." });
    const { data, error } = await ctx.admin.from("voucher_inventory").insert({ brand_name: brand_name.trim(), description: description?.trim() ?? "", value_inr, coins_required, category: category ?? "shopping", emoji: emoji?.trim() || "🎁", is_available: true }).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ voucher: data });
  }
  if (body.action === "update") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    const updates: Record<string, unknown> = {};
    if (body.brand_name !== undefined) updates.brand_name = body.brand_name.trim();
    if (body.description !== undefined) updates.description = body.description.trim();
    if (body.value_inr !== undefined) updates.value_inr = body.value_inr;
    if (body.coins_required !== undefined) updates.coins_required = body.coins_required;
    if (body.category !== undefined) updates.category = body.category;
    if (body.emoji !== undefined) updates.emoji = body.emoji.trim() || "🎁";
    const { data, error } = await ctx.admin.from("voucher_inventory").update(updates).eq("id", body.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ voucher: data });
  }
  if (body.action === "toggle") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    const { data, error } = await ctx.admin.from("voucher_inventory").update({ is_available: body.is_available }).eq("id", body.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ voucher: data });
  }
  if (body.action === "delete") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    const { error } = await ctx.admin.from("voucher_inventory").delete().eq("id", body.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ ok: true });
  }
  return res.status(400).json({ error: "Unknown action" });
});

// ── Voucher Availability ──────────────────────────────────────────────────────

router.get("/admin/voucher-availability", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(403).json({ error: "Forbidden" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(403).json({ error: "Forbidden" });
  const { data } = await ctx.admin.from("voucher_inventory").select("voucher_id, is_available");
  return res.json({ availability: data ?? [] });
});

router.post("/admin/voucher-availability", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(403).json({ error: "Forbidden" });
  const ctx = await verifyAdminToken(token);
  if (!ctx) return res.status(403).json({ error: "Forbidden" });
  const { voucherId, isAvailable } = req.body ?? {};
  await ctx.admin.from("voucher_inventory").upsert({ voucher_id: voucherId, is_available: isAvailable, updated_at: new Date().toISOString() }, { onConflict: "voucher_id" });
  return res.json({ ok: true });
});

// ── Task Analytics ────────────────────────────────────────────────────────────

router.get("/admin/task-analytics", async (req, res) => {
  const token = (req.headers["authorization"] as string | undefined)?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const anon = createAnonClient();
  const { data: { user } } = await anon.auth.getUser(token);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const srv = createServerClient();
  const { data: profile } = await srv.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "owner") return res.status(401).json({ error: "Unauthorized" });

  const { data: submissions, error } = await srv.from("submissions").select("task_id, status, submitted_at, reviewed_at, tasks(title, task_type)");
  if (error) return res.status(500).json({ error: error.message });

  type Row = { task_id: string; status: string; submitted_at: string; reviewed_at: string | null; tasks: { title: string; task_type: string | null } | null };
  const map = new Map<string, { title: string; task_type: string | null; total: number; approved: number; rejected: number; pending: number; reviewMs: number[] }>();

  for (const row of (submissions ?? []) as unknown as Row[]) {
    if (!row.task_id) continue;
    if (!map.has(row.task_id)) map.set(row.task_id, { title: row.tasks?.title ?? "Unknown Task", task_type: row.tasks?.task_type ?? null, total: 0, approved: 0, rejected: 0, pending: 0, reviewMs: [] });
    const entry = map.get(row.task_id)!;
    entry.total++;
    if (row.status === "approved") entry.approved++;
    else if (row.status === "rejected") entry.rejected++;
    else entry.pending++;
    if (row.reviewed_at && row.submitted_at) {
      const ms = new Date(row.reviewed_at).getTime() - new Date(row.submitted_at).getTime();
      if (ms >= 0) entry.reviewMs.push(ms);
    }
  }

  const stats = Array.from(map.entries()).map(([task_id, e]) => ({ task_id, task_title: e.title, task_type: e.task_type, total: e.total, approved: e.approved, rejected: e.rejected, pending: e.pending, approval_rate: e.total > 0 ? Math.round((e.approved / e.total) * 100) : 0, avg_review_hours: e.reviewMs.length > 0 ? Math.round((e.reviewMs.reduce((a, b) => a + b, 0) / e.reviewMs.length) / (1000 * 60 * 60) * 10) / 10 : null })).sort((a, b) => b.total - a.total);

  return res.json({ stats });
});

export default router;
