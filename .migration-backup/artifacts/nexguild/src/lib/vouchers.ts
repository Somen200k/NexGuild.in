export interface VoucherItem {
  id: string;
  brand: string;
  name: string;
  description: string;
  coins: number;
  value: number;
  category: string;
  badge?: string;
}

export const VOUCHERS: VoucherItem[] = [
  { id: "amazon-100",      brand: "Amazon",      name: "Amazon Gift Card",    description: "₹100 Amazon India gift voucher",  coins: 1000, value: 100, category: "Shopping", badge: "Popular" },
  { id: "amazon-250",      brand: "Amazon",      name: "Amazon Gift Card",    description: "₹250 Amazon India gift voucher",  coins: 2500, value: 250, category: "Shopping" },
  { id: "amazon-500",      brand: "Amazon",      name: "Amazon Gift Card",    description: "₹500 Amazon India gift voucher",  coins: 5000, value: 500, category: "Shopping" },
  { id: "flipkart-100",    brand: "Flipkart",    name: "Flipkart Gift Card",  description: "₹100 Flipkart gift voucher",      coins: 1000, value: 100, category: "Shopping" },
  { id: "flipkart-250",    brand: "Flipkart",    name: "Flipkart Gift Card",  description: "₹250 Flipkart gift voucher",      coins: 2500, value: 250, category: "Shopping" },
  { id: "google-play-100", brand: "Google Play", name: "Google Play Credits", description: "₹100 Google Play credit",         coins: 1000, value: 100, category: "Apps" },
  { id: "google-play-250", brand: "Google Play", name: "Google Play Credits", description: "₹250 Google Play credit",         coins: 2500, value: 250, category: "Apps" },
  { id: "zomato-100",      brand: "Zomato",      name: "Zomato Credits",      description: "₹100 Zomato credits",             coins: 1000, value: 100, category: "Food" },
  { id: "zomato-200",      brand: "Zomato",      name: "Zomato Credits",      description: "₹200 Zomato credits",             coins: 2000, value: 200, category: "Food" },
];

export const BRAND_META: Record<string, { emoji: string; bg: string; text: string }> = {
  "Amazon":      { emoji: "🛒", bg: "bg-orange-500/15", text: "text-orange-400" },
  "Flipkart":    { emoji: "🛍️", bg: "bg-blue-500/15",   text: "text-blue-400" },
  "Google Play": { emoji: "▶️",  bg: "bg-green-500/15",  text: "text-green-400" },
  "Zomato":      { emoji: "🍕", bg: "bg-red-500/15",    text: "text-red-400" },
};
