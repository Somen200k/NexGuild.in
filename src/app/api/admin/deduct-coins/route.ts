import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createServerClient();
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if ((caller as { role: string } | null)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { contributorId, amount, reason } = await req.json() as {
    contributorId: string;
    amount: number;
    reason?: string;
  };

  if (!contributorId) return NextResponse.json({ error: "contributorId is required." }, { status: 400 });
  if (!amount || amount <= 0 || !Number.isInteger(amount)) {
    return NextResponse.json({ error: "Amount must be a positive integer." }, { status: 400 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("nexcoins, full_name")
    .eq("id", contributorId)
    .single();

  if (!profile) return NextResponse.json({ error: "Contributor not found." }, { status: 404 });

  const current    = (profile as { nexcoins: number }).nexcoins ?? 0;
  const newBalance = Math.max(0, current - amount);
  const deducted   = current - newBalance;

  if (deducted === 0) {
    return NextResponse.json({ error: "Contributor has 0 coins — nothing to deduct." }, { status: 400 });
  }

  await admin.from("profiles").update({ nexcoins: newBalance }).eq("id", contributorId);

  await admin.from("coin_transactions").insert({
    contributor_id: contributorId,
    amount:         deducted,
    type:           "deducted",
    source:         "admin",
    description:    reason?.trim() || "Coins deducted by admin",
    created_at:     new Date().toISOString(),
  });

  await admin.from("notifications").insert({
    user_id: contributorId,
    title:   `${deducted.toLocaleString()} NexCoins deducted from your account`,
    message: reason?.trim()
      ? `${deducted.toLocaleString()} NexCoins have been deducted. Reason: ${reason.trim()}`
      : `${deducted.toLocaleString()} NexCoins have been deducted from your account by the admin.`,
    type: "system",
  });

  return NextResponse.json({ success: true, newBalance, amountDeducted: deducted });
}
