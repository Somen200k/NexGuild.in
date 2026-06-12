import { OpportunityCard } from "@/components/ui/opportunity-card";

const OPPORTUNITIES = [
  { title: "Consumer Habits Survey", type: "survey" as const, description: "Share your daily shopping and consumption habits for a major research study.", payout: "$1.20", estimatedMinutes: 8, skillLevel: "any" as const, href: "/dashboard/opportunities/1" },
  { title: "Image Sentiment Tagging", type: "micro_task" as const, description: "Label images as positive, negative, or neutral for an AI training dataset.", payout: "$0.06", estimatedMinutes: 2, skillLevel: "any" as const, href: "/dashboard/opportunities/2" },
  { title: "Recipe Article Writing", type: "content_task" as const, description: "Write a 300-word article on a provided recipe topic following a style guide.", payout: "$3.50", estimatedMinutes: 20, skillLevel: "intermediate" as const, href: "/dashboard/opportunities/3" },
  { title: "Audio Clip Transcription", type: "data_labeling" as const, description: "Transcribe 30-second audio clips of conversational speech accurately.", payout: "$0.90", estimatedMinutes: 8, skillLevel: "any" as const, href: "/dashboard/opportunities/4" },
  { title: "Brand Awareness Study", type: "survey" as const, description: "Rate your familiarity with and perceptions of various technology brands.", payout: "$0.60", estimatedMinutes: 5, skillLevel: "any" as const, href: "/dashboard/opportunities/5" },
  { title: "Product Description Edit", type: "content_task" as const, description: "Improve existing product descriptions for clarity, tone, and SEO keywords.", payout: "$2.00", estimatedMinutes: 15, skillLevel: "intermediate" as const, href: "/dashboard/opportunities/6" },
  { title: "Bounding Box Annotation", type: "data_labeling" as const, description: "Draw bounding boxes around objects in images for an object detection model.", payout: "$1.40", estimatedMinutes: 10, skillLevel: "any" as const, href: "/dashboard/opportunities/7" },
  { title: "App UX Feedback", type: "content_task" as const, description: "Test a mobile app and write structured feedback on usability and design.", payout: "$5.00", estimatedMinutes: 30, skillLevel: "intermediate" as const, href: "/dashboard/opportunities/8" },
  { title: "Text Classification", type: "micro_task" as const, description: "Categorize short text snippets into predefined categories for a classification model.", payout: "$0.04", estimatedMinutes: 1, skillLevel: "any" as const, href: "/dashboard/opportunities/9" },
];

const FILTERS = ["All", "Surveys", "Micro-tasks", "Data Labeling", "Content Tasks", "Projects"];

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Opportunities</h1>
        <p className="text-sm text-[var(--text-secondary)]">Browse all tasks available to you right now.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              i === 0
                ? "bg-[var(--brand-500)] text-white"
                : "bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border-default)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {OPPORTUNITIES.map((opp) => (
          <OpportunityCard key={opp.title} {...opp} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 pt-4">
        {["←", "1", "2", "3", "→"].map((p) => (
          <button
            key={p}
            className={`h-9 min-w-[36px] px-3 rounded-md text-sm font-medium transition-colors ${
              p === "1"
                ? "bg-[var(--brand-500)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
