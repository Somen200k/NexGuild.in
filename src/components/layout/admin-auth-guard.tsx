"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }
    const token = localStorage.getItem("nexguild_admin_token");
    if (!token) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router, isLoginPage]);

  if (!ready) return null;

  return <>{children}</>;
}
