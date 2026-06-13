import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

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
            <Avatar name="?" size="lg" />
            <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[var(--brand-500)] flex items-center justify-center border-2 border-[var(--surface-card)]">
              <Camera className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">—</h2>
            <p className="text-sm text-[var(--text-secondary)]">—</p>
            <div className="mt-3">
              <Button size="sm" variant="secondary">Edit Profile</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-[var(--border-default)] text-sm text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)] transition-colors">
            + Add skill
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)]">Skills help match you with relevant project opportunities.</p>
      </div>

      {/* Reputation */}
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
