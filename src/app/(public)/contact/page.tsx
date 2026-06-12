import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Mail, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

const SUBJECTS = [
  "Organization Inquiry",
  "General Question",
  "Support",
  "Partnership",
];

export default function ContactPage() {
  return (
    <>
      <div className="bg-[var(--surface-subtle)] px-6 py-14">
        <div className="mx-auto max-w-container">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">Contact Us</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl">
            Whether you are an organization looking to work with us or have a general question, we are happy to help.
          </p>
        </div>
      </div>

      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Send a Message</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                      Full Name <span className="text-danger-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Organization <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your organization name"
                    className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Subject <span className="text-danger-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    Message <span className="text-danger-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-3 py-2.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent transition-colors resize-y"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-[var(--brand-500)]" />
                  <h3 className="font-semibold text-[var(--text-primary)]">Email Us Directly</h3>
                </div>
                <a
                  href="mailto:hello@nexguild.com"
                  className="text-sm text-[var(--text-link)] hover:underline"
                >
                  hello@nexguild.com
                </a>
                <p className="text-xs text-[var(--text-muted)] mt-1">For all inquiries</p>
              </div>

              <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-[var(--brand-500)]" />
                  <h3 className="font-semibold text-[var(--text-primary)]">Response Time</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  We respond to all inquiries within 1 business day. Organization inquiries may take up to 2 business days as we review your requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
