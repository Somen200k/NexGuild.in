import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardMobileNav } from "@/components/layout/dashboard-mobile-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface-page)]">
      {/* Sidebar — desktop only */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Header */}
      <DashboardHeader />

      {/* Content */}
      <main className="pt-16 lg:pl-sidebar pb-20 lg:pb-8">
        <div className="p-6 max-w-content">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <DashboardMobileNav />
    </div>
  );
}
