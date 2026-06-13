"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Wallet, ArrowDownCircle } from "lucide-react";
import { useState } from "react";

export default function WalletPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Wallet</h1>
        <p className="text-sm text-[var(--text-secondary)]">Manage your earnings and request withdrawals.</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="h-5 w-5 text-[var(--brand-500)]" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">Available Balance</p>
          </div>
          <p className="text-4xl font-bold text-[var(--text-primary)] mb-4">{formatCurrency(0)}</p>
          <Button onClick={() => setShowModal(true)} className="w-full" disabled>
            <ArrowDownCircle className="h-4 w-4" /> Withdraw
          </Button>
          <p className="text-xs text-[var(--text-muted)] text-center mt-2">Minimum {formatCurrency(5.00)} required</p>
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Pending Balance</p>
          </div>
          <p className="text-4xl font-bold text-[var(--warning-text)] mb-2">{formatCurrency(0)}</p>
          <p className="text-xs text-[var(--text-muted)]">Clears after submission review. Not yet withdrawable.</p>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)]">
        <div className="px-5 py-4 border-b border-[var(--border-default)]">
          <h2 className="font-semibold text-[var(--text-primary)]">Withdrawal History</h2>
        </div>
        <div className="py-12 flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">No withdrawals yet</p>
          <p className="text-xs text-[var(--text-muted)]">Your withdrawal requests will appear here once submitted.</p>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[var(--surface-overlay)]">
          <div className="w-full max-w-sm bg-[var(--surface-card)] rounded-xl border border-[var(--border-default)] p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Request Withdrawal</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-5">Available: <strong>{formatCurrency(0)}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Withdrawal Method</label>
                <div className="flex flex-col gap-2">
                  {["UPI", "Bank Transfer", "PayPal"].map((m) => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="method" value={m} defaultChecked={m === "UPI"} className="accent-[var(--brand-500)]" />
                      <span className="text-sm text-[var(--text-primary)]">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">UPI ID / Account Details</label>
                <input
                  type="text"
                  placeholder="yourname@upi or account number"
                  className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Amount</label>
                <input
                  type="number"
                  min={5}
                  step={0.01}
                  placeholder="5.00"
                  className="w-full h-10 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1">Submit Request</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
