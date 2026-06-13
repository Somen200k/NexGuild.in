import { Button } from "@/components/ui/button";
import { FolderOpen, Plus } from "lucide-react";

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

      {/* Empty State */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-16 flex flex-col items-center gap-4 text-center">
        <FolderOpen className="h-10 w-10 text-[var(--text-muted)]" />
        <div>
          <p className="font-semibold text-[var(--text-primary)] mb-1">No projects yet</p>
          <p className="text-sm text-[var(--text-secondary)]">Create a project to manage contributor tasks and budgets.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> New Project</Button>
      </div>
    </div>
  );
}
