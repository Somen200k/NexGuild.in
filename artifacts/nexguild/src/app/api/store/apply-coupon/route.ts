import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createServerClient();
  const { data: { user }, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code, totalCoins } = await req.json() as { code: string; totalCoins: number };
  if (!code?.trim()) return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });

  const { data: coupon, error } = await admin
    .from("coupons")
    .select("id, code, discount_percent, discount_coins, max_uses, used_count, expires_at, is_active")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (error || !coupon) return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
  if (!coupon.is_active) return NextResponse.json({ error: "This coupon is no longer active." }, { status: 400 });
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
  }
  if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
  }

  let discountCoins = 0;
  if (coupon.discount_percent > 0) {
    discountCoins = Math.floor((totalCoins ?? 0) * coupon.discount_percent / 100);
  } else if (coupon.discount_coins > 0) {
    discountCoins = Math.min(coupon.discount_coins, totalCoins ?? 0);
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountCoins,
    discountPercent: coupon.discount_percent ?? 0,
    couponId: coupon.id,
  });
}
