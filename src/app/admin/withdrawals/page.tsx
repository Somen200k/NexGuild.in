const TABS = ["Pending", "Processing", "Completed", "Rejected"];

export default function WithdrawalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Withdrawals</h1>
        <p className="text-sm text-[var(--text-secondary)]">Process and track contributor withdrawal requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border-default)]">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              i === 0
                ? "border-[var(--brand-500)] text-[var(--brand-600)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Shell */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              {["Contributor","Amount","Method","Requested","Status","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-sm text-[var(--text-muted)]">
                No withdrawal requests yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
