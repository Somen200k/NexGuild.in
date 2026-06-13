import { StatCard } from "@/components/ui/stat-card";
import { AlertTriangle, ArrowDownCircle, Briefcase, ClipboardCheck, Users } from "lucide-react";

const STATS = [
  { label: "Total Contributors", value: "—", icon: <Users className="h-5 w-5" /> },
  { label: "Total Paid Out",     value: "—", icon: <ArrowDownCircle className="h-5 w-5" /> },
  { label: "Active Opps",        value: "—", icon: <Briefcase className="h-5 w-5" /> },
  { label: "Pending Reviews",    value: "—", icon: <ClipboardCheck className="h-5 w-5" /> },
  { label: "Pending Withdrawals",value: "—", icon: <ArrowDownCircle className="h-5 w-5" /> },
];

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
            <span className="ml-auto text-xs text-[var(--text-muted)]">0 items</span>
          </div>
          <div className="py-10 text-center">
            <p className="text-sm text-[var(--text-muted)]">No flagged items</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)]">
          <div className="px-5 py-4 border-b border-[var(--border-default)]">
            <h2 className="font-semibold text-[var(--text-primary)]">Recent Activity</h2>
          </div>
          <div className="py-10 text-center">
            <p className="text-sm text-[var(--text-muted)]">No activity yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
