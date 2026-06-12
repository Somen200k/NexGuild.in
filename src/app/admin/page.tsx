import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { Users, DollarSign, Briefcase, ClipboardCheck, ArrowDownCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BadgeVariant } from "@/components/ui/badge";

const STATS = [
  { label: "Total Contributors", value: "2,847",            icon: <Users className="h-5 w-5" /> },
  { label: "Total Paid Out",     value: formatCurrency(18340.50), icon: <DollarSign className="h-5 w-5" /> },
  { label: "Active Opps",        value: "23",               icon: <Briefcase className="h-5 w-5" /> },
  { label: "Pending Reviews",    value: "12",               icon: <ClipboardCheck className="h-5 w-5" /> },
  { label: "Pending Withdrawals",value: "5",                icon: <ArrowDownCircle className="h-5 w-5" /> },
];

const FLAGGED = [
  { subject: "alex.j@example.com", reason: "Duplicate submissions detected", time: new Date(Date.now() - 1000*60*30) },
  { subject: "Survey #47 submission", reason: "Suspected bot activity", time: new Date(Date.now() - 1000*60*90) },
  { subject: "maria.s@example.com", reason: "Multiple failed identity checks", time: new Date(Date.now() - 1000*60*60*4) },
];

const ACTIVITY = [
  { label: "New submission received", subject: "Consumer Habits Survey", time: new Date(Date.now() - 1000*60*5),  type: "submission" as const },
  { label: "Withdrawal completed",    subject: "$25.00 · PayPal",         time: new Date(Date.now() - 1000*60*20), type: "withdrawal" as const },
  { label: "Opportunity published",   subject: "Audio Transcription Batch",time: new Date(Date.now() - 1000*60*45), type: "opportunity" as const },
  { label: "Contributor suspended",   subject: "spam.user@example.com",   time: new Date(Date.now() - 1000*60*60*2), type: "moderation" as const },
  { label: "New withdrawal request",  subject: "$40.00 · Bitcoin",        time: new Date(Date.now() - 1000*60*60*3), type: "withdrawal" as const },
];

const activityVariants: Record<string, BadgeVariant> = {
  submission:  "brand",
  withdrawal:  "info",
  opportunity: "success",
  moderation:  "danger",
};

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagged Items */}
        <div className="rounded-lg border border-warning-500/30 bg-[var(--surface-card)]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--border-default)]">
            <AlertTriangle className="h-4 w-4 text-warning-700" />
            <h2 className="font-semibold text-[var(--text-primary)]">Flagged Items</h2>
            <span className="ml-auto text-xs text-[var(--text-muted)]">{FLAGGED.length} items</span>
          </div>
          <ul className="divide-y divide-[var(--border-default)]">
            {FLAGGED.map((item, i) => (
              <li key={i} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.subject}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.reason}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-[var(--text-muted)]">{timeAgo(item.time)}</span>
                    <Button size="sm" variant="secondary">Review</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)]">
          <div className="px-5 py-4 border-b border-[var(--border-default)]">
            <h2 className="font-semibold text-[var(--text-primary)]">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-[var(--border-default)]">
            {ACTIVITY.map((item, i) => (
              <li key={i} className="px-5 py-3 flex items-center gap-3">
                <Badge variant={activityVariants[item.type]}>{item.type}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)]">{item.label}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{item.subject}</p>
                </div>
                <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{timeAgo(item.time)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
