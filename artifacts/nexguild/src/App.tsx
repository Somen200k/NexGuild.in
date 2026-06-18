import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { ClientHeader } from "@/components/layout/client-header";
import { GoldFooter } from "@/components/layout/gold-footer";
import { ContributorHeader } from "@/components/layout/contributor-header";
import { TealFooter } from "@/components/layout/teal-footer";
import { NexGuildLogo } from "@/components/ui/nexguild-logo";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { SupportButton } from "@/components/layout/support-button";
import { AdminShell } from "@/components/layout/admin-shell";
import { AdminAuthGuard } from "@/components/layout/admin-auth-guard";

import LandingPage from "@/app/page";

import ClientPage from "@/app/(gold)/client/page";
import ClientHowItWorksPage from "@/app/(gold)/client/how-it-works/page";
import AboutPage from "@/app/(gold)/about/page";
import ContactPage from "@/app/(gold)/contact/page";
import ForOrganizationsPage from "@/app/(gold)/for-organizations/page";
import ServicesPage from "@/app/(gold)/services/page";

import EarnPage from "@/app/(teal)/earn/page";
import EarnAboutPage from "@/app/(teal)/earn/about/page";
import EarnContactPage from "@/app/(teal)/earn/contact/page";
import HowItWorksPage from "@/app/(teal)/how-it-works/page";
import FaqPage from "@/app/(teal)/faq/page";
import OpportunitiesPage from "@/app/(teal)/opportunities/page";

import LoginPage from "@/app/(auth)/login/page";
import SignupPage from "@/app/(auth)/signup/page";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";
import AuthCallbackPage from "@/app/auth/callback/page";

import TermsPage from "@/app/(public)/terms/page";
import PrivacyPage from "@/app/(public)/privacy/page";
import CookiesPage from "@/app/(public)/cookies/page";

import DashboardHomePage from "@/app/dashboard/page";
import DashboardAnnouncementsPage from "@/app/dashboard/announcements/page";
import DashboardCommunityPage from "@/app/dashboard/community/page";
import DashboardEarningsPage from "@/app/dashboard/earnings/page";
import DashboardOfferwallsPage from "@/app/dashboard/offerwalls/page";
import DashboardOpportunitiesPage from "@/app/dashboard/opportunities/page";
import DashboardProfilePage from "@/app/dashboard/profile/page";
import DashboardSettingsPage from "@/app/dashboard/settings/page";
import DashboardStorePage from "@/app/dashboard/store/page";
import DashboardSupportPage from "@/app/dashboard/support/page";
import DashboardTasksPage from "@/app/dashboard/tasks/page";
import DashboardTaskDetailPage from "@/app/dashboard/tasks/[id]/page";
import DashboardTaskSubmitPage from "@/app/dashboard/tasks/[id]/submit/page";
import DashboardTaskWorkPage from "@/app/dashboard/tasks/[id]/work/page";
import DashboardVouchersPage from "@/app/dashboard/vouchers/page";
import DashboardWalletPage from "@/app/dashboard/wallet/page";

import AdminLoginPage from "@/app/admin/login/page";
import AdminDashboardPage from "@/app/admin/page";
import AdminAnnouncementsPage from "@/app/admin/announcements/page";
import AdminAssignmentsPage from "@/app/admin/assignments/page";
import AdminContributorsPage from "@/app/admin/contributors/page";
import AdminContributorDetailPage from "@/app/admin/contributors/[id]/page";
import AdminFinancesPage from "@/app/admin/finances/page";
import AdminOfferwallsPage from "@/app/admin/offerwalls/page";
import AdminProjectsPage from "@/app/admin/projects/page";
import AdminProjectsNewPage from "@/app/admin/projects/new/page";
import AdminSettingsPage from "@/app/admin/settings/page";
import AdminSubmissionsPage from "@/app/admin/submissions/page";
import AdminSupportPage from "@/app/admin/support/page";
import AdminTasksPage from "@/app/admin/tasks/page";
import AdminTasksNewPage from "@/app/admin/tasks/new/page";
import AdminTaskDetailPage from "@/app/admin/tasks/[id]/page";
import AdminTaskEditPage from "@/app/admin/tasks/[id]/edit/page";
import AdminVoucherCatalogPage from "@/app/admin/voucher-catalog/page";
import AdminVouchersPage from "@/app/admin/vouchers/page";
import AdminWithdrawalsPage from "@/app/admin/withdrawals/page";

