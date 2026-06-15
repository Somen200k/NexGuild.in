"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setReady(true);
      }
    });

    // Redirect to /earn on explicit signout; /login if session expires
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
