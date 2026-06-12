import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { BadgeVariant } from "@/components/ui/badge";

const OPPORTUNITIES = [
  { title: "Consumer Habits Survey",    type: "Survey",     status: "published", submissions: 142, payout: 1.20 },
  { title: "Image Sentiment Tagging",   type: "Micro-task", status: "published", submissions: 891, payout: 0.06 },
  { title: "Recipe Article Writing",    type: "Content",    status: "published", submissions: 23,  payout: 3.50 },
  { title: "Audio Clip Transcription",  type: "Data Lab.",  status: "paused",    submissions: 67,  payout: 0.90 },
  { title: "App UX Feedback",           type: "Content",    status: "draft",     submissions: 0,   payout: 5.00 },
  { title: "Brand Awareness Study",     type: "Survey",     status: "archived",  submissions: 500, payout: 0.60 },
];

const statusVariants: Record<string, BadgeVariant> = {
  published: "success",
  paused:    "warning",
  draft:     "neutral",
  archived:  "neutral",
};

export default function AdminOpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Opportunities</h1>
          <p className="text-sm text-[var(--text-secondary)]">Create and manage all contributor opportunities.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> Create Opportunity</Button>
      </div>

      <div className="flex items-center gap-3">
        {["Type", "Status"].map((f) => (
          <select key={f} className="h-9 px-3 pr-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]">
            <option>{f}</option>
          </select>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              {["Title","Type","Status","Submissions","Payout","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {OPPORTUNITIES.map((o) => (
              <tr key={o.title} className="hover:bg-[var(--surface-subtle)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)] max-w-[200px] truncate">{o.title}</td>
                <td className="px-4 py-3"><Badge variant="neutral">{o.type}</Badge></td>
                <td className="px-4 py-3"><Badge variant={statusVariants[o.status]}>{o.status}</Badge></td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{o.submissions}</td>
                <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{formatCurrency(o.payout)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">Edit</Button>
                    {o.status === "published" && <Button size="sm" variant="ghost">Pause</Button>}
                    {o.status === "paused" && <Button size="sm" variant="ghost">Publish</Button>}
                    {o.status === "draft" && <Button size="sm" variant="secondary">Publish</Button>}
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
