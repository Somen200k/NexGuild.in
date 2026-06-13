import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Submissions</h1>
          <p className="text-sm text-[var(--text-secondary)]">Review and approve or reject pending contributor submissions.</p>
        </div>
        <Button variant="secondary" size="sm" disabled>
          <CheckCircle className="h-4 w-4" /> Bulk Approve
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {["Opportunity", "Type", "Date"].map((f) => (
          <select key={f} className="h-9 px-3 pr-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]">
            <option>{f}</option>
          </select>
        ))}
        <span className="text-sm text-[var(--text-muted)]">0 pending</span>
      </div>

      {/* Table Shell */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              <th className="text-left px-4 py-3 w-8">
                <input type="checkbox" className="accent-[var(--brand-500)]" disabled />
              </th>
              {["Contributor","Opportunity","Type","Date","Payout","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--text-muted)]">
                No submissions pending review
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
