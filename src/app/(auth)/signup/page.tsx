import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const metadata: Metadata = { title: "Create Account" };

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "India",
  "Germany", "France", "Brazil", "Nigeria", "Philippines",
  "Bangladesh", "Pakistan", "Indonesia", "Mexico", "South Africa",
  "Other",
];

export default function SignupPage() {
  return (
    <div className="w-full max-w-form">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-[var(--brand-500)] flex items-center justify-center">
            <span className="text-white font-bold text-base">N</span>
          </div>
          <span className="font-bold text-xl text-[var(--text-primary)] tracking-tight">NexGuild</span>
        </Link>
      </div>

      <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-default)] p-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Create your account</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Free to join. Start earning immediately.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Full Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your full name"
              className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Email <span className="text-danger-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Password <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                className="w-full h-10 px-3 pr-10 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Confirm Password <span className="text-danger-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="Repeat your password"
              className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Country <span className="text-danger-500">*</span>
            </label>
            <select
              required
              className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-0.5 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--brand-500)] accent-[var(--brand-500)]"
            />
            <label htmlFor="terms" className="text-sm text-[var(--text-secondary)]">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-[var(--text-link)] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" className="text-[var(--text-link)] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--text-link)] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
