import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Users, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Task Detail — NexGuild" };

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back */}
      <Link
        href="/dashboard/tasks"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </Link>

      {/* Task Header */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <Badge variant="info">Task #{params.id}</Badge>
          <Badge variant="success">Available</Badge>
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Task Details</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
          Full task details, requirements, and submission instructions will be displayed here once tasks are live.
        </p>

        <div className="flex items-center gap-5 text-sm text-[var(--text-muted)] mb-6">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Est. time shown on task
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Open to all
          </span>
        </div>

        <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-default)] p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-[var(--brand-500)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Requirements</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Task requirements will be shown here when tasks are live.
          </p>
        </div>

        <div className="flex gap-3">
          <Button size="lg">Start Task</Button>
          <Button variant="ghost" asChild size="lg">
            <Link href="/dashboard/tasks">Cancel</Link>
          </Button>
        </div>
      </div>

      {/* Submission Instructions */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Submission Instructions</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Submission instructions and file upload requirements will appear here when the task begins.
        </p>
      </div>
    </div>
  );
}
