import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun"];
const REVENUE = [1240, 2180, 1820, 3100, 2750, 3640];
const MAX_REV = Math.max(...REVENUE);

export default function FinancesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Finances</h1>
          <p className="text-sm text-[var(--text-secondary)]">Platform revenue and payout overview.</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue"    value={formatCurrency(16730)} />
        <StatCard label="Total Paid Out"   value={formatCurrency(11640)} />
        <StatCard label="Net Revenue"      value={formatCurrency(5090)} />
        <StatCard label="Pending Payouts"  value={formatCurrency(1284)} />
      </div>

      {/* Revenue by Source + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-5">Revenue by Source</h2>
          <div className="space-y-4">
            {[
              { label: "Offerwall Revenue", value: 8420, pct: 50 },
              { label: "Managed Projects",  value: 5640, pct: 34 },
              { label: "Organization Fees", value: 2670, pct: 16 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--text-secondary)]">{item.label}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(item.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-subtle)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-500)]"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
          <h2 className="font-semibold text-[var(--text-primary)] mb-5">Monthly Revenue (2025)</h2>
          <div className="flex items-end gap-3 h-36">
            {MONTHS.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-[var(--text-muted)]">${(REVENUE[i]/1000).toFixed(1)}k</span>
                <div
                  className="w-full rounded-t-sm bg-[var(--brand-500)] transition-all"
                  style={{ height: `${(REVENUE[i] / MAX_REV) * 100}%`, opacity: i === MONTHS.length - 1 ? 1 : 0.5 }}
                />
                <span className="text-xs text-[var(--text-muted)]">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
