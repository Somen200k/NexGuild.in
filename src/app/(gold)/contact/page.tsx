import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/fade-in";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact NexGuild — Project Enquiries",
  description:
    "Get in touch to discuss your data project requirements. We work with organisations on audio, transcription, annotation, and human-powered digital tasks.",
  openGraph: {
    title: "Contact NexGuild",
    description: "Discuss your project requirements with us.",
    url: "https://nexguild.in/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface-page)] py-20 px-6">
        <div className="pointer-events-none absolute inset-0 hero-glow" />
        <div className="mx-auto max-w-container relative z-10">
          <FadeIn>
            <p className="text-[var(--brand-500)] text-sm font-semibold uppercase tracking-widest mb-3">Contact</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance">
              Let&apos;s Talk About Your Project
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Tell us what you need. We review every enquiry and respond within 2 business days with a clear scope and timeline.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-4">

            {/* WhatsApp */}
            <FadeIn>
              <a
                href="https://wa.me/919382008513"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] p-6 card-hover group transition-colors hover:border-[#25D366]/40"
              >
                <div className="h-12 w-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                  <MessageCircle className="h-6 w-6 text-[#25D366]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-0.5">WhatsApp</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Fastest response. Reach us directly for project discussions.</p>
                  <p className="text-sm text-[#25D366] mt-1">Message on WhatsApp →</p>
                </div>
              </a>
            </FadeIn>

            {/* Email */}
            <FadeIn delay={60}>
              <a
                href="mailto:nexguild.in@gmail.com"
                className="flex items-center gap-5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] p-6 card-hover group transition-colors hover:border-[var(--brand-500)]/40"
              >
                <div className="h-12 w-12 rounded-xl bg-[var(--brand-100)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--brand-100)] transition-colors">
                  <Mail className="h-6 w-6 text-[var(--brand-500)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-0.5">Email</h3>
                  <p className="text-sm text-[var(--text-secondary)]">For project briefs and partnership enquiries.</p>
                  <p className="text-sm text-[var(--brand-500)] mt-1">nexguild.in@gmail.com →</p>
                </div>
              </a>
            </FadeIn>

            {/* LinkedIn */}
            <FadeIn delay={120}>
              <a
                href="https://www.linkedin.com/in/somen-biswas-410727215"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] p-6 card-hover group transition-colors hover:border-[#0A66C2]/40"
              >
                <div className="h-12 w-12 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A66C2]/20 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-0.5">LinkedIn</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Connect professionally or send a message via LinkedIn.</p>
                  <p className="text-sm text-[#0A66C2] mt-1">linkedin.com/in/somen-biswas →</p>
                </div>
              </a>
            </FadeIn>

          </div>
        </div>
      </section>
    </>
  );
}
