import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { BadgeVariant } from "@/components/ui/badge";

const ASSIGNMENTS = [
  { contributor: "Contributor #001", task: "Audio Recording — Short Prompts",  type: "File Upload", submitted: "Jun 12, 2025", status: "pending" },
  { contributor: "Contributor #002", task: "Image Bounding Box Annotation",    type: "Quiz",        submitted: "Jun 12, 2025", status: "pending" },
  { contributor: "Contributor #003", task: "App UX Feedback Survey",           type: "Quiz",        submitted: "Jun 11, 2025", status: "pending" },
  { contributor: "Contributor #004", task: "Audio Recording — Short Prompts",  type: "File Upload", submitted: "Jun 11, 2025", status: "approved" },
  { contributor: "Contributor #005", task: "Product Description Writing",      type: "File Upload", submitted: "Jun 10, 2025", status: "rejected" },
];

const statusVariants: Record<string, BadgeVariant> = {
  pending:  "warning",
  approved: "success",
  rejected: "danger",
};

const TABS = ["Pending", "Approved", "Rejected"];

export default function AdminAssignmentsPage() {
  const pendingCount = ASSIGNMENTS.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Assignments</h1>
        <p className="text-sm text-[var(--text-secondary)]">Review contributor assignments before granting task access.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border-default)]">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
              i === 0
                ? "border-[var(--brand-500)] text-[var(--brand-600)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab}
            {i === 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] text-xs font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              {["Contributor","Task","Type","Submitted","Status","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {ASSIGNMENTS.map((a, i) => (
              <tr key={i} className="hover:bg-[var(--surface-subtle)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{a.contributor}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[200px] truncate">{a.task}</td>
                <td className="px-4 py-3"><Badge variant="neutral">{a.type}</Badge></td>
                <td className="px-4 py-3 text-[var(--text-muted)] whitespace-nowrap">{a.submitted}</td>
                <td className="px-4 py-3"><Badge variant={statusVariants[a.status]}>{a.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="ghost">View</Button>
                    {a.status === "pending" && (
                      <>
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-md text-[var(--success-text)] hover:bg-[var(--badge-success-bg)] transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-md text-[var(--danger-text)] hover:bg-[var(--badge-danger-bg)] transition-colors"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
