import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Announcements — Admin" };

const PAST_ANNOUNCEMENTS = [
  { title: "New Task Type Added: Audio Recording", body: "Audio recording tasks are now live. Check the Tasks section to browse available projects.", date: "Jun 10, 2025", audience: "All Contributors" },
  { title: "Withdrawal Processing Update",         body: "Withdrawals are now processed every Tuesday and Friday. Please allow 1–3 business days.", date: "Jun 5, 2025",  audience: "All Contributors" },
  { title: "Welcome to NexGuild Beta",             body: "Thank you for joining our early contributor community. New tasks and features are being added weekly.", date: "May 28, 2025", audience: "All Contributors" },
];

const inputClass = "w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors";
const labelClass = "block text-sm font-medium text-[var(--text-secondary)] mb-1.5";

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Announcements</h1>
        <p className="text-sm text-[var(--text-secondary)]">Send announcements to all contributors or specific groups.</p>
      </div>

      {/* New Announcement Form */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Plus className="h-4 w-4 text-[var(--brand-500)]" />
          <h2 className="font-semibold text-[var(--text-primary)]">New Announcement</h2>
        </div>

        <div>
          <label className={labelClass}>Title <span className="text-[var(--danger-text)]">*</span></label>
          <input type="text" required placeholder="Announcement title..." className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Message <span className="text-[var(--danger-text)]">*</span></label>
          <textarea
            required
            rows={4}
            placeholder="Write your announcement message here..."
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors resize-y"
          />
        </div>

        <div>
          <label className={labelClass}>Send To</label>
          <select className={inputClass}>
            <option value="all">All Contributors</option>
            <option value="active">Active Contributors</option>
            <option value="new">New Contributors (joined last 30 days)</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit" size="lg">
            <Bell className="h-4 w-4" /> Send Announcement
          </Button>
          <Button type="button" variant="secondary" size="lg">Preview</Button>
        </div>
      </section>

      {/* Past Announcements */}
      <section>
        <h2 className="font-semibold text-[var(--text-primary)] mb-4">Past Announcements</h2>
        <div className="space-y-3">
          {PAST_ANNOUNCEMENTS.map((ann) => (
            <div key={ann.title} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-medium text-[var(--text-primary)] text-sm">{ann.title}</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="neutral">{ann.audience}</Badge>
                  <span className="text-xs text-[var(--text-muted)]">{ann.date}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{ann.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
