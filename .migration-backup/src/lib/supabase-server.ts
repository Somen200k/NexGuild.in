import { createClient } from "@supabase/supabase-js";

// Server-side admin client — never expose to the browser
// Only import this file from Server Components, Route Handlers, or Server Actions
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
