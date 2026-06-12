import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, FileText, Users, BarChart3 } from "lucide-react";

export const metadata: Metadata = { title: "For Organizations" };

const WORK_TYPES = [
  { icon: "📊", label: "Research & Surveys", desc: "Targeted participant recruitment and response collection at scale." },
  { icon: "🏷️", label: "Data Annotation", desc: "Image, audio, and text labeling for AI/ML training datasets." },
  { icon: "✍️", label: "Content Production", desc: "Articles, descriptions, translations, and summaries from skilled contributors." },
  { icon: "🔍", label: "QA & User Testing", desc: "Real user testing across devices, browsers, and demographics." },
  { icon: "📁", label: "Data Collection", desc: "Structured datasets collected by a distributed contributor network." },
  { icon: "🔢", label: "Data Entry & Processing", desc: "High-volume structured data work delivered with quality guarantees." },
];

const PROCESS_STEPS = [
  { num: "1", label: "Contact Us", desc: "Reach out via our contact form. Tell us what you need." },
  { num: "2", label: "Scoping", desc: "We clarify requirements, timeline, quality standards, and volume." },
  { num: "3", label: "Pricing", desc: "We quote a fixed total. You pay NexGuild directly. No per-contributor management." },
  { num: "4", label: "Delivery", desc: "We distribute, review, and deliver structured results on your timeline." },
];

const TRUST_ITEMS = [
  {
    icon: CheckCircle,
    title: "Managed Workflow",
    desc: "NexGuild handles contributor distribution, monitoring, and quality review. You never manage a distributed workforce.",
  },
  {
    icon: FileText,
    title: "Quality Review",
    desc: "Every submission is reviewed against your brief before delivery. Substandard work is rejected and reworked.",
  },
  {
    icon: BarChart3,
    title: "Structured Deliverables",
    desc: "You receive clean, structured output — datasets, content files, or reports — in your preferred format.",
  },
];

export default function ForOrganizationsPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-[var(--surface-subtle)] px-6 py-14">
        <div className="mx-auto max-w-container">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-50)] text-[var(--brand-600)] text-sm font-medium mb-5">
            For Organizations
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4 max-w-2xl text-balance">
            Human-Powered Work at Scale — Fully Managed.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            NexGuild manages the entire workflow. You define the work. We recruit, distribute, review, and deliver.
          </p>
        </div>
      </div>

      {/* What We Do */}
      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">What NexGuild Does for Organizations</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Organizations engage NexGuild as a fully managed partner. There are no organization accounts, no hiring, and no workforce coordination. You contact us, we scope and price the project, and our contributor network delivers the work.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                NexGuild acts as the complete intermediary — handling contributor selection, task distribution, quality review, and final delivery. You get structured results without operational overhead.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] p-8">
              <div className="space-y-4">
                {["You define the work", "We scope and price", "Contributors deliver", "We review quality", "You receive structured results"].map((item, i) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-[var(--brand-500)] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-[var(--text-primary)] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Types */}
      <section className="bg-[var(--surface-subtle)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center">Types of Work We Can Distribute</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WORK_TYPES.map((type) => (
              <div key={type.label} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-5">
                <div className="text-2xl mb-3">{type.icon}</div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{type.label}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Process */}
      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-10 text-center">How Engagement Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="h-12 w-12 rounded-full bg-[var(--brand-50)] flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-[var(--brand-500)]">{step.num}</span>
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{step.label}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-[var(--surface-subtle)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-10 text-center">What You Can Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
                  <div className="h-10 w-10 rounded-lg bg-[var(--brand-50)] flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[var(--brand-500)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[var(--brand-50)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-[var(--brand-500)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Ready to get started?</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Contact us to discuss your project. We typically respond within one business day.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
