---
name: NexGuild API server layout
description: Express route structure after porting all 27 Next.js API routes; env var names, router grouping, and key conventions
---

## Route grouping
Five router files under `artifacts/api-server/src/routes/`:
- `auth.ts` — POST /auth/admin-check, POST /auth/welcome
- `contact.ts` — POST /contact, POST /contributor-contact
- `support.ts` — POST /support/create-ticket, POST /support/send-message
- `store.ts` — POST /store/apply-coupon, POST /store/redeem-cart
- `admin.ts` — 19 admin routes (stats, contributors, tasks, assignments, submissions, projects, review-submission, review-assignment, send-coins, deduct-coins, deliver-voucher, reply-ticket, announcements, settings, task-analytics, coupons, voucher-availability, voucher-catalog)

## Lib helpers
- `src/lib/supabase.ts` — `createServerClient()` reads `SUPABASE_URL` (falls back to `VITE_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`) + `SUPABASE_SERVICE_ROLE_KEY`; `verifyAdminOrOwner(authHeader)` returns `{ admin, user, role }` or null
- `src/lib/email.ts` — `getResend()` wraps RESEND_API_KEY; all HTML email templates exported as named functions

## Key conventions
- All imports use `.js` extension (ESM build)
- Admin routes all call `verifyAdminOrOwner` — returns 401/403 on failure
- Email sends are fire-and-forget (`.catch()` logs, never blocks response)
- Express app mounts router at `/api`; so frontend calls `/api/auth/admin-check` etc.

**Why:** Next.js API routes couldn't be reused in Express without conversion — the middleware, request/response shapes, and import resolution are all different.