import MaintenancePage from "@/app/maintenance/page";
import MaintenanceSectionPage from "@/app/maintenance/[section]/page";

const queryClient = new QueryClient();

function GoldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-gold min-h-screen bg-[var(--surface-page)]">
      <ClientHeader />
      <main className="pt-16">{children}</main>
      <GoldFooter />
    </div>
  );
}

function TealLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-teal min-h-screen bg-[var(--surface-page)]">
      <ContributorHeader />
      <main className="pt-16">{children}</main>
      <TealFooter />
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-teal min-h-screen bg-[var(--surface-page)] flex flex-col">
      <div className="absolute top-4 left-4">
        <NexGuildLogo theme="teal" />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        {children}
      </div>
      <p className="text-center text-xs text-[var(--text-muted)] pb-6">
        © {new Date().getFullYear()} NexGuild
      </p>
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-gold flex min-h-screen flex-col bg-[var(--surface-page)]">
      <PublicHeader />
      <main className="flex-1 pt-16">{children}</main>
      <PublicFooter />
    </div>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="theme-teal min-h-screen bg-[var(--surface-page)]">
        <DashboardShell>{children}</DashboardShell>
        <SupportButton />
      </div>
    </AuthGuard>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="theme-gold min-h-screen bg-[var(--surface-page)]">
        <AdminShell>{children}</AdminShell>
      </div>
    </AdminAuthGuard>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <LandingPage />}</Route>

      <Route path="/client">{() => <GoldLayout><ClientPage /></GoldLayout>}</Route>
      <Route path="/client/how-it-works">{() => <GoldLayout><ClientHowItWorksPage /></GoldLayout>}</Route>
      <Route path="/about">{() => <GoldLayout><AboutPage /></GoldLayout>}</Route>
      <Route path="/contact">{() => <GoldLayout><ContactPage /></GoldLayout>}</Route>
      <Route path="/for-organizations">{() => <GoldLayout><ForOrganizationsPage /></GoldLayout>}</Route>
      <Route path="/services">{() => <GoldLayout><ServicesPage /></GoldLayout>}</Route>

      <Route path="/earn">{() => <TealLayout><EarnPage /></TealLayout>}</Route>
      <Route path="/earn/about">{() => <TealLayout><EarnAboutPage /></TealLayout>}</Route>
      <Route path="/earn/contact">{() => <TealLayout><EarnContactPage /></TealLayout>}</Route>
      <Route path="/how-it-works">{() => <TealLayout><HowItWorksPage /></TealLayout>}</Route>
      <Route path="/faq">{() => <TealLayout><FaqPage /></TealLayout>}</Route>
      <Route path="/opportunities">{() => <TealLayout><OpportunitiesPage /></TealLayout>}</Route>

      <Route path="/login">{() => <AuthLayout><LoginPage /></AuthLayout>}</Route>
      <Route path="/signup">{() => <AuthLayout><SignupPage /></AuthLayout>}</Route>
      <Route path="/forgot-password">{() => <AuthLayout><ForgotPasswordPage /></AuthLayout>}</Route>
      <Route path="/auth/callback">{() => <AuthCallbackPage />}</Route>

      <Route path="/terms">{() => <PublicLayout><TermsPage /></PublicLayout>}</Route>
      <Route path="/privacy">{() => <PublicLayout><PrivacyPage /></PublicLayout>}</Route>
      <Route path="/cookies">{() => <PublicLayout><CookiesPage /></PublicLayout>}</Route>

      <Route path="/dashboard">{() => <DashboardLayout><DashboardHomePage /></DashboardLayout>}</Route>
      <Route path="/dashboard/announcements">{() => <DashboardLayout><DashboardAnnouncementsPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/community">{() => <DashboardLayout><DashboardCommunityPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/earnings">{() => <DashboardLayout><DashboardEarningsPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/offerwalls">{() => <DashboardLayout><DashboardOfferwallsPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/opportunities">{() => <DashboardLayout><DashboardOpportunitiesPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/profile">{() => <DashboardLayout><DashboardProfilePage /></DashboardLayout>}</Route>
      <Route path="/dashboard/settings">{() => <DashboardLayout><DashboardSettingsPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/store">{() => <DashboardLayout><DashboardStorePage /></DashboardLayout>}</Route>
      <Route path="/dashboard/support">{() => <DashboardLayout><DashboardSupportPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/tasks/:id/submit">{() => <DashboardLayout><DashboardTaskSubmitPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/tasks/:id/work">{() => <DashboardLayout><DashboardTaskWorkPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/tasks/:id">{() => <DashboardLayout><DashboardTaskDetailPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/tasks">{() => <DashboardLayout><DashboardTasksPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/vouchers">{() => <DashboardLayout><DashboardVouchersPage /></DashboardLayout>}</Route>
      <Route path="/dashboard/wallet">{() => <DashboardLayout><DashboardWalletPage /></DashboardLayout>}</Route>

      <Route path="/admin/login">{() => <AdminLoginPage />}</Route>
      <Route path="/admin/contributors/:id">{() => <AdminLayout><AdminContributorDetailPage /></AdminLayout>}</Route>
      <Route path="/admin/contributors">{() => <AdminLayout><AdminContributorsPage /></AdminLayout>}</Route>
      <Route path="/admin/projects/new">{() => <AdminLayout><AdminProjectsNewPage /></AdminLayout>}</Route>
      <Route path="/admin/projects">{() => <AdminLayout><AdminProjectsPage /></AdminLayout>}</Route>
      <Route path="/admin/tasks/new">{() => <AdminLayout><AdminTasksNewPage /></AdminLayout>}</Route>
      <Route path="/admin/tasks/:id/edit">{() => <AdminLayout><AdminTaskEditPage /></AdminLayout>}</Route>
      <Route path="/admin/tasks/:id">{() => <AdminLayout><AdminTaskDetailPage /></AdminLayout>}</Route>
      <Route path="/admin/tasks">{() => <AdminLayout><AdminTasksPage /></AdminLayout>}</Route>
      <Route path="/admin/announcements">{() => <AdminLayout><AdminAnnouncementsPage /></AdminLayout>}</Route>
      <Route path="/admin/assignments">{() => <AdminLayout><AdminAssignmentsPage /></AdminLayout>}</Route>
      <Route path="/admin/finances">{() => <AdminLayout><AdminFinancesPage /></AdminLayout>}</Route>
      <Route path="/admin/offerwalls">{() => <AdminLayout><AdminOfferwallsPage /></AdminLayout>}</Route>
      <Route path="/admin/settings">{() => <AdminLayout><AdminSettingsPage /></AdminLayout>}</Route>
      <Route path="/admin/submissions">{() => <AdminLayout><AdminSubmissionsPage /></AdminLayout>}</Route>
      <Route path="/admin/support">{() => <AdminLayout><AdminSupportPage /></AdminLayout>}</Route>
      <Route path="/admin/voucher-catalog">{() => <AdminLayout><AdminVoucherCatalogPage /></AdminLayout>}</Route>
      <Route path="/admin/vouchers">{() => <AdminLayout><AdminVouchersPage /></AdminLayout>}</Route>
      <Route path="/admin/withdrawals">{() => <AdminLayout><AdminWithdrawalsPage /></AdminLayout>}</Route>
      <Route path="/admin">{() => <AdminLayout><AdminDashboardPage /></AdminLayout>}</Route>

      <Route path="/maintenance/:section">{() => <MaintenanceSectionPage />}</Route>
      <Route path="/maintenance">{() => <MaintenancePage />}</Route>

      <Route>{() => <NotFound />}</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
