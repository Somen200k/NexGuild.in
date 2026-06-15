"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Loader2, Plus, Trash2, ChevronUp, ChevronDown, GripVertical,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const TASK_TYPES = [
  "Audio Recording", "Transcription", "Data Annotation", "App Testing",
  "Game Testing", "Survey", "Social Media Task", "Web Research",
  "Data Collection", "Content Task", "Micro-task",
];

const LANGUAGES = [
  "Any", "English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil",
  "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu",
  "Arabic", "French", "German", "Spanish", "Portuguese",
  "Japanese", "Korean", "Chinese (Simplified)", "Filipino",
];

const VALIDATION_TIMES = ["24 hours", "48 hours", "72 hours", "5 days", "7 days"];
const PAYMENT_TIMES    = ["48 hours", "72 hours", "5 days", "7 days", "14 days"];

interface TaskStep {
  title: string;
  description: string;
  submitType: "text" | "file" | "none";
  placeholder: string;
  acceptedFiles: string;
}

function newStep(): TaskStep {
  return { title: "", description: "", submitType: "text", placeholder: "", acceptedFiles: "" };
}

function Toggle({ value, onChange, label, description }: {
  value: boolean; onChange: (v: boolean) => void;
  label: string; description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{ backgroundColor: value ? "#14b8a6" : "#374151", transition: "background-color 0.2s ease" }}
        className="h-6 w-11 rounded-full relative flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:ring-offset-2"
      >
        <span
          style={{ transform: value ? "translateX(22px)" : "translateX(2px)", transition: "transform 0.2s ease" }}
          className="absolute top-[2px] left-0 h-5 w-5 rounded-full bg-white shadow-md"
        />
      </button>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

const inputClass = "w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors";
const labelClass = "block text-sm font-semibold text-[var(--text-primary)] mb-1.5";
const textareaClass = "w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent resize-y";

export default function PostNewTaskPage() {
  const router = useRouter();

  // Basic info
  const [title, setTitle]               = useState("");
  const [taskType, setTaskType]         = useState("");
  const [description, setDescription]   = useState("");
  const [requirements, setRequirements] = useState("");

  // Pay & capacity
  const [payPerTask, setPayPerTask]     = useState("");
  const [totalSlots, setTotalSlots]     = useState("");
  const [deadline, setDeadline]         = useState("");

  // Assignment gate
  const [assignmentReq, setAssignmentReq]   = useState(false);
  const [assignmentType, setAssignmentType] = useState("quiz");

  // Targeting
  const [requiredLanguage, setRequiredLanguage] = useState("Any");
  const [skillInput, setSkillInput]             = useState("");
  const [requiredSkills, setRequiredSkills]     = useState<string[]>([]);

  // Campaign settings
  const [isPrivate, setIsPrivate]   = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [validationTime, setValidationTime] = useState("48 hours");
  const [paymentTime, setPaymentTime]       = useState("72 hours");

  // T&C
  const [terms, setTerms] = useState("");

  // Steps builder
  const [steps, setSteps] = useState<TaskStep[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  // ── Skills ────────────────────────────────────────────────────────────────
  function addSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const s = skillInput.trim();
    if (s && !requiredSkills.includes(s)) setRequiredSkills((prev) => [...prev, s]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setRequiredSkills((prev) => prev.filter((s) => s !== skill));
  }

  // ── Steps ─────────────────────────────────────────────────────────────────
  function addStep() {
    setSteps((prev) => [...prev, newStep()]);
  }

  function removeStep(i: number) {
    setSteps((prev) => prev.filter((_, j) => j !== i));
  }

  function updateStep(i: number, key: keyof TaskStep, val: string) {
    setSteps((prev) => prev.map((s, j) => j === i ? { ...s, [key]: val } : s));
  }

  function moveStep(i: number, dir: "up" | "down") {
    const next = [...steps];
    const target = dir === "up" ? i - 1 : i + 1;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setSteps(next);
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function submit(status: "active" | "draft") {
    if (!title.trim() || !taskType || !description.trim()) {
      setError("Title, type, and description are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { setError("Not authenticated."); setSaving(false); return; }

    const stepsPayload = steps
      .filter((s) => s.title.trim())
      .map((s) => ({
        title:        s.title.trim(),
        description:  s.description.trim(),
        submitType:   s.submitType,
        placeholder:  s.placeholder.trim() || undefined,
        acceptedFiles: s.acceptedFiles.trim() || undefined,
      }));

    const res = await fetch("/api/admin/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title:               title.trim(),
        task_type:           taskType,
        description:         description.trim(),
        requirements:        requirements.trim() || null,
        pay_per_task:        payPerTask ? parseFloat(payPerTask) : null,
        total_slots:         totalSlots ? parseInt(totalSlots) : null,
        deadline:            deadline || null,
        assignment_required: assignmentReq,
        assignment_type:     assignmentReq ? assignmentType : null,
        required_language:   requiredLanguage,
        required_skills:     requiredSkills,
        is_private:          isPrivate,
        is_featured:         isFeatured,
        validation_time:     validationTime,
        payment_time:        paymentTime,
        terms:               terms.trim() || null,
        steps:               stepsPayload.length > 0 ? stepsPayload : [],
        status,
      }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to create task."); setSaving(false); return; }
    router.push("/admin/tasks");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/tasks" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Tasks
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Post New Task</h1>
        <p className="text-sm text-[var(--text-secondary)]">Create a task for contributors to complete.</p>
      </div>

      <div className="space-y-5">
        {/* ── Basic Info ─────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <h2 className="font-bold text-[var(--text-primary)]">Task Details</h2>

          <div>
            <label className={labelClass}>Task Title <span className="text-[var(--danger-text)]">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Audio Recording — English Prompts" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Task Type <span className="text-[var(--danger-text)]">*</span></label>
            <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className={inputClass}>
              <option value="">Select task type</option>
              {TASK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Description <span className="text-[var(--danger-text)]">*</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              placeholder="Describe the task clearly — what contributors need to do, quality standards..."
              className={textareaClass} />
          </div>

          <div>
            <label className={labelClass}>
              Instructions for Contributors
              <span className="text-[var(--text-muted)] font-normal ml-1">(shown on task page)</span>
            </label>
            <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3}
              placeholder="Step-by-step instructions contributors will see when they start the task..."
              className={textareaClass} />
          </div>
        </section>

        {/* ── Pay & Capacity ─────────────────────────────────────────────── */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <h2 className="font-bold text-[var(--text-primary)]">Pay & Capacity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Coins Per Task</label>
              <input type="number" value={payPerTask} onChange={(e) => setPayPerTask(e.target.value)}
                min={1} placeholder="e.g. 50" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Total Slots</label>
              <input type="number" value={totalSlots} onChange={(e) => setTotalSlots(e.target.value)}
                min={1} placeholder="Blank = unlimited" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
          </div>
        </section>

        {/* ── Targeting ──────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <div>
            <h2 className="font-bold text-[var(--text-primary)]">Targeting</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Restrict this task to contributors with specific language or skills.</p>
          </div>

          <div>
            <label className={labelClass}>Required Language</label>
            <select value={requiredLanguage} onChange={(e) => setRequiredLanguage(e.target.value)} className={inputClass}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Required Skills
              <span className="text-[var(--text-muted)] font-normal ml-1">(type and press Enter)</span>
            </label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              placeholder="e.g. Audio Editing, Transcription…"
              className={inputClass}
            />
            {requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {requiredSkills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(20,184,166,0.1)] text-[var(--brand-500)] text-xs font-semibold">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-400 transition-colors">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Campaign Settings ──────────────────────────────────────────── */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <div>
            <h2 className="font-bold text-[var(--text-primary)]">Campaign Settings</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Control visibility and boost settings for this task.</p>
          </div>

          <Toggle
            value={isPrivate}
            onChange={setIsPrivate}
            label="Private Task"
            description="Show a PRIVATE badge. Combines with Assignment Gate to require approval before access."
          />

          <Toggle
            value={isFeatured}
            onChange={setIsFeatured}
            label="Featured Task"
            description="Pin this task at the top of the opportunities list with a Featured badge."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Review Time</label>
              <select value={validationTime} onChange={(e) => setValidationTime(e.target.value)} className={inputClass}>
                {VALIDATION_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Payment After Approval</label>
              <select value={paymentTime} onChange={(e) => setPaymentTime(e.target.value)} className={inputClass}>
                {PAYMENT_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* ── Assignment Gate ────────────────────────────────────────────── */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <div>
            <h2 className="font-bold text-[var(--text-primary)]">Assignment Gate</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Require contributors to submit an assignment before they can start working.
            </p>
          </div>

          <Toggle
            value={assignmentReq}
            onChange={setAssignmentReq}
            label="Require assignment to unlock"
          />

          <div className={assignmentReq ? "" : "opacity-40 pointer-events-none"}>
            <label className={labelClass}>Assignment Type</label>
            <select value={assignmentType} onChange={(e) => setAssignmentType(e.target.value)} className={inputClass}>
              <option value="quiz">Quiz</option>
              <option value="file">File Upload</option>
            </select>
          </div>
        </section>

        {/* ── Terms & Conditions ─────────────────────────────────────────── */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-4">
          <div>
            <h2 className="font-bold text-[var(--text-primary)]">Terms & Conditions</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Add task-specific rules shown in the T&C popup. One rule per line.
            </p>
          </div>

          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={4}
            placeholder={"e.g.\nRecording must be 5–10 seconds long.\nNo background noise allowed.\nSubmit only WAV or MP3 format."}
            className={textareaClass}
          />
          <p className="text-xs text-[var(--text-muted)]">
            These are shown in addition to NexGuild's default rules. Leave blank if no special conditions apply.
          </p>
        </section>

        {/* ── Steps Builder ──────────────────────────────────────────────── */}
        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">Task Steps</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Break the task into sequential steps. If left empty, contributors submit one form with notes + files.
              </p>
            </div>
            <Button type="button" size="sm" variant="secondary" onClick={addStep}>
              <Plus className="h-4 w-4" /> Add Step
            </Button>
          </div>

          {steps.length === 0 && (
            <div className="rounded-lg border border-dashed border-[var(--border-default)] py-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">No steps yet — click "Add Step" to build a guided workflow.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Leave empty for a classic submit form.</p>
            </div>
          )}

          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] p-4 space-y-4"
            >
              {/* Step header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-[var(--text-muted)]" />
                  <span className="text-sm font-bold text-[var(--text-primary)]">Step {i + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveStep(i, "up")}
                    disabled={i === 0}
                    className="p-1.5 rounded hover:bg-[var(--border-default)] text-[var(--text-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(i, "down")}
                    disabled={i === steps.length - 1}
                    className="p-1.5 rounded hover:bg-[var(--border-default)] text-[var(--text-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Step Title <span className="text-[var(--danger-text)]">*</span>
                </label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                  placeholder="e.g. Record your audio"
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Description</label>
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(i, "description", e.target.value)}
                  rows={2}
                  placeholder="Explain what the contributor needs to do in this step…"
                  className={textareaClass}
                />
              </div>

              {/* Submit Type */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Submit Type</label>
                <div className="flex gap-3">
                  {(["text", "file", "none"] as const).map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`step-type-${i}`}
                        value={t}
                        checked={step.submitType === t}
                        onChange={() => updateStep(i, "submitType", t)}
                        className="accent-[var(--brand-500)]"
                      />
                      <span className="text-sm text-[var(--text-secondary)] capitalize">
                        {t === "none" ? "Mark Complete" : t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Text options */}
              {step.submitType === "text" && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Placeholder text</label>
                  <input
                    type="text"
                    value={step.placeholder}
                    onChange={(e) => updateStep(i, "placeholder", e.target.value)}
                    placeholder="e.g. Paste the link to your recording here…"
                    className={inputClass}
                  />
                </div>
              )}

              {/* File options */}
              {step.submitType === "file" && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Accepted file types</label>
                  <input
                    type="text"
                    value={step.acceptedFiles}
                    onChange={(e) => updateStep(i, "acceptedFiles", e.target.value)}
                    placeholder="e.g. .mp3,.wav,.ogg (leave blank for any)"
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          ))}

          {steps.length > 0 && (
            <button
              type="button"
              onClick={addStep}
              className="w-full py-2.5 rounded-lg border border-dashed border-[var(--border-default)] text-sm text-[var(--text-muted)] hover:text-[var(--brand-500)] hover:border-[var(--brand-500)] transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add Another Step
            </button>
          )}
        </section>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">{error}</p>
        )}

        <div className="flex gap-3 flex-wrap">
          <Button size="lg" disabled={saving} onClick={() => submit("active")}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Publish Task
          </Button>
          <Button variant="secondary" size="lg" disabled={saving} onClick={() => submit("draft")}>
            Save as Draft
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <Link href="/admin/tasks">Cancel</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
