import { Button } from "@/components/ui/button";
import { Briefcase, Plus } from "lucide-react";

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

      {/* Empty State */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-16 flex flex-col items-center gap-4 text-center">
        <Briefcase className="h-10 w-10 text-[var(--text-muted)]" />
        <div>
          <p className="font-semibold text-[var(--text-primary)] mb-1">No opportunities yet</p>
          <p className="text-sm text-[var(--text-secondary)]">Create your first opportunity to start receiving contributor submissions.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> Create Opportunity</Button>
      </div>
    </div>
  );
}
