import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { BadgeVariant } from "@/components/ui/badge";

const WITHDRAWALS = [
  { contributor: "Alex Johnson",  amount: 38.45, method: "PayPal",  date: "Jun 12, 2025", status: "pending" },
  { contributor: "Priya Sharma",  amount: 50.00, method: "Bitcoin", date: "Jun 11, 2025", status: "pending" },
  { contributor: "Maria Santos",  amount: 25.00, method: "PayPal",  date: "Jun 11, 2025", status: "processing" },
  { contributor: "Sara Kim",      amount: 12.00, method: "USDT",    date: "Jun 10, 2025", status: "pending" },
  { contributor: "Liu Wei",       amount: 8.50,  method: "PayPal",  date: "Jun 9, 2025",  status: "pending" },
];

const TABS = ["Pending", "Processing", "Completed", "Rejected"];

const statusVariants: Record<string, BadgeVariant> = {
  pending:    "warning",
  processing: "info",
  completed:  "success",
  rejected:   "danger",
};

export default function WithdrawalsPage() {
  const pendingCount = WITHDRAWALS.filter((w) => w.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Withdrawals</h1>
        <p className="text-sm text-[var(--text-secondary)]">Process and track contributor withdrawal requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border-default)]">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
              i === 0
                ? "border-[var(--brand-500)] text-[var(--brand-600)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab}
            {i === 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning-50 text-warning-700 text-xs font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              {["Contributor","Amount","Method","Requested","Status","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {WITHDRAWALS.map((w, i) => (
              <tr key={i} className="hover:bg-[var(--surface-subtle)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{w.contributor}</td>
                <td className="px-4 py-3 font-bold text-[var(--text-primary)]">{formatCurrency(w.amount)}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{w.method}</td>
                <td className="px-4 py-3 text-[var(--text-muted)] whitespace-nowrap">{w.date}</td>
                <td className="px-4 py-3"><Badge variant={statusVariants[w.status]}>{w.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {w.status === "pending" && (
                      <>
                        <Button size="sm" variant="secondary">Mark Processing</Button>
                        <Button size="sm" variant="ghost">Reject</Button>
                      </>
                    )}
                    {w.status === "processing" && (
                      <Button size="sm">Mark Completed</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
