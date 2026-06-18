import type { Metadata } from "next";
import { Link } from "@/lib/navigation";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "About NexGuild — Managed Data Services for Organisations",
  description:
    "NexGuild partners with organisations to deliver high-quality human data at scale. Audio, transcription, annotation, and more — fully managed, zero overhead for your team.",
  openGraph: {
    title: "About NexGuild",
    description: "Managed data services for organisations. We handle everything — you get results.",
    url: "https://nexguild.in/about",
  },
};

const PILLARS = [
  {
    title: "Fully Managed Delivery",
    desc: "You brief us once. We handle recruitment, task distribution, quality review, and delivery. Your team never manages contributors directly.",
  },
  {
    title: "Built-in Quality Control",
    desc: "Every submission goes through structured review before delivery. We reject low-quality work so your datasets stay clean.",
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden fees, no surprise invoices. You know the cost before we start. We scope the project and stick to it.",
  },
  {
    title: "No Inflated Claims",
    desc: "No fake testimonials, no invented statistics. Our reputation is built on real client results, delivered without shortcuts.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface-page)] py-20 px-6">
        <div className="pointer-events-none absolute inset-0 hero-glow" />
        <div className="mx-auto max-w-container relative z-10">
          <FadeIn>
            <p className="text-[var(--brand-500)] text-sm font-semibold uppercase tracking-widest mb-3">About</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance max-w-2xl">
              We Do the Heavy Lifting.<br />You Get the Data.
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              NexGuild is a managed contributor platform. Organisations brief us with data requirements, and we handle everything else — end to end.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-prose">
          <FadeIn>
            <h2 className="text-2xl font-bold text-white mb-6">What We Do</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              We run a structured contributor network that completes audio recording, transcription, data annotation, image collection, and other human-powered tasks on behalf of organisations.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Unlike freelance platforms, you don't post jobs or manage people. You describe what you need, we scope the project, assemble the right contributors, run quality control, and deliver clean output.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We are India-based, working with AI companies, research teams, and digital agencies that need reliable human data without the overhead of managing a distributed workforce themselves.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-[var(--surface-page)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <FadeIn>
            <h2 className="text-2xl font-bold text-white mb-10">How We Work</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 h-full card-hover">
                  <div className="w-8 h-0.5 bg-[var(--brand-500)] mb-4" />
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-prose">
          <FadeIn>
            <h2 className="text-2xl font-bold text-white mb-4">Have a Project in Mind?</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              Tell us what you need. We will review your requirements and get back within 2 business days with a scope and timeline.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-[var(--brand-500)] text-[#0c0800] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Contact Us
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] text-sm font-medium hover:text-white hover:border-white/30 transition-colors"
              >
                View Services
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
