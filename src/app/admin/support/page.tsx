"use client";

import { useEffect, useState } from "react";
import {
  Headphones, Search, ChevronDown, ChevronUp,
  CheckCircle2, X, Loader2, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  profiles: { full_name: string | null; email: string | null } | null;
}

const CATEGORIES: Record<string, string> = {
  general: "General", task: "Task", coins: "Coins",
  account: "Account", voucher: "Voucher", bug: "Bug",
};

const STATUS_META: Record<string, { label: string; variant: "success" | "warning" | "neutral" }> = {
  open:    { label: "Open",    variant: "warning" },
  replied: { label: "Replied", variant: "success" },
  closed:  { label: "Closed",  variant: "neutral" },
};

const TABS = ["open", "replied", "closed"] as const;
type Tab = typeof TABS[number];

export default function AdminSupportPage() {
  const [tickets, setTickets]       = useState<Ticket[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState<Tab>("open");
  const [search, setSearch]         = useState("");
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [replies, setReplies]       = useState<Record<string, string>>({});
  const [acting, setActing]         = useState<string | null>(null);
  const [token, setToken]           = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      setToken(session?.access_token ?? null);
      await fetchTickets();
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTickets() {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("id, subject, message, category, status, priority, admin_reply, replied_at, created_at, updated_at, profiles(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) console.error("[admin/support] fetch error:", error.message);
    setTickets((data as unknown as Ticket[]) ?? []);
    setLoading(false);
  }

  async function callApi(ticketId: string, reply?: string, closeTicket?: boolean) {
    setActing(ticketId);

    const res = await fetch("/api/admin/reply-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ticketId, reply, closeTicket }),
    });

    if (res.ok) {
      const { status: newStatus } = await res.json();
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status:      newStatus,
                admin_reply: reply ?? t.admin_reply,
                replied_at:  reply ? new Date().toISOString() : t.replied_at,
                updated_at:  new Date().toISOString(),
              }
            : t
        )
      );
      if (reply) setReplies((prev) => ({ ...prev, [ticketId]: "" }));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Action failed — check server logs.");
    }
    setActing(null);
  }

  const counts: Record<Tab, number> = {
    open:    tickets.filter((t) => t.status === "open").length,
    replied: tickets.filter((t) => t.status === "replied").length,
    closed:  tickets.filter((t) => t.status === "closed").length,
  };

  const filtered = tickets.filter((t) => {
    if (t.status !== activeTab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const name  = (t.profiles as { full_name: string | null } | null)?.full_name?.toLowerCase() ?? "";
    const email = (t.profiles as { email: string | null } | null)?.email?.toLowerCase() ?? "";
    return (
      t.subject.toLowerCase().includes(q) ||
      name.includes(q) ||
      email.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Support Tickets</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {counts.open} open · {counts.replied} replied · {counts.closed} closed
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border-default)]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px capitalize transition-colors ${
              activeTab === tab
                ? "border-[var(--brand-500)] text-[var(--brand-500)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {counts[tab] > 0 && (
              <span className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full bg-[var(--brand-500)] text-white">
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] max-w-sm">
        <Search className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contributor or subject…"
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
        />
      </div>

      {/* Ticket list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-16 flex flex-col items-center gap-3 text-center">
          <Headphones className="h-10 w-10 text-[var(--text-muted)]" />
          <p className="font-semibold text-[var(--text-primary)]">No {activeTab} tickets</p>
          {search && <p className="text-sm text-[var(--text-secondary)]">No results for &quot;{search}&quot;</p>}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((t) => {
            const st        = STATUS_META[t.status] ?? STATUS_META.open;
            const isOpen    = expanded === t.id;
            const name      = (t.profiles as { full_name: string | null } | null)?.full_name ?? "Unknown";
            const email     = (t.profiles as { email: string | null } | null)?.email ?? "—";
            const replyText = replies[t.id] ?? "";

            return (
              <li key={t.id} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
                {/* Row */}
                <button
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-[var(--surface-subtle)] transition-colors"
                  onClick={() => setExpanded(isOpen ? null : t.id)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{t.subject}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {name} · {email} · {CATEGORIES[t.category] ?? t.category} ·{" "}
                      {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant={st.variant}>{st.label}</Badge>
                    {isOpen
                      ? <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
                      : <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />}
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-[var(--border-default)] px-5 pb-5 pt-4 space-y-5">
                    {/* Contributor message */}
                    <div>
                      <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">Message</p>
                      <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--surface-subtle)] rounded-lg px-4 py-3 leading-relaxed">
                        {t.message}
                      </p>
                    </div>

                    {/* Existing reply */}
                    {t.admin_reply && (
                      <div>
                        <p className="text-xs font-medium text-green-400 uppercase tracking-wider mb-2">
                          Your Reply {t.replied_at && `· ${new Date(t.replied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                        </p>
                        <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap bg-green-500/5 border border-green-500/20 rounded-lg px-4 py-3 leading-relaxed">
                          {t.admin_reply}
                        </p>
                      </div>
                    )}

                    {/* Reply / close actions */}
                    {t.status !== "closed" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                            {t.admin_reply ? "Update Reply" : "Reply to Contributor"}
                          </label>
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplies((prev) => ({ ...prev, [t.id]: e.target.value }))}
                            placeholder="Type your reply…"
                            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] resize-none"
                          />
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Button
                            size="sm"
                            disabled={!replyText.trim() || acting === t.id}
                            onClick={() => callApi(t.id, replyText.trim())}
                          >
                            {acting === t.id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Send className="h-3.5 w-3.5" />}
                            {t.admin_reply ? "Update Reply" : "Send Reply"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            disabled={acting === t.id}
                            onClick={() => callApi(t.id, replyText.trim() || undefined, true)}
                          >
                            <X className="h-3.5 w-3.5" /> Close Ticket
                          </Button>
                        </div>
                      </div>
                    )}

                    {t.status === "closed" && (
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <CheckCircle2 className="h-4 w-4 text-[var(--text-muted)]" />
                        Ticket closed · {new Date(t.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
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
