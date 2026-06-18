import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[NexGuild] Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Secrets panel."
  );
}

// Singleton browser client — safe to import in client components and hooks.
// realtime.params.eventsPerSecond controls client-side rate limiting.
// Tables must also be added to supabase_realtime publication (see schema.sql section 18).
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
