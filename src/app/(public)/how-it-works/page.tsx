import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
};

const STEPS = [
  {
    number: "01",
    title: "Create Your Account",
    body: "Sign up with your email and password. Select your country and agree to the Terms of Service. No identity verification required to get started — some higher-paying tasks may ask for it later.",
  },
  {
    number: "02",
    title: "Browse Opportunities",
    body: "Explore available tasks across surveys, micro-tasks, data labeling, content work, and offerwall tasks. Each opportunity shows the payout, estimated time, and skill level required upfront.",
  },
  {
    number: "03",
    title: "Complete the Work",
    body: "Click 'Start Task' to begin. Follow the instructions carefully. Some tasks are time-limited. Submit your work when finished — it enters our review queue immediately.",
  },
  {
    number: "04",
    title: "Get Reviewed",
    body: "Our team reviews submissions for quality. Approved work credits your wallet. Rejected work comes with feedback so you understand what to improve. Some task types allow resubmission.",
  },
  {
    number: "05",
    title: "Withdraw Your Earnings",
    body: "Once your available balance reaches the minimum threshold ($5.00), you can request a withdrawal. We support PayPal and cryptocurrency. Payouts are processed manually by our team, typically within 1–3 business days.",
  },
];

const OPPORTUNITY_TYPES = [
  { label: "Survey", payout: "$0.20 – $5.00", time: "5–20 min", level: "Any" },
  { label: "Micro-task", payout: "$0.05 – $1.00", time: "1–10 min", level: "Any" },
  { label: "Data Labeling", payout: "$0.50 – $10.00", time: "5–30 min", level: "Any" },
  { label: "Content Task", payout: "$1.00 – $25.00", time: "15–60 min", level: "Intermediate" },
  { label: "Offerwall Task", payout: "Varies", time: "Varies", level: "Any" },
  { label: "Project Task", payout: "Negotiated", time: "Multi-day", level: "Intermediate–Advanced" },
];

const FAQS = [
  {
    q: "Is there a fee to join NexGuild?",
    a: "No. Signing up is completely free. NexGuild earns revenue through service fees charged to organizations and a share of offerwall earnings — contributors keep what they earn.",
  },
  {
    q: "How long does it take to get approved?",
    a: "Approval times vary by task type. High-volume micro-tasks may be reviewed in batches within 24 hours. Content tasks and surveys may take 1–3 business days.",
  },
  {
    q: "What happens if my submission is rejected?",
    a: "You will receive a notification with admin feedback explaining the reason. Depending on the task, you may be able to revise and resubmit.",
  },
  {
    q: "How quickly can I withdraw my earnings?",
    a: "Withdrawals are processed within 1–3 business days after request. New accounts may have a short hold period before their first withdrawal.",
  },
  {
    q: "Can I work from any country?",
    a: "Most opportunities are open globally. Some tasks may restrict participation by country due to the organization's requirements.",
  },
  {
    q: "Is there a minimum payout amount?",
    a: "Yes. The minimum withdrawal amount is $5.00. This threshold is configurable and may change over time.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Page Hero */}
      <div className="bg-[var(--surface-subtle)] px-6 py-14">
        <div className="mx-auto max-w-container">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">How It Works</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl">
            Everything you need to know about earning on NexGuild — from signup to withdrawal.
          </p>
        </div>
      </div>

      {/* Step Flow */}
      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-prose">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-10">Your Contributor Journey</h2>
          <div className="space-y-10">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--brand-50)] flex items-center justify-center">
                  <span className="text-sm font-bold text-[var(--brand-500)]">{step.number}</span>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunity Types */}
      <section className="bg-[var(--surface-subtle)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Opportunity Types</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OPPORTUNITY_TYPES.map((type) => (
              <div
                key={type.label}
                className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-5"
              >
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">{type.label}</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Payout</span>
                    <span className="font-medium text-success-700 dark:text-[#4ADE80]">{type.payout}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Est. Time</span>
                    <span className="text-[var(--text-secondary)]">{type.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Skill Level</span>
                    <span className="text-[var(--text-secondary)]">{type.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet & Withdrawal */}
      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Wallet & Withdrawal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Your Wallet Balances</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Your wallet has two balance types:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-warning-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">Pending Balance — </span>
                    <span className="text-[var(--text-secondary)]">Earnings from submitted work awaiting confirmation. Not yet withdrawable.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-success-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">Available Balance — </span>
                    <span className="text-[var(--text-secondary)]">Confirmed earnings ready to withdraw.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Withdrawal Methods</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-[var(--brand-500)] mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">PayPal — </span>
                    <span className="text-[var(--text-secondary)]">Enter your verified PayPal email. Processed within 1–3 business days.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-[var(--brand-500)] mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">Cryptocurrency — </span>
                    <span className="text-[var(--text-secondary)]">Bitcoin or USDT (TRC20). Provide your wallet address in Settings before requesting.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--surface-subtle)] py-16 px-6">
        <div className="mx-auto max-w-prose">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)]">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4">
                  <span className="font-medium text-[var(--text-primary)]">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--brand-50)] py-14 px-6 text-center">
        <div className="mx-auto max-w-container">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Ready to get started?</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">Join for free. Start earning today.</p>
          <Button asChild size="lg">
            <Link href="/signup">Create Your Account <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
