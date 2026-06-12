import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { BadgeVariant } from "@/components/ui/badge";

const PROJECTS = [
  { title: "Voice Dataset Collection",   type: "Data Collection",  status: "active",    budget: 2000, used: 840,  contributors: 12 },
  { title: "E-commerce Content Pack",    type: "Content Prod.",    status: "active",    budget: 500,  used: 210,  contributors: 6 },
  { title: "App Store Screenshot QA",    type: "QA / Testing",     status: "completed", budget: 300,  used: 300,  contributors: 8 },
  { title: "Medical Transcript Labels",  type: "Data Annotation",  status: "draft",     budget: 1500, used: 0,    contributors: 0 },
];

const statusVariants: Record<string, BadgeVariant> = {
  draft:     "neutral",
  active:    "success",
  completed: "info",
  cancelled: "danger",
};

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage all managed projects and their tasks.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> New Project</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PROJECTS.map((p) => {
          const pct = p.budget > 0 ? Math.round((p.used / p.budget) * 100) : 0;
          return (
            <div key={p.title} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{p.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">{p.type}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={statusVariants[p.status]}>{p.status}</Badge>
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p className="text-[var(--text-muted)] text-xs">Budget</p>
                  <p className="font-semibold text-[var(--text-primary)]">{formatCurrency(p.budget)}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] text-xs">Used</p>
                  <p className="font-semibold text-[var(--text-primary)]">{formatCurrency(p.used)}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] text-xs">Contributors</p>
                  <p className="font-semibold text-[var(--text-primary)]">{p.contributors}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                  <span>Budget used</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--brand-500)] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
