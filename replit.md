# NexGuild

A contributor platform where contributors earn NexCoins by completing micro-tasks, and admins manage the platform.

## Run & Operate

- `pnpm --filter @workspace/nexguild run dev` — run the frontend (Vite, auto-assigned port)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- Required secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React + wouter (client-side routing)
- API: Express 5 (esbuild bundle)
- Auth + DB: Supabase (browser client + service-role server client)
- Email: Resend
- Styling: Tailwind v4 (`@tailwindcss/vite`) with gold + teal dual-theme CSS vars

## Where things live

- `artifacts/nexguild/src/App.tsx` — full wouter routing (~60 pages)
- `artifacts/nexguild/src/index.css` — global CSS vars: gold theme (`.theme-gold`), teal theme (`.theme-teal`), dark mode (`.dark`)
- `artifacts/nexguild/src/lib/supabase.ts` — singleton browser Supabase client
- `artifacts/nexguild/src/lib/navigation.ts` — wouter shim (`useRouter`, `usePathname`, `useParams`, `Link`) replacing `next/navigation`
- `artifacts/nexguild/src/lib/next-image.tsx` — `<img>` shim replacing `next/image`
- `artifacts/nexguild/src/types/next.d.ts` — stub type declarations for `next`, `next/server`, `next/headers` (unused route files still in `src/app/api/`)
- `artifacts/api-server/src/routes/` — Express route files: auth, contact, store, support, admin (stats, contributors, tasks, submissions, coupons, vouchers, etc.)
- `artifacts/api-server/src/lib/supabase-server.ts` — service-role Supabase client
- `artifacts/api-server/src/lib/email.ts` — Resend email templates (welcome, support, announcements)

## Architecture decisions

- **Wouter over React Router**: Matches the original Next.js `useRouter`/`usePathname` API more closely, minimising shim complexity.
- **`next/navigation` shim**: All page files import from `@/lib/navigation` instead of `next/navigation` — zero per-file rewrites needed after the batch sed pass.
- **Next.js API routes kept but unused**: `src/app/api/**` files are left in place (with a `src/types/next.d.ts` stub) so git history is preserved; Express routes in `api-server` are the live implementations.
- **Supabase URL + anon key are Vite env vars** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) so they're embedded at build time and available in the browser. Service role key is only in the API server.
- **Dual theme system**: Gold layout wraps org-facing pages; Teal layout wraps contributor-facing pages. CSS vars live in `index.css` under `.theme-gold` and `.theme-teal` blocks.

## Product

- Public split homepage (org side / contributor side)
- Contributor flow: sign up → browse tasks → submit work → earn NexCoins → redeem vouchers
- Admin panel: manage contributors, tasks, submissions, announcements, store, voucher catalog, project assignments, support tickets
- Email notifications for welcome, support replies, announcements via Resend

## Gotchas

- Vite secrets must be prefixed `VITE_` to be accessible in the browser (`import.meta.env.VITE_*`).
- The Next.js `src/app/api/**` route files import from `next/server` — they are type-safe via the stub in `src/types/next.d.ts` but are **not** executed; all API traffic goes through the Express `api-server`.
- When restarting the nexguild workflow, if Vite says "Port already in use", kill the stale process with `pkill -f "vite.*nexguild"` before restarting.

## User preferences

_Populate as you go — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
