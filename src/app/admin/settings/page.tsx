import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const ADMINS = [
  { name: "Platform Lead",    email: "admin@nexguild.com",   role: "Super Admin", added: "Jan 2025" },
  { name: "Ops Manager",      email: "ops@nexguild.com",     role: "Admin",       added: "Feb 2025" },
];

export default function AdminSettingsPage() {
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
          { label: "Minimum Withdrawal",         key: "min_withdrawal_usd",          value: "$5.00",   desc: "Minimum amount a contributor can withdraw" },
          { label: "Settlement Period",           key: "settlement_period_days",      value: "3 days",  desc: "Days before pending balance becomes available" },
          { label: "New Account Hold Period",     key: "withdrawal_hold_days",        value: "7 days",  desc: "Days before new accounts can request withdrawal" },
          { label: "Max Active Tasks per User",   key: "max_active_tasks",           value: "5",       desc: "Simultaneous in-progress tasks allowed" },
        ].map((item) => (
          <div key={item.key} className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</span>
              <Button size="sm" variant="secondary">Edit</Button>
            </div>
          </div>
        ))}
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Maintenance Mode</p>
            <p className="text-xs text-[var(--text-muted)]">Disable the contributor dashboard and stop new submissions</p>
          </div>
          <button
            role="switch"
            aria-checked="false"
            className="h-6 w-11 rounded-full bg-[var(--border-default)] relative flex-shrink-0 transition-colors"
          >
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform" />
          </button>
        </div>
      </section>

      {/* Admin Users */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] divide-y divide-[var(--border-default)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-primary)]">Admin Users</h2>
          <Button size="sm" variant="secondary"><Plus className="h-3.5 w-3.5" /> Invite Admin</Button>
        </div>
        {ADMINS.map((admin) => (
          <div key={admin.email} className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{admin.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{admin.email} · {admin.role} · Added {admin.added}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-danger-700 hover:bg-danger-50">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </section>

      {/* Withdrawal Methods */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] divide-y divide-[var(--border-default)]">
        <div className="px-6 py-4">
          <h2 className="font-semibold text-[var(--text-primary)]">Withdrawal Methods</h2>
        </div>
        {[
          { label: "UPI",           enabled: true },
          { label: "Bank Transfer", enabled: true },
          { label: "PayPal",        enabled: true },
        ].map((m) => (
          <div key={m.label} className="px-6 py-4 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[var(--text-primary)]">{m.label}</p>
            <button
              role="switch"
              aria-checked={m.enabled}
              className={`h-6 w-11 rounded-full relative flex-shrink-0 transition-colors ${m.enabled ? "bg-[var(--brand-500)]" : "bg-[var(--border-default)]"}`}
            >
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${m.enabled ? "right-1" : "left-1"}`} />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
