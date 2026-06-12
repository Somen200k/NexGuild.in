const PROVIDERS = [
  { name: "CPX Research",   slug: "cpx",      active: true,  desc: "High-paying surveys with global coverage." },
  { name: "Lootably",       slug: "lootably", active: true,  desc: "Mixed tasks including surveys, videos, and app installs." },
  { name: "AdGem",          slug: "adgem",    active: false, desc: "Mobile and desktop offer tasks." },
  { name: "Theorem Reach",  slug: "theorem",  active: false, desc: "High-quality market research surveys." },
  { name: "BitLabs",        slug: "bitlabs",  active: false, desc: "Strong revenue-per-completion survey provider." },
];

export default function OfferwallsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Offerwall Hub</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Complete tasks from our partner providers. Earnings are credited to your wallet automatically after confirmation.
        </p>
      </div>

      {/* Provider Tabs */}
      <div className="flex gap-1 border-b border-[var(--border-default)] overflow-x-auto scrollbar-thin">
        {PROVIDERS.filter((p) => p.active).map((p, i) => (
          <button
            key={p.slug}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              i === 0
                ? "border-[var(--brand-500)] text-[var(--brand-600)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Offerwall Embed Placeholder */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-default)] bg-[var(--surface-subtle)]">
          <p className="text-xs text-[var(--text-muted)]">
            Earnings from CPX Research are credited to your wallet automatically after task confirmation.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-[var(--surface-page)]">
          <div className="h-16 w-16 rounded-full bg-[var(--surface-subtle)] flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">CPX Research</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm">
            The CPX Research offerwall will appear here once your account is connected. Surveys, product testing, and more.
          </p>
        </div>
      </div>

      {/* Inactive Providers */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
          Coming Soon
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROVIDERS.filter((p) => !p.active).map((p) => (
            <div key={p.slug} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-subtle)] p-4 opacity-60">
              <p className="font-medium text-[var(--text-primary)] text-sm mb-1">{p.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
