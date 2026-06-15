"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Lock, CheckCircle2, ChevronDown, ChevronRight,
  Upload, X, Loader2, Clock, Coins, Users, AlertCircle, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface TaskStep {
  title: string;
  description: string;
  submitType: "text" | "file" | "none";
  placeholder?: string;
  acceptedFiles?: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  task_type: string | null;
  requirements: string | null;
  pay_per_task: number | null;
  total_slots: number | null;
  filled_slots: number | null;
  deadline: string | null;
  status: string;
  assignment_required: boolean;
  is_private: boolean | null;
  validation_time: string | null;
  payment_time: string | null;
  steps: TaskStep[] | null;
}

interface StepSubmission {
  step_index: number;
  submission_type: string;
  text_value: string | null;
  file_url: string | null;
}

interface FileItem {
  name: string;
  url: string;
  size: number;
}

function formatCountdown(deadline: string | null, now: Date): string {
  if (!deadline) return "";
  const diff = new Date(deadline).getTime() - now.getTime();
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export default function TaskWorkPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [userId, setUserId]                   = useState<string | null>(null);
  const [task, setTask]                       = useState<Task | null>(null);
  const [submissionId, setSubmissionId]       = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [stepSubs, setStepSubs]               = useState<StepSubmission[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [pageError, setPageError]             = useState<string | null>(null);
  const [expandedStep, setExpandedStep]       = useState<number | null>(0);
  const [textInputs, setTextInputs]           = useState<Record<number, string>>({});
  const [stepFiles, setStepFiles]             = useState<Record<number, File | null>>({});
  const [submittingStep, setSubmittingStep]   = useState<number | null>(null);
  const [stepError, setStepError]             = useState<string | null>(null);

  // Classic mode
  const [classicNotes, setClassicNotes]       = useState("");
  const [classicFiles, setClassicFiles]       = useState<File[]>([]);
  const [classicSubmitting, setClassicSubmitting] = useState(false);
  const [classicError, setClassicError]       = useState<string | null>(null);

  const [done, setDone]   = useState(false);
  const [now, setNow]     = useState(() => new Date());

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const [taskRes, subRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("id", id).single(),
        supabase.from("submissions")
          .select("id, status")
          .eq("task_id", id)
          .eq("contributor_id", user.id)
          .maybeSingle(),
      ]);

      if (!taskRes.data) { setPageError("Task not found."); setLoading(false); return; }
      const t = taskRes.data as Task;
      setTask(t);

      let sid: string | null = subRes.data?.id ?? null;
      let sstatus: string | null = subRes.data?.status ?? null;

      // Create in_progress submission if it doesn't exist yet
      if (!sid) {
        const { data: newSub } = await supabase
          .from("submissions")
          .insert({ task_id: id, contributor_id: user.id, status: "in_progress" })
          .select("id, status")
          .single();
        if (newSub) {
          sid = newSub.id;
          sstatus = newSub.status;
          const newFilled = (t.filled_slots ?? 0) + 1;
          const isClosed  = t.total_slots != null && newFilled >= t.total_slots;
          await supabase.from("tasks").update({
            filled_slots: newFilled,
            ...(isClosed ? { status: "closed" } : {}),
          }).eq("id", id);
        }
      }

      setSubmissionId(sid);
      setSubmissionStatus(sstatus);

      // Load step submissions (gracefully handle if table doesn't exist)
      if (sid) {
        try {
          const { data: subs } = await supabase
            .from("task_step_submissions")
            .select("step_index, submission_type, text_value, file_url")
            .eq("task_id", id)
            .eq("contributor_id", user.id);

          const loaded = (subs ?? []) as StepSubmission[];
          setStepSubs(loaded);

          // Auto-expand first incomplete step
          const steps = t.steps ?? [];
          if (steps.length > 0) {
            const doneSet = new Set(loaded.map((s) => s.step_index));
            const first   = steps.findIndex((_, i) => !doneSet.has(i));
            setExpandedStep(first >= 0 ? first : steps.length - 1);
          }
        } catch {
          // table may not exist yet — fall back to classic mode
        }
      }

      setLoading(false);
    }
    load();
  }, [id, router]);

  async function submitStep(idx: number, step: TaskStep) {
    if (!userId || !task) return;
    setSubmittingStep(idx);
    setStepError(null);

    let textValue: string | null = null;
    let fileUrl: string | null   = null;

    if (step.submitType === "text") {
      textValue = textInputs[idx]?.trim() || null;
      if (!textValue) { setStepError("Please enter a response."); setSubmittingStep(null); return; }
    } else if (step.submitType === "file") {
      const file = stepFiles[idx];
      if (!file) { setStepError("Please select a file."); setSubmittingStep(null); return; }
      const ext  = file.name.split(".").pop() ?? "bin";
      const path = `${userId}/${id}/step${idx}_${Date.now()}.${ext}`;
      const { data: upData, error: upErr } = await supabase.storage
        .from("submissions")
        .upload(path, file, { upsert: true });
      if (upErr) { setStepError("Upload failed: " + upErr.message); setSubmittingStep(null); return; }
      const { data: urlData } = supabase.storage.from("submissions").getPublicUrl(upData.path);
      fileUrl = urlData.publicUrl;
    }

    const { error: saveErr } = await supabase.from("task_step_submissions").upsert({
      task_id: id,
      contributor_id: userId,
      step_index: idx,
      submission_type: step.submitType,
      text_value: textValue,
      file_url: fileUrl,
      submitted_at: new Date().toISOString(),
    }, { onConflict: "task_id,contributor_id,step_index" });

    if (saveErr) { setStepError(saveErr.message); setSubmittingStep(null); return; }

    const updated = [
      ...stepSubs.filter((s) => s.step_index !== idx),
      { step_index: idx, submission_type: step.submitType, text_value: textValue, file_url: fileUrl },
    ];
    setStepSubs(updated);

    const totalSteps = task.steps?.length ?? 0;
    if (updated.length >= totalSteps) {
      if (submissionId) {
        await supabase.from("submissions").update({
          status: "submitted",
          submitted_at: new Date().toISOString(),
        }).eq("id", submissionId);
        setSubmissionStatus("submitted");
      }
      setDone(true);
    } else {
      setExpandedStep(idx + 1);
    }

    setSubmittingStep(null);
  }

  async function submitClassic(e: React.FormEvent) {
    e.preventDefault();
    if (!submissionId) return;
    if (!classicNotes.trim() && classicFiles.length === 0) {
      setClassicError("Add notes or upload at least one file.");
      return;
    }
    setClassicSubmitting(true);
    setClassicError(null);

    const uploaded: FileItem[] = [];
    for (const file of classicFiles) {
      const path = `${userId}/${id}/${Date.now()}_${file.name}`;
      const { data: upData, error: upErr } = await supabase.storage
        .from("submissions")
        .upload(path, file, { upsert: true });
      if (upErr) {
        setClassicError(`Failed to upload "${file.name}": ${upErr.message}`);
        setClassicSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("submissions").getPublicUrl(upData.path);
      uploaded.push({ name: file.name, url: urlData.publicUrl, size: file.size });
    }

    const { error: updateErr } = await supabase.from("submissions").update({
      files: uploaded.length > 0 ? uploaded : null,
      notes: classicNotes.trim() || null,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    }).eq("id", submissionId);

    if (updateErr) { setClassicError(updateErr.message); setClassicSubmitting(false); return; }
    setDone(true);
    setClassicSubmitting(false);
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-500)]" />
      </div>
    );
  }

  if (pageError || !task) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Link href="/dashboard/opportunities" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-10 text-center">
          <AlertCircle className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="font-semibold text-[var(--text-primary)]">{pageError ?? "Task not found"}</p>
        </div>
      </div>
    );
  }

  // ── Done / Already submitted ───────────────────────────────────────────────
  if (done || submissionStatus === "submitted" || submissionStatus === "approved") {
    return (
      <div className="max-w-md mx-auto space-y-6 py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            {submissionStatus === "approved" ? "Task Approved! 🎉" : "Submission Received!"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {submissionStatus === "approved"
              ? "Your submission has been approved and NexCoins have been credited to your account."
              : "Our admin team will review your work and get back to you."}
          </p>
          {task.pay_per_task && (
            <p className="text-sm font-bold text-[var(--brand-500)] mt-3">
              Reward: {task.pay_per_task} NexCoins
            </p>
          )}
          {task.validation_time && submissionStatus !== "approved" && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Review time: {task.validation_time}
            </p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link href="/dashboard/tasks">My Tasks</Link></Button>
          <Button variant="secondary" asChild><Link href="/dashboard/opportunities">Browse More</Link></Button>
        </div>
      </div>
    );
  }

  const steps          = task.steps ?? [];
  const hasSteps       = steps.length > 0;
  const doneSet        = new Set(stepSubs.map((s) => s.step_index));
  const completedCount = doneSet.size;
  const progressPct    = hasSteps ? (completedCount / steps.length) * 100 : 0;
  const countdown      = formatCountdown(task.deadline, now);
  const isPrivate      = task.is_private || task.assignment_required;

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/dashboard/opportunities"
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] transition-colors flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-[var(--text-primary)] text-lg truncate">{task.title}</h1>
        </div>
        {task.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--surface-subtle)] border border-[var(--border-default)] px-2.5 py-1.5 rounded-lg flex-shrink-0">
            <Clock className="h-3.5 w-3.5" />
            <span className={`font-mono font-semibold ${countdown === "Ended" ? "text-red-400" : ""}`}>{countdown}</span>
          </div>
        )}
      </div>

      {/* Meta pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {task.pay_per_task && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-500)] bg-[rgba(20,184,166,0.1)] px-2.5 py-1 rounded-full">
            <Coins className="h-3 w-3" /> {task.pay_per_task} coins
          </span>
        )}
        {task.total_slots != null && (
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--surface-subtle)] px-2.5 py-1 rounded-full">
            <Users className="h-3 w-3" /> {task.filled_slots ?? 0}/{task.total_slots} slots
          </span>
        )}
        {isPrivate && (
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
            <Lock className="h-3 w-3" /> Private
          </span>
        )}
        {task.task_type && (
          <span className="text-xs font-semibold text-[var(--brand-500)] bg-[rgba(20,184,166,0.08)] px-2.5 py-1 rounded-full uppercase tracking-wide">
            {task.task_type}
          </span>
        )}
      </div>

      {/* ── STEPS MODE ─────────────────────────────────────────────────────── */}
      {hasSteps && (
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
          {/* Progress header */}
          <div className="px-5 py-4 border-b border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[var(--text-primary)]">Progress</span>
              <span className="text-xs text-[var(--text-muted)]">
                {completedCount}/{steps.length} steps completed
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--surface-subtle)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--brand-500)] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Steps accordion */}
          <div className="divide-y divide-[var(--border-default)]">
            {steps.map((step, idx) => {
              const isCompleted = doneSet.has(idx);
              const isLocked    = !isCompleted && idx > 0 && !doneSet.has(idx - 1);
              const isExpanded  = expandedStep === idx && !isLocked;
              const stepSub     = stepSubs.find((s) => s.step_index === idx);

              return (
                <div key={idx}>
                  <button
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
                      isLocked
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-[var(--surface-subtle)] cursor-pointer"
                    }`}
                    onClick={() => !isLocked && setExpandedStep(isExpanded ? null : idx)}
                    disabled={isLocked}
                  >
                    {/* Step icon */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isCompleted
                        ? "bg-green-500/10 text-green-400"
                        : isLocked
                        ? "bg-[var(--surface-subtle)] text-[var(--text-muted)]"
                        : "bg-[rgba(20,184,166,0.1)] text-[var(--brand-500)]"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isLocked ? <Lock className="h-3.5 w-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isCompleted ? "text-[var(--text-secondary)] line-through decoration-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                        Step {idx + 1}: {step.title}
                      </p>
                      {isCompleted && stepSub && (
                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                          {stepSub.text_value
                            ? `"${stepSub.text_value.slice(0, 50)}${stepSub.text_value.length > 50 ? "…" : ""}"`
                            : stepSub.file_url ? "File uploaded ✓" : "Completed ✓"}
                        </p>
                      )}
                    </div>

                    {!isLocked && (
                      isExpanded
                        ? <ChevronDown className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
                        : <ChevronRight className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-4 bg-[var(--surface-subtle)] border-t border-[var(--border-default)] space-y-4">
                      {step.description && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
                      )}

                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                          <CheckCircle2 className="h-4 w-4" /> Step completed
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {step.submitType === "text" && (
                            <input
                              type="text"
                              value={textInputs[idx] ?? ""}
                              onChange={(e) => setTextInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                              placeholder={step.placeholder ?? "Enter your response here…"}
                              className="w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                            />
                          )}

                          {step.submitType === "file" && (
                            <div>
                              <label
                                htmlFor={`step-file-${idx}`}
                                className="flex flex-col items-center gap-2 border-2 border-dashed border-[var(--border-default)] rounded-lg p-5 cursor-pointer hover:border-[var(--brand-500)] transition-colors text-center"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const file = e.dataTransfer.files[0];
                                  if (file) setStepFiles((prev) => ({ ...prev, [idx]: file }));
                                }}
                              >
                                <Upload className="h-5 w-5 text-[var(--text-muted)]" />
                                <span className="text-sm text-[var(--text-secondary)]">
                                  {stepFiles[idx] ? stepFiles[idx]!.name : "Click to select or drag & drop"}
                                </span>
                                {step.acceptedFiles && (
                                  <span className="text-xs text-[var(--text-muted)]">Accepted: {step.acceptedFiles}</span>
                                )}
                                <input
                                  id={`step-file-${idx}`}
                                  type="file"
                                  accept={step.acceptedFiles}
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setStepFiles((prev) => ({ ...prev, [idx]: file }));
                                  }}
                                />
                              </label>
                              {stepFiles[idx] && (
                                <div className="flex items-center justify-between gap-2 mt-2 px-3 py-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border-default)]">
                                  <span className="text-sm text-[var(--text-primary)] truncate">{stepFiles[idx]!.name}</span>
                                  <button
                                    onClick={() => setStepFiles((prev) => ({ ...prev, [idx]: null }))}
                                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors flex-shrink-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {stepError && submittingStep !== idx && (
                            <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{stepError}</p>
                          )}

                          <Button
                            size="sm"
                            onClick={() => submitStep(idx, step)}
                            disabled={submittingStep === idx}
                          >
                            {submittingStep === idx ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : idx === steps.length - 1 ? (
                              "Submit & Complete Task →"
                            ) : step.submitType === "none" ? (
                              "Mark as Complete →"
                            ) : (
                              "Submit Step →"
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CLASSIC MODE (no steps) ────────────────────────────────────────── */}
      {!hasSteps && (
        <div className="space-y-4">
          {/* Task info */}
          {(task.description || task.requirements) && (
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5 space-y-4">
              {task.description && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{task.description}</p>
              )}
              {task.requirements && (
                <div className="rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-default)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-[var(--brand-500)]" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">Instructions</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                    {task.requirements}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Submit form */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5">
            <h2 className="font-bold text-[var(--text-primary)] mb-4">Submit Your Work</h2>
            <form onSubmit={submitClassic} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Notes <span className="text-[var(--text-muted)] font-normal">(optional if uploading files)</span>
                </label>
                <textarea
                  value={classicNotes}
                  onChange={(e) => setClassicNotes(e.target.value)}
                  rows={4}
                  placeholder="Describe what you did, include links, or add notes for the reviewer…"
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  Files <span className="text-[var(--text-muted)] font-normal">(optional if adding notes)</span>
                </label>
                <label
                  htmlFor="classic-files"
                  className="flex flex-col items-center gap-2 border-2 border-dashed border-[var(--border-default)] rounded-lg p-6 cursor-pointer hover:border-[var(--brand-500)] transition-colors text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setClassicFiles((prev) => [...prev, ...files.filter((f) => !prev.some((p) => p.name === f.name))]);
                  }}
                >
                  <Upload className="h-6 w-6 text-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Click to select files or drag & drop</span>
                  <input
                    id="classic-files"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      setClassicFiles((prev) => [...prev, ...files.filter((f) => !prev.some((p) => p.name === f.name))]);
                      e.target.value = "";
                    }}
                  />
                </label>
                {classicFiles.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {classicFiles.map((f, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--surface-subtle)] border border-[var(--border-default)]">
                        <span className="text-sm text-[var(--text-primary)] truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => setClassicFiles((prev) => prev.filter((_, j) => j !== i))}
                          className="text-[var(--text-muted)] hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {classicError && (
                <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{classicError}</p>
              )}

              <div className="flex gap-3 flex-wrap">
                <Button type="submit" disabled={classicSubmitting}>
                  {classicSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Work →"}
                </Button>
                <Button type="button" variant="ghost" asChild>
                  <Link href="/dashboard/tasks">Cancel</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
