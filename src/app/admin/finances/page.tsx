import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";

export default function FinancesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Finances</h1>
          <p className="text-sm text-[var(--text-secondary)]">Platform revenue and payout overview.</p>
        </div>
        <Button variant="secondary" size="sm" disabled>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue"   value={formatCurrency(0)} />
        <StatCard label="Total Paid Out"  value={formatCurrency(0)} />
        <StatCard label="Net Revenue"     value={formatCurrency(0)} />
        <StatCard label="Pending Payouts" value={formatCurrency(0)} />
      </div>

      {/* Revenue by Source + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-5">Revenue by Source</h2>
          <div className="space-y-4">
            {[
              { label: "Offerwall Revenue", pct: 0 },
              { label: "Managed Projects",  pct: 0 },
              { label: "Organization Fees", pct: 0 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--text-secondary)]">{item.label}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(0)}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-subtle)]">
                  <div className="h-full rounded-full bg-[var(--brand-500)]" style={{ width: "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6 flex flex-col items-center justify-center gap-2 min-h-[180px]">
          <p className="text-sm font-medium text-[var(--text-primary)]">No revenue data yet</p>
          <p className="text-xs text-[var(--text-muted)]">Monthly chart will appear once transactions are recorded.</p>
        </div>
      </div>
    </div>
  );
}
