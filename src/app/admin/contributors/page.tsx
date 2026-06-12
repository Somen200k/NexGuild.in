import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Search } from "lucide-react";
import type { BadgeVariant } from "@/components/ui/badge";

const CONTRIBUTORS = [
  { name: "Alex Johnson",   email: "alex.j@example.com",  country: "US", joined: "Jan 12, 2025", earned: 214.60, status: "active" },
  { name: "Maria Santos",   email: "maria.s@example.com", country: "BR", joined: "Feb 3, 2025",  earned: 98.40,  status: "active" },
  { name: "James Okafor",   email: "j.okafor@example.com",country: "NG", joined: "Mar 18, 2025", earned: 56.20,  status: "suspended" },
  { name: "Priya Sharma",   email: "priya.s@example.com", country: "IN", joined: "Apr 2, 2025",  earned: 342.10, status: "active" },
  { name: "Liu Wei",        email: "liu.w@example.com",   country: "CN", joined: "Apr 29, 2025", earned: 12.80,  status: "active" },
  { name: "Tom Mueller",    email: "t.mueller@example.com",country: "DE", joined: "May 5, 2025",  earned: 187.90, status: "banned" },
];

const statusVariants: Record<string, BadgeVariant> = {
  active:    "success",
  suspended: "warning",
  banned:    "danger",
};

export default function ContributorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Contributors</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage all registered contributor accounts.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] flex-1 min-w-[200px] max-w-xs">
          <Search className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
          <input type="text" placeholder="Search by name or email..." className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
        </div>
        {["Status", "Country"].map((f) => (
          <select key={f} className="h-9 px-3 pr-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]">
            <option>{f}</option>
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              {["Contributor","Email","Country","Joined","Total Earned","Status",""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {CONTRIBUTORS.map((c) => (
              <tr key={c.email} className="hover:bg-[var(--surface-subtle)] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size="sm" />
                    <span className="font-medium text-[var(--text-primary)]">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{c.email}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{c.country}</td>
                <td className="px-4 py-3 text-[var(--text-muted)] whitespace-nowrap">{c.joined}</td>
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{formatCurrency(c.earned)}</td>
                <td className="px-4 py-3"><Badge variant={statusVariants[c.status]}>{c.status}</Badge></td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost">View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
