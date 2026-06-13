import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const PROVIDERS = [
  { name: "CPX Research",  slug: "cpx",     active: false, share: 70, earnings: 0 },
  { name: "Lootably",      slug: "lootably",active: false, share: 68, earnings: 0 },
  { name: "AdGem",         slug: "adgem",   active: false, share: 65, earnings: 0 },
  { name: "Theorem Reach", slug: "theorem", active: false, share: 72, earnings: 0 },
  { name: "BitLabs",       slug: "bitlabs", active: false, share: 70, earnings: 0 },
];

export default function AdminOfferwallsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Offerwalls</h1>
        <p className="text-sm text-[var(--text-secondary)]">Configure offerwall provider integrations and revenue share.</p>
      </div>

      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-[var(--surface-subtle)] border-b border-[var(--border-default)]">
              {["Provider","Status","Contributor Share","Platform Share","Earnings","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {PROVIDERS.map((p) => (
              <tr key={p.slug} className="hover:bg-[var(--surface-subtle)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{p.name}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.active ? "success" : "neutral"}>{p.active ? "Enabled" : "Disabled"}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{p.share}%</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{100 - p.share}%</td>
                <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">
                  {p.earnings > 0 ? formatCurrency(p.earnings) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">Configure</Button>
                    <Button size="sm" variant={p.active ? "secondary" : "ghost"}>
                      {p.active ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
