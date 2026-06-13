"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="w-full max-w-form">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-8 shadow-lg text-center">
          <div className="h-12 w-12 rounded-full bg-[var(--brand-100)] flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-[var(--brand-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Check your inbox</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>.
            The link expires in 1 hour.
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Didn&apos;t receive it?{" "}
            <button
              onClick={() => setSent(false)}
              className="text-[var(--text-link)] hover:underline font-medium"
            >
              Try again
            </button>
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-4">
            <Link href="/login" className="text-[var(--text-link)] hover:underline">
              ← Back to Log In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-form">
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-1">Reset your password</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-7">
          Enter your account email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-[var(--danger-bg,#2d1515)] border border-[var(--danger-border,#7f1d1d)] px-4 py-3 text-sm text-[var(--danger-text)]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] text-white text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
            {loading ? "Sending…" : "Send Reset Link"}
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
