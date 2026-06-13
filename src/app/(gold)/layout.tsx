import { ClientHeader } from "@/components/layout/client-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function GoldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-gold min-h-screen bg-[var(--surface-page)]">
      <ClientHeader />
      <main className="pt-16">{children}</main>
      <PublicFooter />
    </div>
  );
}
