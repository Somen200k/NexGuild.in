import { Resend } from "resend";

export const FROM_NOREPLY = "NexGuild <noreply@nexguild.in>";
export const TO_ADMIN = "nexguild.in@gmail.com";

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

function layout(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0D0D0D;border-radius:16px;overflow:hidden;border:1px solid #222;">
      <tr><td style="background:linear-gradient(135deg,#1a0f00 0%,#0D0D0D 50%,#1a0800 100%);padding:22px 36px;border-bottom:1px solid rgba(245,158,11,0.15);">
        <span style="font-size:22px;font-weight:800;color:#F59E0B;letter-spacing:-0.5px;">NexGuild</span>
      </td></tr>
      <tr><td style="padding:32px 36px;">${body}</td></tr>
      <tr><td style="padding:18px 36px;border-top:1px solid #1f1f1f;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:#444;">© 2025 NexGuild · <a href="https://nexguild.in" style="color:#444;text-decoration:none;">nexguild.in</a></p>
        <p style="margin:0;font-size:11px;color:#2f2f2f;">You received this because you have a NexGuild account.</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

function btn(text: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0 0;"><tr><td style="background:#F59E0B;border-radius:10px;">
    <a href="${href}" style="display:inline-block;padding:12px 26px;font-size:14px;font-weight:700;color:#000;text-decoration:none;">${text}</a>
  </td></tr></table>`;
}

export function welcomeHtml(name: string): string {
  const n = esc(name);
  return layout(`
<h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:#fff;">Welcome to NexGuild! 🎉</h1>
<p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.38);">Your account is ready. Let's get you earning.</p>
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">
  Hi <strong style="color:#fff;">${n}</strong>,<br><br>
  You're now part of NexGuild — the platform where contributors earn real rewards by completing tasks for organisations.
</p>
${btn("Go to Dashboard →", "https://nexguild.in/dashboard")}`);
}

export function taskApprovedHtml(name: string, taskTitle: string, coinsAwarded: number, newBalance: number): string {
  const n = esc(name), t = esc(taskTitle);
  return layout(`
<div style="background:linear-gradient(135deg,#0a1f0a,#0f1a0f);border:1px solid rgba(34,197,94,0.2);border-radius:10px;padding:18px 22px;margin:0 0 24px;">
  <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:1px;">Submission Approved ✓</p>
  <p style="margin:0;font-size:30px;font-weight:800;color:#4ade80;">+${coinsAwarded.toLocaleString()} NexCoins</p>
</div>
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, your submission for <strong style="color:#fff;">${t}</strong> was approved.</p>
${btn("View Earnings →", "https://nexguild.in/dashboard/earnings")}`);
}

export function taskRejectedHtml(name: string, taskTitle: string, feedback: string | null): string {
  const n = esc(name), t = esc(taskTitle);
  const f = feedback ? esc(feedback) : null;
  return layout(`
<h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#fff;">Submission Feedback</h1>
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, your submission for <strong style="color:#fff;">${t}</strong> was not approved this time.</p>
${f ? `<div style="background:#1c1010;border-left:3px solid #ef4444;padding:16px 20px;margin:0 0 20px;"><p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);white-space:pre-wrap;">${f}</p></div>` : ""}
${btn("Go to My Tasks →", "https://nexguild.in/dashboard/tasks")}`);
}

export function assignmentApprovedHtml(name: string, taskTitle: string, taskId: string): string {
  const n = esc(name), t = esc(taskTitle), id = esc(taskId);
  return layout(`
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, your assignment for <strong style="color:#fff;">${t}</strong> was approved. You can now start earning NexCoins.</p>
${btn("Start the Task →", `https://nexguild.in/dashboard/tasks/${id}`)}`);
}

export function assignmentRejectedHtml(name: string, taskTitle: string, feedback: string | null): string {
  const n = esc(name), t = esc(taskTitle);
  const f = feedback ? esc(feedback) : null;
  return layout(`
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, your assignment for <strong style="color:#fff;">${t}</strong> was not approved this time.</p>
${f ? `<div style="background:#1c1010;border-left:3px solid #ef4444;padding:16px 20px;margin:0 0 20px;"><p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);white-space:pre-wrap;">${f}</p></div>` : ""}
${btn("Browse Tasks →", "https://nexguild.in/dashboard/tasks")}`);
}

export function newTaskHtml(name: string, taskTitle: string, taskType: string, coinsPerTask: number, totalSlots: number | null, taskId: string): string {
  const n = esc(name), t = esc(taskTitle), id = esc(taskId);
  return layout(`
<h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#fff;">${t}</h1>
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, a new task is available on NexGuild. Slots fill fast!</p>
<p style="font-size:20px;color:#F59E0B;font-weight:800;">${coinsPerTask.toLocaleString()} NexCoins per submission</p>
${btn("View Task →", `https://nexguild.in/dashboard/tasks/${id}`)}`);
}

export function accountBannedHtml(name: string, reason: string): string {
  const n = esc(name), r = esc(reason);
  return layout(`
<h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#fff;">Account Suspended</h1>
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, your NexGuild account has been suspended.</p>
<div style="background:#1c1010;border-left:3px solid #ef4444;padding:16px 20px;margin:0 0 20px;">
  <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#f87171;text-transform:uppercase;">Reason</p>
  <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);white-space:pre-wrap;">${r}</p>
