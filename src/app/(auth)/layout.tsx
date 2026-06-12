import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface-subtle)] flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
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
