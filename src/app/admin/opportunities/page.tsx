"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Task {
  id: string;
  title: string;
  task_type: string | null;
  pay_per_task: number | null;
  total_slots: number | null;
  filled_slots: number | null;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  active:   "bg-green-500/10 text-green-400",
  paused:   "bg-yellow-500/10 text-yellow-400",
  draft:    "bg-blue-500/10 text-blue-400",
  archived: "bg-[var(--surface-subtle)] text-[var(--text-muted)]",
};

export default function AdminOpportunitiesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function fetchTasks() {
      const { data } = await supabase
        .from("tasks")
        .select("id, title, task_type, pay_per_task, total_slots, filled_slots, status")
        .order("created_at", { ascending: false });
      setTasks(data ?? []);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  const filtered = tasks.filter((t) => {
    const matchSearch = search === "" || t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Opportunities</h1>
          <p className="text-sm text-[var(--text-secondary)]">All tasks visible to contributors as earning opportunities.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/tasks/new">
            <Plus className="h-4 w-4" /> Create Opportunity
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] flex-1 min-w-[200px] max-w-xs">
          <Search className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities…"
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 pr-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
        >
          {["All", "Active", "Paused", "Draft", "Archived"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-32 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-16 flex flex-col items-center gap-4 text-center">
          <Briefcase className="h-10 w-10 text-[var(--text-muted)]" />
          <div>
            <p className="font-semibold text-[var(--text-primary)] mb-1">
              {tasks.length === 0 ? "No opportunities yet" : "No results found"}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {tasks.length === 0
                ? "Create your first task — contributors see active tasks as opportunities."
                : "Try adjusting your search or filter."}
            </p>
          </div>
          {tasks.length === 0 && (
            <Button asChild size="sm">
              <Link href="/admin/tasks/new"><Plus className="h-4 w-4" /> Create Opportunity</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((task) => (
            <div key={task.id} className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--brand-500)] uppercase tracking-wider">
                  {task.task_type ?? "Task"}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[task.status] ?? ""}`}>
                  {task.status}
                </span>
              </div>
              <p className="font-semibold text-[var(--text-primary)] text-sm line-clamp-2 flex-1">{task.title}</p>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="text-[var(--brand-500)] font-medium">
                  {task.pay_per_task != null ? `${task.pay_per_task} coins` : "—"}
                </span>
                <span>
                  {task.filled_slots ?? 0} / {task.total_slots ?? "∞"} slots
                </span>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/admin/tasks`}>Manage →</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
