import { Router } from "express";
import { createServerClient } from "../lib/supabase.js";

const router = Router();

router.post("/store/apply-coupon", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const admin = createServerClient();
  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user) return res.status(401).json({ error: "Unauthorized" });

  const { code, totalCoins } = req.body as { code: string; totalCoins: number };
  if (!code?.trim()) return res.status(400).json({ error: "Coupon code is required." });

  const { data: coupon, error } = await admin
    .from("coupons")
    .select("id, code, discount_percent, discount_coins, max_uses, used_count, expires_at, is_active")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (error || !coupon) return res.status(400).json({ error: "Invalid coupon code." });
  const c = coupon as {
    id: string; code: string; discount_percent: number; discount_coins: number;
    max_uses: number; used_count: number; expires_at: string | null; is_active: boolean;
  };
  if (!c.is_active) return res.status(400).json({ error: "This coupon is no longer active." });
  if (c.expires_at && new Date(c.expires_at) < new Date()) {
    return res.status(400).json({ error: "This coupon has expired." });
  }
  if (c.max_uses > 0 && c.used_count >= c.max_uses) {
    return res.status(400).json({ error: "This coupon has reached its usage limit." });
  }

  let discountCoins = 0;
  if (c.discount_percent > 0) discountCoins = Math.floor((totalCoins ?? 0) * c.discount_percent / 100);
  else if (c.discount_coins > 0) discountCoins = Math.min(c.discount_coins, totalCoins ?? 0);

  return res.json({ valid: true, code: c.code, discountCoins, discountPercent: c.discount_percent ?? 0, couponId: c.id });
});

router.post("/store/redeem-cart", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const admin = createServerClient();
  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user) return res.status(401).json({ error: "Unauthorized" });

  const { items, couponCode } = req.body as {
    items: Array<{ voucherType: string; coins: number }>;
    couponCode: string | null;
  };
  if (!items || items.length === 0) return res.status(400).json({ error: "Cart is empty." });

  const totalCoins = items.reduce((s, i) => s + i.coins, 0);
  let discountCoins = 0;
  let couponId: string | null = null;

  if (couponCode) {
    const { data: coupon } = await admin
      .from("coupons")
      .select("id, discount_percent, discount_coins, max_uses, used_count, expires_at, is_active")
      .eq("code", couponCode.trim().toUpperCase())
      .single();

    const c = coupon as {
      id: string; discount_percent: number; discount_coins: number;
      max_uses: number; used_count: number; expires_at: string | null; is_active: boolean;
    } | null;
    if (c?.is_active) {
      const expired = c.expires_at && new Date(c.expires_at) < new Date();
      const exhausted = c.max_uses > 0 && c.used_count >= c.max_uses;
      if (!expired && !exhausted) {
        couponId = c.id;
        if (c.discount_percent > 0) discountCoins = Math.floor(totalCoins * c.discount_percent / 100);
        else if (c.discount_coins > 0) discountCoins = Math.min(c.discount_coins, totalCoins);
      }
    }
  }

  const finalTotal = Math.max(0, totalCoins - discountCoins);

  const { data: profile } = await admin.from("profiles").select("nexcoins").eq("id", user.id).single();
  const currentBalance = (profile as { nexcoins: number } | null)?.nexcoins ?? 0;
  if (currentBalance < finalTotal) {
    return res.status(400).json({ error: "Insufficient NexCoins balance." });
  }

  const inserts = items.map((item) => ({
    contributor_id: user.id, voucher_type: item.voucherType,
    voucher_value: null, coins_spent: item.coins, status: "pending",
  }));
  const { error: insertErr } = await admin.from("voucher_requests").insert(inserts);
  if (insertErr) return res.status(500).json({ error: "Failed to create voucher requests." });

  const newBalance = currentBalance - finalTotal;
  await admin.from("profiles").update({ nexcoins: newBalance }).eq("id", user.id);
  await admin.from("coin_transactions").insert({
    contributor_id: user.id, amount: finalTotal, type: "redeemed", source: "voucher",
    description: `Redeemed ${items.length} voucher${items.length > 1 ? "s" : ""} from store`,
    created_at: new Date().toISOString(),
  });

  if (couponId) {
    const { data: cur } = await admin.from("coupons").select("used_count").eq("id", couponId).single();
    if (cur) {
      await admin.from("coupons").update({ used_count: (cur as { used_count: number }).used_count + 1 }).eq("id", couponId);
    }
  }

  return res.json({ success: true, voucherCount: items.length, newBalance, coinsDeducted: finalTotal });
});

export default router;
