import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never block admin panel, API routes, static assets, or maintenance page itself
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/maintenance"
  ) {
    return NextResponse.next();
  }

  // Check maintenance mode via Supabase REST API (edge-compatible fetch)
  try {
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/platform_settings?select=value&key=eq.maintenance_mode&limit=1`,
        {
          headers: {
            apikey:        serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as { value: string }[];
        if (rows[0]?.value === "true") {
          return NextResponse.redirect(new URL("/maintenance", req.url));
        }
      }
    }
  } catch {
    // If the table doesn't exist or fetch fails, allow through
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
