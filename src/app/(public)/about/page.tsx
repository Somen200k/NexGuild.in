import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

const DIFFERENTIATORS = [
  {
    title: "No Fake Social Proof",
    desc: "No inflated testimonials, no invented statistics, no stock-photo team members. Our reputation is built on real results, not manufactured trust.",
  },
  {
    title: "Fully Managed Projects",
    desc: "Organizations never manage contributors directly. NexGuild handles everything — distribution, review, and delivery.",
  },
  {
    title: "Transparent Compensation",
    desc: "Contributors see the payout before they start. No bait-and-switch, no deductions after the fact.",
  },
  {
    title: "Quality Over Volume",
    desc: "Submissions are reviewed before payouts are issued. We reward accuracy and effort, not just quantity.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-[var(--surface-subtle)] px-6 py-14">
        <div className="mx-auto max-w-container">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">About NexGuild</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl">
            Building a platform where contributors and organizations can work together with clarity and trust.
          </p>
        </div>
      </div>

      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-prose">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Our Mission</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            NexGuild exists to give anyone — regardless of background, location, or credentials — a structured way to earn income and build reputation through real work.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            We bridge the gap between organizations that need scalable human-powered tasks and contributors who want reliable, fairly compensated opportunities. NexGuild manages the entire workflow so contributors focus only on doing good work.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Work should be accessible. Compensation should be transparent. Quality contributors deserve a platform that respects their time.
          </p>
        </div>
      </section>

      <section className="bg-[var(--surface-subtle)] py-16 px-6">
        <div className="mx-auto max-w-container">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">What Makes NexGuild Different</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] p-6"
              >
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface-card)] py-16 px-6">
        <div className="mx-auto max-w-prose">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">The Team</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
            NexGuild is a small, focused team building in public. We will introduce our team properly once we are ready. Until then, we let the platform speak for itself.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Platform Lead", "Contributor Operations", "Product Design", "Technical Lead"].map((role) => (
              <div
                key={role}
                className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] px-5 py-4"
              >
                <p className="font-medium text-[var(--text-primary)]">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