</div>`);
}

export function coinsReceivedHtml(name: string, amount: number, reason: string | null, newBalance: number): string {
  const n = esc(name), r = reason ? esc(reason) : null;
  return layout(`
<p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#F59E0B;text-transform:uppercase;">NexCoins Received 🎉</p>
<p style="margin:0 0 20px;font-size:32px;font-weight:800;color:#F59E0B;">+${amount.toLocaleString()}</p>
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, you received <strong style="color:#F59E0B;">${amount.toLocaleString()} NexCoins</strong>.</p>
${r ? `<p style="font-size:14px;color:rgba(255,255,255,0.55);">Reason: ${r}</p>` : ""}
${btn("View Earnings →", "https://nexguild.in/dashboard/earnings")}`);
}

export function coinsDeductedHtml(name: string, amount: number, reason: string | null, newBalance: number): string {
  const n = esc(name), r = reason ? esc(reason) : null;
  return layout(`
<h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:#fff;">NexCoins Deducted</h1>
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, <strong style="color:#f87171;">${amount.toLocaleString()} NexCoins</strong> were deducted from your balance.</p>
${r ? `<p style="font-size:14px;color:rgba(255,255,255,0.55);">Reason: ${r}</p>` : ""}
<p style="font-size:14px;color:rgba(255,255,255,0.38);">New balance: ${newBalance.toLocaleString()} NexCoins</p>`);
}

export function resubmissionRequestedHtml(name: string, taskTitle: string, feedback: string): string {
  const n = esc(name), t = esc(taskTitle), f = esc(feedback);
  return layout(`
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>, your submission for <strong style="color:#fff;">${t}</strong> needs changes before it can be approved.</p>
<div style="background:#1a1200;border-left:3px solid #f59e0b;padding:16px 20px;margin:0 0 24px;">
  <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#f59e0b;text-transform:uppercase;">Feedback</p>
  <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);white-space:pre-wrap;">${f}</p>
</div>
${btn("Go to My Tasks →", "https://nexguild.in/dashboard/tasks")}`);
}

export function announcementHtml(name: string, title: string, message: string): string {
  const n = esc(name), ti = esc(title), m = esc(message);
  return layout(`
<h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#fff;">📢 ${ti}</h1>
<p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;">Hi <strong style="color:#fff;">${n}</strong>,</p>
<div style="background:#111;border:1px solid #222;border-radius:10px;padding:16px 20px;margin:0 0 24px;">
  <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;white-space:pre-wrap;">${m}</p>
</div>
${btn("Open Dashboard →", "https://nexguild.in/dashboard")}`);
}
