import { AlertCircle } from "lucide-react";
import { Link } from "@/lib/navigation";

export default function NotFound() {
  return (
    <div className="theme-teal min-h-screen w-full flex items-center justify-center bg-[var(--surface-page)] px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-8 text-center">
        <AlertCircle className="h-12 w-12 text-[var(--danger-text)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">404 — Page Not Found</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          This page doesn't exist.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-500)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-600)] transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
