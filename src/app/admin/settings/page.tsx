"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Loader2, X, CheckCircle2, Tag, ToggleLeft, ToggleRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface AdminUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  joined_at: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  discount_coins: number;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

type MaintenanceSections = Record<string, boolean>;

const MAINTENANCE_SECTIONS: { key: string; label: string; desc: string }[] = [
  { key: "org",          label: "Organization Side",    desc: "Client-facing pages (/services, /for-organizations, /client)" },
  { key: "contributor",  label: "Contributor Side",     desc: "Earn pages (/earn, /opportunities, /how-it-works, /faq)" },
  { key: "dashboard",    label: "Dashboard",            desc: "Contributor dashboard (/dashboard/*)" },
  { key: "store",        label: "Store",                desc: "NexGuild store (/dashboard/store)" },
  { key: "offerwalls",   label: "Offerwalls",           desc: "Offerwall section (/dashboard/offerwalls)" },
  { key: "signup",       label: "New Registrations",    desc: "Prevent new signups (/signup)" },
];

function Toggle({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      disabled={disabled}
      style={{ backgroundColor: on ? "#14b8a6" : "#4b5563", transition: "background-color 0.2s ease" }}
      className="h-6 w-11 rounded-full relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2 focus:ring-offset-[var(--surface-card)] disabled:opacity-50"
    >
      <span
        style={{ transform: on ? "translateX(22px)" : "translateX(2px)", transition: "transform 0.2s ease" }}
        className="absolute top-[2px] left-0 h-5 w-5 rounded-full bg-white shadow-md"
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const tokenRef = useRef<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const [admins, setAdmins]               = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [maintenanceSections, setMaintenanceSections] = useState<MaintenanceSections>({});
  const [togglingSection, setTogglingSection] = useState<string | null>(null);

  // Coupons
  const [coupons, setCoupons]               = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [togglingCoupon, setTogglingCoupon] = useState<string | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<string | null>(null);

  // Add admin modal
  const [showInvite, setShowInvite]   = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting]       = useState(false);
  const [inviteErr, setInviteErr]     = useState<string | null>(null);
  const [inviteOk, setInviteOk]       = useState(false);

  // Create coupon modal
  const [showCoupon, setShowCoupon]         = useState(false);
  const [newCode, setNewCode]               = useState("");
  const [discountType, setDiscountType]     = useState<"percent" | "coins">("coins");
  const [discountValue, setDiscountValue]   = useState("");
  const [maxUses, setMaxUses]               = useState("1");
  const [expiresAt, setExpiresAt]           = useState("");
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [couponErr, setCouponErr]           = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      tokenRef.current = session?.access_token ?? null;
      if (!session) return;

      // Get current user's role for owner-check
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        setCurrentRole((profile as { role: string } | null)?.role ?? null);
      }

      const [settingsRes, couponsRes] = await Promise.all([
        fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch("/api/admin/coupons",  { headers: { Authorization: `Bearer ${session.access_token}` } }),
      ]);

      if (settingsRes.ok) {
        const d = await settingsRes.json() as { admins: AdminUser[]; maintenanceSections: MaintenanceSections };
        setAdmins(d.admins ?? []);
        setMaintenanceSections(d.maintenanceSections ?? {});
      }
      setLoadingAdmins(false);

      if (couponsRes.ok) {
        const { coupons: data } = await couponsRes.json() as { coupons: Coupon[] };
        setCoupons(data ?? []);
      }
      setLoadingCoupons(false);
    }
    load();
  }, []);

  async function toggleSection(section: string) {
    const next = !maintenanceSections[section];
    setMaintenanceSections((prev) => ({ ...prev, [section]: next }));
    setTogglingSection(section);
    await fetch("/api/admin/settings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body:    JSON.stringify({ action: "maintenance_section", section, value: next }),
    });
    setTogglingSection(null);
  }

  async function promoteToAdmin(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setInviteErr(null);
    const res = await fetch("/api/admin/settings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body:    JSON.stringify({ action: "promote", email: inviteEmail.trim().toLowerCase() }),
    });
    const data = await res.json() as { ok?: boolean; admins?: AdminUser[]; error?: string };
    if (!res.ok) { setInviteErr(data.error ?? "Failed to promote user."); setInviting(false); return; }
    setAdmins(data.admins ?? []);
    setInviteOk(true);
    setInviting(false);
  }

  async function demoteAdmin(id: string) {
    const res = await fetch("/api/admin/settings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body:    JSON.stringify({ action: "demote", id }),
    });
    if (res.ok) setAdmins((prev) => prev.filter((a) => a.id !== id));
  }

  async function toggleCoupon(id: string, current: boolean) {
    setTogglingCoupon(id);
    const next = !current;
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, is_active: next } : c));
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body: JSON.stringify({ action: "toggle", id, is_active: next }),
    });
    setTogglingCoupon(null);
  }

  async function deleteCoupon(id: string) {
    setDeletingCoupon(id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body: JSON.stringify({ action: "delete", id }),
    });
    setDeletingCoupon(null);
  }

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    setCouponErr(null);
    if (!newCode.trim()) { setCouponErr("Code is required."); return; }
    const val = parseInt(discountValue, 10);
    if (isNaN(val) || val <= 0) { setCouponErr("Discount value must be a positive number."); return; }
    setCreatingCoupon(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body: JSON.stringify({
        action: "create",
        code: newCode.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: val,
        max_uses: parseInt(maxUses, 10) || 1,
        expires_at: expiresAt || null,
      }),
    });
    const data = await res.json() as { coupon?: Coupon; error?: string };
    if (!res.ok || data.error) {
      setCouponErr(data.error ?? "Failed to create coupon.");
    } else {
      setCoupons((prev) => [data.coupon!, ...prev]);
      setShowCoupon(false);
      setNewCode(""); setDiscountType("coins"); setDiscountValue(""); setMaxUses("1"); setExpiresAt("");
    }
    setCreatingCoupon(false);
  }

  const isOwner = currentRole === "owner";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)]">Platform-wide configuration and admin management.</p>
      </div>

      {/* Platform Config */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] divide-y divide-[var(--border-default)]">
        <div className="px-6 py-4">
          <h2 className="font-semibold text-[var(--text-primary)]">Platform Configuration</h2>
        </div>
        {[
          { label: "Minimum Withdrawal",        value: "N/A (NexCoins only)",  desc: "Cash withdrawals replaced by voucher redemption" },
          { label: "Max Active Tasks per User",  value: "5",                    desc: "Simultaneous in-progress tasks allowed" },
          { label: "Assignment Review SLA",      value: "48 hours",             desc: "Target time to review submitted assignments" },
          { label: "Submission Review SLA",      value: "72 hours",             desc: "Target time to review submitted work" },
        ].map((item) => (
          <div key={item.label} className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)] flex-shrink-0">{item.value}</span>
          </div>
        ))}
      </section>

      {/* Section Maintenance */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] divide-y divide-[var(--border-default)]">
        <div className="px-6 py-4">
          <h2 className="font-semibold text-[var(--text-primary)]">Section Maintenance</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Toggle maintenance mode per platform section. Active sections show a maintenance page to visitors.</p>
        </div>
        {MAINTENANCE_SECTIONS.map(({ key, label, desc }) => {
          const on = maintenanceSections[key] ?? false;
          return (
            <div key={key} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                  {on && (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)]">{desc}</p>
              </div>
              <Toggle
                on={on}
                onToggle={() => toggleSection(key)}
                disabled={togglingSection === key}
              />
            </div>
          );
        })}
      </section>

      {/* Admin Users */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] divide-y divide-[var(--border-default)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Admin Users</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {isOwner ? "Promote a contributor to admin by their email." : "Only the owner can add or remove admins."}
            </p>
          </div>
          {isOwner && (
            <Button size="sm" variant="secondary" onClick={() => { setShowInvite(true); setInviteOk(false); setInviteErr(null); setInviteEmail(""); }}>
              <Plus className="h-3.5 w-3.5" /> Add Admin
            </Button>
          )}
        </div>
        {loadingAdmins ? (
          <div className="px-6 py-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : admins.length === 0 ? (
          <div className="px-6 py-6 text-sm text-[var(--text-muted)]">No admins found.</div>
        ) : (
          admins.map((admin) => {
            const isAdminOwner = admin.role === "owner";
            return (
              <div key={admin.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{admin.full_name ?? "—"}</p>
                    {isAdminOwner && (
                      <span className="flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                        <Crown className="h-3 w-3" /> Owner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {admin.email} · {isAdminOwner ? "Owner" : "Admin"} · Since {new Date(admin.joined_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>
                </div>
                {isOwner && !isAdminOwner && (
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => demoteAdmin(admin.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Coupon Management */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] divide-y divide-[var(--border-default)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Coupon Codes</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Create discount coupons contributors can apply in the store cart.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => { setShowCoupon(true); setCouponErr(null); }}>
            <Plus className="h-3.5 w-3.5" /> New Coupon
          </Button>
        </div>

        {loadingCoupons ? (
          <div className="px-6 py-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : coupons.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Tag className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-muted)]">No coupons yet. Create one to get started.</p>
          </div>
        ) : (
          coupons.map((c) => {
            const expired   = c.expires_at && new Date(c.expires_at) < new Date();
            const exhausted = c.max_uses > 0 && c.used_count >= c.max_uses;
            return (
              <div key={c.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-sm font-mono font-semibold text-[var(--brand-500)]">{c.code}</code>
                    {!c.is_active  && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-subtle)] text-[var(--text-muted)] border border-[var(--border-default)]">Inactive</span>}
                    {expired       && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400">Expired</span>}
                    {exhausted && !expired && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Exhausted</span>}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {c.discount_percent > 0 ? `${c.discount_percent}% off` : `${c.discount_coins.toLocaleString()} coins off`}
                    {" · "}{c.used_count}/{c.max_uses === 0 ? "∞" : c.max_uses} uses
                    {c.expires_at && ` · Expires ${new Date(c.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleCoupon(c.id, c.is_active)}
                    disabled={togglingCoupon === c.id}
                    className="text-[var(--text-muted)] hover:text-[var(--brand-500)] transition-colors disabled:opacity-50"
                    title={c.is_active ? "Deactivate" : "Activate"}
                  >
                    {c.is_active
                      ? <ToggleRight className="h-5 w-5 text-[var(--brand-500)]" />
                      : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    disabled={deletingCoupon === c.id}
                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Delete coupon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ── Add Admin Modal ──────────────────────────────────────────── */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[var(--surface-card)] rounded-xl border border-[var(--border-default)] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Add Admin</h2>
              <button onClick={() => setShowInvite(false)}><X className="h-5 w-5 text-[var(--text-muted)]" /></button>
            </div>
            {inviteOk ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
                <p className="font-semibold text-[var(--text-primary)]">Role updated</p>
                <p className="text-sm text-[var(--text-secondary)]">The user has been promoted to admin.</p>
                <Button className="w-full mt-2" onClick={() => setShowInvite(false)}>Done</Button>
              </div>
            ) : (
              <form onSubmit={promoteToAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Contributor Email</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="contributor@email.com"
                    className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1.5">The user must already have an account on NexGuild.</p>
                </div>
                {inviteErr && <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-md">{inviteErr}</p>}
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowInvite(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={inviting}>
                    {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Promote to Admin"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Create Coupon Modal ──────────────────────────────────────── */}
      {showCoupon && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[var(--surface-card)] rounded-xl border border-[var(--border-default)] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Coupon</h2>
              <button onClick={() => setShowCoupon(false)}><X className="h-5 w-5 text-[var(--text-muted)]" /></button>
            </div>
            <form onSubmit={createCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER25"
                  className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-subtle)] text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Discount Type</label>
                <div className="flex gap-2">
                  {(["coins", "percent"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDiscountType(t)}
                      className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                        discountType === t
                          ? "bg-[var(--brand-500)] text-white border-[var(--brand-500)]"
                          : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--brand-500)]"
                      }`}
                    >
                      {t === "coins" ? "Fixed Coins" : "Percentage"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  {discountType === "percent" ? "Percentage (e.g. 10)" : "Coins off (e.g. 500)"}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={discountType === "percent" ? "100" : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === "percent" ? "10" : "500"}
                  className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Max Uses</label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Expires (optional)</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                  />
                </div>
              </div>
              {couponErr && <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-md">{couponErr}</p>}
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowCoupon(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={creatingCoupon}>
                  {creatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Coupon"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
