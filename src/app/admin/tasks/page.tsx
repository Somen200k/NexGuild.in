import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import type { BadgeVariant } from "@/components/ui/badge";

const TASKS = [
  { title: "Audio Recording — Short Prompts",  type: "Data Collection", status: "published", slots: 50,  filled: 12 },
  { title: "Image Bounding Box Annotation",     type: "Data Annotation", status: "published", slots: 200, filled: 87 },
  { title: "App UX Feedback Survey",            type: "Survey",          status: "published", slots: 100, filled: 34 },
  { title: "Sentiment Classification Batch",    type: "Micro-task",      status: "paused",    slots: 500, filled: 210 },
  { title: "Product Description Writing",       type: "Content Task",    status: "draft",     slots: 30,  filled: 0 },
  { title: "Website Accessibility Testing",     type: "App Testing",     status: "archived",  slots: 40,  filled: 40 },
];

const statusVariants: Record<string, BadgeVariant> = {
  published: "success",
  paused:    "warning",
  draft:     "neutral",
  archived:  "neutral",
};

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

      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              {["Title","Type","Status","Slots","Filled","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {TASKS.map((t) => (
              <tr key={t.title} className="hover:bg-[var(--surface-subtle)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)] max-w-[200px] truncate">{t.title}</td>
                <td className="px-4 py-3"><Badge variant="neutral">{t.type}</Badge></td>
                <td className="px-4 py-3"><Badge variant={statusVariants[t.status]}>{t.status}</Badge></td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{t.slots}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  <span className="font-medium text-[var(--text-primary)]">{t.filled}</span>
                  <span className="text-[var(--text-muted)]"> / {t.slots}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">Edit</Button>
                    {t.status === "published" && <Button size="sm" variant="ghost">Pause</Button>}
                    {t.status === "paused"    && <Button size="sm" variant="ghost">Resume</Button>}
                    {t.status === "draft"     && <Button size="sm" variant="secondary">Publish</Button>}
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
