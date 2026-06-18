"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      // Check if account is banned
      const { data: profile } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", session.user.id)
        .single();

      if ((profile as { status: string } | null)?.status === "banned") {
        await supabase.auth.signOut();
        router.replace("/earn?banned=1");
        return;
      }

      setReady(true);
    }

    checkSession();

    // Redirect on signout or session expiry
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.replace(event === "SIGNED_OUT" ? "/earn" : "/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!ready) return null;

  return <>{children}</>;
}
