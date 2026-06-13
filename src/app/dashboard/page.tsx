import { StatCard } from "@/components/ui/stat-card";
import { OpportunityCard } from "@/components/ui/opportunity-card";
import { ArrowRight, Bell, ClipboardList, Layers, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const QUICK_ACTIONS = [
  { icon: ClipboardList, label: "Browse Tasks",  href: "/dashboard/tasks",      desc: "Find and start new tasks" },
  { icon: Layers,        label: "Offerwalls",     href: "/dashboard/offerwalls", desc: "Earn via partner offers" },
  { icon: Wallet,        label: "Withdraw",       href: "/dashboard/wallet",     desc: "Check your balance" },
];

const FEATURED_OPPS = [
  {
    title: "Audio Recording — Short Prompts",
    type: "data_labeling" as const,
    description: "Record 20 short audio prompts for an AI voice training dataset. Clear pronunciation required.",
    payout: "View Pay",
    estimatedMinutes: 15,
    skillLevel: "any" as const,
    href: "/dashboard/tasks",
  },
  {
    title: "App UX Feedback Survey",
    type: "survey" as const,
    description: "Install and test a mobile productivity app, then complete a structured feedback survey.",
    payout: "View Pay",
    estimatedMinutes: 20,
    skillLevel: "any" as const,
    href: "/dashboard/tasks",
  },
  {
    title: "Image Labeling Batch",
    type: "data_labeling" as const,
    description: "Draw bounding boxes around specified objects in a set of images for a computer vision model.",
    payout: "View Pay",
    estimatedMinutes: 10,
    skillLevel: "any" as const,
    href: "/dashboard/tasks",
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">

      {/* Announcement Banner */}
      <div className="rounded-xl border border-[var(--brand-200)] bg-[var(--brand-50)] p-4 flex items-start gap-3">
        <Bell className="h-4 w-4 text-[var(--brand-500)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--brand-500)]">Welcome to NexGuild!</p>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            We are growing our contributor community. New task types and higher-paying projects are being added every week.
          </p>
        </div>
      </div>

      {/* Welcome + Stats */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Welcome back</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-5">Here is your dashboard overview.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Earned"    value="—" />
          <StatCard label="Pending Balance" value="—" />
          <StatCard label="Tasks Done"      value="—" />
          <StatCard label="Approval Rate"   value="—" />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5 card-hover group"
              >
                <div className="h-10 w-10 rounded-lg bg-[var(--brand-100)] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-[var(--brand-500)]" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm">{action.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--text-muted)] ml-auto flex-shrink-0 group-hover:text-[var(--brand-500)] transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Wallet Snapshot */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Wallet</h2>
          <Wallet className="h-4 w-4 text-[var(--text-muted)]" />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Available</p>
            <p className="text-3xl font-bold text-white">—</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Pending</p>
            <p className="text-lg font-semibold text-[var(--warning-text)]">—</p>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto" variant="secondary">
          <Link href="/dashboard/wallet">Go to Wallet</Link>
        </Button>
      </div>

      {/* Available Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Available Now</h2>
          <Link href="/dashboard/tasks" className="text-sm text-[var(--text-link)] hover:underline flex items-center gap-1">
            Browse all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_OPPS.map((opp) => (
            <OpportunityCard key={opp.title} {...opp} />
          ))}
        </div>
      </div>

    </div>
  );
}
