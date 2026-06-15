import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const anon = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
  const { data: { user } } = await anon.auth.getUser(token);
  if (!user) return null;
  const srv = createServerClient();
  const { data: profile } = await srv.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export interface TaskStat {
  task_id: string;
  task_title: string;
  task_type: string | null;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  approval_rate: number;
  avg_review_hours: number | null;
}

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const srv = createServerClient();

  const { data: submissions, error } = await srv
    .from("submissions")
    .select("task_id, status, submitted_at, reviewed_at, tasks(title, task_type)");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  type Row = {
    task_id: string;
    status: string;
    submitted_at: string;
    reviewed_at: string | null;
    tasks: { title: string; task_type: string | null } | null;
  };

  const map = new Map<string, {
    title: string;
    task_type: string | null;
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    reviewMs: number[];
  }>();

  for (const row of (submissions ?? []) as unknown as Row[]) {
    if (!row.task_id) continue;
    if (!map.has(row.task_id)) {
      map.set(row.task_id, {
        title: row.tasks?.title ?? "Unknown Task",
        task_type: row.tasks?.task_type ?? null,
        total: 0, approved: 0, rejected: 0, pending: 0, reviewMs: [],
      });
    }
    const entry = map.get(row.task_id)!;
    entry.total++;
    if (row.status === "approved") entry.approved++;
    else if (row.status === "rejected") entry.rejected++;
    else entry.pending++;

    if (row.reviewed_at && row.submitted_at) {
      const ms = new Date(row.reviewed_at).getTime() - new Date(row.submitted_at).getTime();
      if (ms >= 0) entry.reviewMs.push(ms);
    }
  }

  const stats: TaskStat[] = Array.from(map.entries())
    .map(([task_id, e]) => ({
      task_id,
      task_title: e.title,
      task_type: e.task_type,
      total: e.total,
      approved: e.approved,
      rejected: e.rejected,
      pending: e.pending,
      approval_rate: e.total > 0 ? Math.round((e.approved / e.total) * 100) : 0,
      avg_review_hours: e.reviewMs.length > 0
        ? Math.round((e.reviewMs.reduce((a, b) => a + b, 0) / e.reviewMs.length) / (1000 * 60 * 60) * 10) / 10
        : null,
    }))
    .sort((a, b) => b.total - a.total);

  return NextResponse.json({ stats });
}
