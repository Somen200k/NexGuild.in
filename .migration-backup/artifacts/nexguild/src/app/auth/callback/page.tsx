
import { useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase JS client automatically exchanges the token hash/code in the URL
    // and fires onAuthStateChange. We listen for the first confirmed session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
          // Send welcome email (fire-and-forget) — fires once after email confirmation
          fetch("/api/auth/welcome", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              name:  session.user.user_metadata?.full_name ?? session.user.email ?? "Contributor",
            }),
          }).catch(() => {});

          subscription.unsubscribe();
          router.replace("/dashboard");
        }
      }
    );

    // Fallback: if already signed in (e.g. token already exchanged), redirect immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400">Verifying your account…</p>
      </div>
    </div>
  );
}
