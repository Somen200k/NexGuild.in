"use client";

import { useEffect, useState } from "react";
import { Headphones, Plus, ChevronDown, ChevronUp, Loader2, CheckCircle2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORIES: Record<string, string> = {
  general: "General Inquiry",
  task:    "Task Issue",
  coins:   "Payment / Coins Issue",
  account: "Account Problem",
  voucher: "Voucher Issue",
  bug:     "Bug Report",
};

const STATUS_META: Record<string, { label: string; style: string; icon: React.ReactNode }> = {
  open:    { label: "Open",    style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: <Clock className="h-3 w-3" /> },
  replied: { label: "Replied", style: "bg-green-500/10 text-green-400 border-green-500/20",   icon: <CheckCircle2 className="h-3 w-3" /> },
  closed:  { label: "Closed",  style: "bg-[var(--surface-subtle)] text-[var(--text-muted)] border-[var(--border-default)]", icon: <X className="h-3 w-3" /> },
};

const CATEGORY_INPUT = [
  { value: "general",  label: "General Inquiry" },
  { value: "task",     label: "Task Issue" },
  { value: "coins",    label: "Payment / Coins Issue" },
  { value: "account",  label: "Account Problem" },
  { value: "voucher",  label: "Voucher Issue" },
  { value: "bug",      label: "Bug Report" },
];

const inputClass =
  "w-full px-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors";

export default function SupportPage() {
  const [tickets, setTickets]         = useState<Ticket[]>([]);
  const [loading, setLoading]         = useState(true);
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [showForm, setShowForm]       = useState(false);

  // New ticket form
  const [category, setCategory] = useState("general");
  const [subject, setSubject]   = useState("");
  const [message, setMessage]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    async function fetchTickets() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("support_tickets")
        .select("id, subject, message, category, status, priority, admin_reply, replied_at, created_at, updated_at")
        .eq("contributor_id", user.id)
        .order("created_at", { ascending: false });
      if (error) console.error("[support] fetch error:", error.message);
      setTickets((data as Ticket[]) ?? []);
      setLoading(false);
    }
    fetchTickets();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setFormError("Subject and message are required.");
      return;
    }
    setSubmitting(true);
    setFormError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setFormError("Not logged in."); setSubmitting(false); return; }

    const { data: newTicket, error } = await supabase
      .from("support_tickets")
      .insert({ contributor_id: user.id, subject: subject.trim(), message: message.trim(), category, status: "open" })
      .select("id, subject, message, category, status, priority, admin_reply, replied_at, created_at, updated_at")
      .single();

    if (error) { setFormError("Failed to submit. Please try again."); setSubmitting(false); return; }

    setTickets((prev) => [newTicket as Ticket, ...prev]);
    setFormSuccess(true);
    setSubmitting(false);
    setSubject(""); setMessage(""); setCategory("general");
    setTimeout(() => { setFormSuccess(false); setShowForm(false); }, 2500);
  }

  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Support</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {openCount > 0
              ? `${openCount} open ticket${openCount > 1 ? "s" : ""} · we typically reply within 24 hours.`
              : "Submit a ticket and we'll get back to you within 24 hours."}
          </p>
        </div>
        <Button size="sm" onClick={() => { setShowForm(true); setFormSuccess(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <Plus className="h-4 w-4" /> New Ticket
        </Button>
      </div>

      {/* New ticket form */}
      {showForm && (
        <div className="rounded-xl border border-[var(--brand-500)]/30 bg-[var(--surface-card)] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--text-primary)]">New Support Ticket</h2>
            <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X className="h-5 w-5" />
            </button>
          </div>

          {formSuccess ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
              <p className="font-semibold text-[var(--text-primary)]">Ticket submitted!</p>
              <p className="text-sm text-[var(--text-secondary)]">We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} h-10`}>
                    {CATEGORY_INPUT.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Subject <span className="text-[var(--danger-text)]">*</span></label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description" className={`${inputClass} h-10`} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Message <span className="text-[var(--danger-text)]">*</span></label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail…" rows={4} className={`${inputClass} py-2.5 resize-none`} />
              </div>
              {formError && <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{formError}</p>}
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Ticket"}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Ticket list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] animate-pulse" />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-20 flex flex-col items-center gap-4 text-center px-6">
          <div className="h-14 w-14 rounded-full bg-[var(--brand-100)] flex items-center justify-center">
            <Headphones className="h-7 w-7 text-[var(--brand-500)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)] mb-1">No support tickets yet</p>
            <p className="text-sm text-[var(--text-secondary)]">Click &quot;New Ticket&quot; or use the help button to get in touch.</p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {tickets.map((t) => {
            const st = STATUS_META[t.status] ?? STATUS_META.open;
            const isExpanded = expanded === t.id;
            return (
              <li key={t.id} className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
                <button
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[var(--surface-subtle)] transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : t.id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{t.subject}</p>
                      {t.status === "replied" && (
                        <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">New Reply</span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {CATEGORIES[t.category] ?? t.category} ·{" "}
                      {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${st.style}`}>
                      {st.icon} {st.label}
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[var(--border-default)] pt-4 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">Your Message</p>
                      <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--surface-subtle)] rounded-lg px-4 py-3">{t.message}</p>
                    </div>
                    {t.admin_reply && (
                      <div>
                        <p className="text-xs font-medium text-green-400 uppercase tracking-wider mb-2">
                          Support Reply {t.replied_at && `· ${new Date(t.replied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                        </p>
                        <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap bg-green-500/5 border border-green-500/20 rounded-lg px-4 py-3">{t.admin_reply}</p>
                      </div>
                    )}
                    {!t.admin_reply && t.status === "open" && (
                      <p className="text-xs text-[var(--text-muted)] italic">Waiting for support to reply…</p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
