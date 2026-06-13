import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, Search } from "lucide-react";
import Link from "next/link";

export default function AdminTasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tasks</h1>
          <p className="text-sm text-[var(--text-secondary)]">Create and manage all contributor tasks.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/tasks/new">
            <Plus className="h-4 w-4" /> Post New Task
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] flex-1 min-w-[200px] max-w-xs">
          <Search className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
          <input type="text" placeholder="Search tasks..." className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
        </div>
        {["Type", "Status"].map((f) => (
          <select key={f} className="h-9 px-3 pr-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]">
            <option>{f}</option>
          </select>
        ))}
      </div>

      {/* Empty State */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-16 flex flex-col items-center gap-4 text-center">
        <ClipboardList className="h-10 w-10 text-[var(--text-muted)]" />
        <div>
          <p className="font-semibold text-[var(--text-primary)] mb-1">No tasks yet</p>
          <p className="text-sm text-[var(--text-secondary)]">Post your first task and contributors can start applying.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/tasks/new"><Plus className="h-4 w-4" /> Post New Task</Link>
        </Button>
      </div>
    </div>
  );
}
