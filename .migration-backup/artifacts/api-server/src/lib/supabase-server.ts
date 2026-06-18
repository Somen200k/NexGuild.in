import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key, { auth: { persistSession: false } });
}

export function createAnonClient() {
  const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(url, key, { auth: { persistSession: false } });
}
