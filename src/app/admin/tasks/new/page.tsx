import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Post New Task — Admin" };

const TASK_TYPES = [
  "Audio Recording",
  "Transcription",
  "Data Annotation",
  "App Testing",
  "Game Testing",
  "Survey",
  "Social Media Task",
  "Web Research",
  "Data Collection",
  "Content Task",
  "Micro-task",
];

const inputClass = "w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors";
const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

export default function PostNewTaskPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/tasks" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Post New Task</h1>
        <p className="text-sm text-[var(--text-secondary)]">Create a new task for contributors to complete.</p>
      </div>

      <form className="space-y-5">
        {/* Basic Info */}
        <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <h2 className="font-semibold text-[var(--text-primary)]">Task Details</h2>

          <div>
            <label className={labelClass}>Task Title <span className="text-[var(--danger-text)]">*</span></label>
            <input type="text" required placeholder="e.g. Audio Recording — English Prompts" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Task Type <span className="text-[var(--danger-text)]">*</span></label>
            <select required className={inputClass}>
              <option value="">Select task type</option>
              {TASK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Description <span className="text-[var(--danger-text)]">*</span></label>
            <textarea
              required
              rows={4}
              placeholder="Describe the task clearly — what contributors need to do, quality standards, and any special requirements..."
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors resize-y"
            />
          </div>

          <div>
            <label className={labelClass}>Instructions for Contributors <span className="text-[var(--danger-text)]">*</span></label>
            <textarea
              required
              rows={3}
              placeholder="Step-by-step instructions contributors will see when they start the task..."
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors resize-y"
            />
          </div>
        </section>

        {/* Pay & Capacity */}
        <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <h2 className="font-semibold text-[var(--text-primary)]">Pay & Capacity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Pay Per Task (USD) <span className="text-[var(--danger-text)]">*</span></label>
              <input type="number" required min={0.01} step={0.01} placeholder="0.00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Total Slots <span className="text-[var(--danger-text)]">*</span></label>
              <input type="number" required min={1} placeholder="e.g. 100" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Estimated Minutes</label>
              <input type="number" min={1} placeholder="e.g. 10" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Deadline</label>
              <input type="date" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Skill Level Required</label>
            <select className={inputClass}>
              <option value="any">Any — No experience needed</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </section>

        {/* Assignment */}
        <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
          <h2 className="font-semibold text-[var(--text-primary)]">Assignment Gate</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Require contributors to pass an assignment before accessing this task.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked="false"
              className="h-6 w-11 rounded-full bg-[var(--border-default)] relative flex-shrink-0 transition-colors"
            >
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform" />
            </button>
            <span className="text-sm text-[var(--text-secondary)]">Require assignment to unlock task</span>
          </div>

          <div className="opacity-40 pointer-events-none">
            <label className={labelClass}>Assignment Type</label>
            <select className={inputClass}>
              <option value="quiz">Quiz</option>
              <option value="file">File Upload</option>
            </select>
          </div>
        </section>

        <div className="flex gap-3">
          <Button type="submit" size="lg">Publish Task</Button>
          <Button type="button" variant="secondary" size="lg">Save as Draft</Button>
          <Button type="button" variant="ghost" size="lg" asChild>
            <Link href="/admin/tasks">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
