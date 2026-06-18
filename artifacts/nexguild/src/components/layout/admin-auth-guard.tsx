
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

// Returns true = confirmed admin, false = confirmed not-admin, null = server error
async function checkIsAdmin(accessToken: string): Promise<boolean | null> {
  try {
    const res = await fetch("/api/auth/admin-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });
    const json = await res.json();
    console.log("[AdminAuthGuard] admin-check response:", JSON.stringify(json), "status:", res.status);
    if (res.status === 500) return null; // server error — don't sign out
    return json.isAdmin === true;
  } catch (err) {
    console.error("[AdminAuthGuard] admin-check fetch error:", err);
    return null;
  }
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [serverError, setServerError] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setReady(false);
    setServerError(false);

    if (isLoginPage) {
      // If already authenticated as admin → skip login form
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!session) {
          setReady(true);
          return;
        }
        const result = await checkIsAdmin(session.access_token);
        if (result === true) {
          router.replace("/admin");
        } else {
          setReady(true);
        }
      });
      return;
    }

    async function verifyAdmin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const result = await checkIsAdmin(session.access_token);

      if (result === null) {
        // Server error — show a retry prompt rather than silently signing out
        setServerError(true);
        setReady(true);
        return;
      }

      if (result === false) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setReady(true);
    }

    verifyAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setReady(false);
        router.replace("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  if (!ready) return null;

  if (serverError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[var(--text-secondary)]">
            Failed to verify admin permissions. Check the server logs for details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-[var(--brand-500)] text-white text-sm hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
