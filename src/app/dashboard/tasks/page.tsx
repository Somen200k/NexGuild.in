import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TABS = ["In Progress", "Submitted", "Approved", "Rejected"];

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">My Tasks</h1>
        <p className="text-sm text-[var(--text-secondary)]">Track all your submissions and their review status.</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 border-b border-[var(--border-default)] overflow-x-auto scrollbar-thin">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              i === 0
                ? "border-[var(--brand-500)] text-[var(--brand-600)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-16 flex flex-col items-center gap-4">
        <ClipboardList className="h-10 w-10 text-[var(--text-muted)]" />
        <div className="text-center">
          <p className="font-semibold text-[var(--text-primary)] mb-1">No tasks yet</p>
          <p className="text-sm text-[var(--text-secondary)]">Start a task and your submissions will appear here.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/opportunities">Browse Opportunities</Link>
        </Button>
      </div>
    </div>
  );
}
