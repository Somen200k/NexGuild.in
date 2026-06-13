import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-form">
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-1">Reset your password</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-7">
          Enter your account email and we'll send you a reset link.
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-white text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-1">
            Send Reset Link
          </Button>
        </form>

        <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-[var(--text-link)] font-medium hover:underline">
            Back to Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
