"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":               "Dashboard",
  "/dashboard/opportunities": "Opportunities",
  "/dashboard/tasks":         "My Tasks",
  "/dashboard/offerwalls":    "Offerwall Hub",
  "/dashboard/earnings":      "Earnings",
  "/dashboard/wallet":        "NexCoins",
  "/dashboard/store":         "Store",
  "/dashboard/profile":       "Profile",
  "/dashboard/settings":      "Settings",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close dropdown on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="h-16 fixed top-0 right-0 left-sidebar z-30 flex items-center justify-between px-6 bg-[var(--surface-card)] border-b border-[var(--border-default)]">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative h-9 w-9 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--brand-500)]" />
          </button>

          {open && (
            <div className="absolute right-0 top-11 w-80 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border-default)] flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text-primary)]">Notifications</span>
                <span className="text-xs text-[var(--text-muted)]">Mark all read</span>
              </div>
              <div className="py-10 flex flex-col items-center gap-2 text-center px-4">
                <Bell className="h-8 w-8 text-[var(--text-muted)]" />
                <p className="text-sm font-medium text-[var(--text-primary)]">No new notifications</p>
                <p className="text-xs text-[var(--text-muted)]">Task approvals and voucher updates will appear here.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <button className="flex items-center gap-2 h-9 px-2 rounded-md hover:bg-[var(--surface-subtle)] transition-colors">
          <Avatar name="?" size="sm" />
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        </button>
      </div>
    </header>
  );
}
