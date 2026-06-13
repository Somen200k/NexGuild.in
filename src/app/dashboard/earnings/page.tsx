import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/utils";
import { Download, ReceiptText } from "lucide-react";

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Earnings</h1>
          <p className="text-sm text-[var(--text-secondary)]">Your complete transaction history.</p>
        </div>
        <Button variant="secondary" size="sm" disabled>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total Earned" value={formatCurrency(0)} />
        <StatCard label="Total Withdrawn" value={formatCurrency(0)} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {["Date Range", "Type", "Status"].map((f) => (
          <select
            key={f}
            className="h-9 px-3 pr-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
          >
            <option>{f}</option>
          </select>
        ))}
      </div>

      {/* Empty State */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-16 flex flex-col items-center gap-3 text-center">
        <ReceiptText className="h-10 w-10 text-[var(--text-muted)]" />
        <p className="font-semibold text-[var(--text-primary)]">No transactions yet</p>
        <p className="text-sm text-[var(--text-secondary)]">Completed tasks and withdrawals will appear here.</p>
      </div>
    </div>
  );
}
