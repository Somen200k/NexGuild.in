import { ContributorHeader } from "@/components/layout/contributor-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function TealLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-teal min-h-screen bg-[var(--surface-page)]">
      <ContributorHeader />
      <main className="pt-16">{children}</main>
      <PublicFooter />
    </div>
  );
}
