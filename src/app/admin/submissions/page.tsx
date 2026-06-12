import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const SUBMISSIONS = [
  { contributor: "Alex Johnson",  opportunity: "Consumer Habits Survey",    type: "Survey",     date: "Jun 12, 2025", payout: 1.20 },
  { contributor: "Priya Sharma",  opportunity: "Image Sentiment Tagging",   type: "Micro-task", date: "Jun 12, 2025", payout: 0.06 },
  { contributor: "Maria Santos",  opportunity: "Audio Clip Transcription",  type: "Data Lab.",  date: "Jun 11, 2025", payout: 0.90 },
  { contributor: "Liu Wei",       opportunity: "Recipe Article Writing",     type: "Content",    date: "Jun 11, 2025", payout: 3.50 },
  { contributor: "James Okafor",  opportunity: "Brand Awareness Study",     type: "Survey",     date: "Jun 10, 2025", payout: 0.60 },
  { contributor: "Sara Kim",      opportunity: "Bounding Box Annotation",   type: "Data Lab.",  date: "Jun 10, 2025", payout: 1.40 },
];

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Submissions</h1>
          <p className="text-sm text-[var(--text-secondary)]">Review and approve or reject pending contributor submissions.</p>
        </div>
        <Button variant="secondary" size="sm">
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
        <span className="text-sm text-[var(--text-muted)]">{SUBMISSIONS.length} pending</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              <th className="text-left px-4 py-3 w-8">
                <input type="checkbox" className="accent-[var(--brand-500)]" />
              </th>
              {["Contributor","Opportunity","Type","Date","Payout","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {SUBMISSIONS.map((s, i) => (
              <tr key={i} className="hover:bg-[var(--surface-subtle)] transition-colors">
                <td className="px-4 py-3"><input type="checkbox" className="accent-[var(--brand-500)]" /></td>
                <td className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">{s.contributor}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[180px] truncate">{s.opportunity}</td>
                <td className="px-4 py-3"><Badge variant="neutral">{s.type}</Badge></td>
                <td className="px-4 py-3 text-[var(--text-muted)] whitespace-nowrap">{s.date}</td>
                <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{formatCurrency(s.payout)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="ghost">Review</Button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-md text-success-700 hover:bg-success-50 transition-colors" title="Approve">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-md text-danger-700 hover:bg-danger-50 transition-colors" title="Reject">
                      <XCircle className="h-4 w-4" />
                    </button>
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
