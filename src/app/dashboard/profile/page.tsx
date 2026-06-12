import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Camera } from "lucide-react";

const SKILLS = ["Writing", "Data Entry", "Translation", "Research"];

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Profile</h1>
        <p className="text-sm text-[var(--text-secondary)]">Your public contributor profile and stats.</p>
      </div>

      {/* Profile Header */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <Avatar name="Alex Johnson" size="lg" />
            <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[var(--brand-500)] flex items-center justify-center border-2 border-[var(--surface-card)]">
              <Camera className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Alex Johnson</h2>
            <p className="text-sm text-[var(--text-secondary)]">alex.johnson@example.com</p>
            <p className="text-sm text-[var(--text-secondary)]">🇺🇸 United States</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-[var(--text-muted)]">Joined <span className="text-[var(--text-primary)] font-medium">Jan 2025</span></span>
              <span className="text-[var(--text-muted)]">Earned <span className="text-[var(--text-primary)] font-medium">{formatCurrency(214.60)}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] text-sm font-medium"
            >
              {skill}
              <button className="text-[var(--brand-400)] hover:text-[var(--brand-700)] transition-colors" aria-label={`Remove ${skill}`}>×</button>
            </span>
          ))}
          <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-[var(--border-default)] text-sm text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)] transition-colors">
            + Add skill
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)]">Skills help match you with relevant project opportunities.</p>
      </div>

      {/* Reputation — placeholder */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)]">Reputation</h3>
          <span className="text-xs text-[var(--text-muted)] bg-[var(--surface-subtle)] px-2 py-1 rounded-full">Coming in V2</span>
        </div>
        <div className="grid grid-cols-3 gap-4 opacity-50">
          {[
            { label: "Tier", value: "—" },
            { label: "Approval Rate", value: "—" },
            { label: "Tasks Done", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
