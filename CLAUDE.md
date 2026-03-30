# Swadesh — Women's Ethnic Wear E-Commerce

## Tech Stack
- Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- Neon Postgres + Drizzle ORM, Upstash Redis
- Custom Phone OTP Auth (MSG91 + JWT via jose)
- Razorpay Payments, Cloudflare R2 Storage
- Typesense Search, Resend Email, MSG91 SMS

## Architecture Rules
- **Prices in paisa** — integer arithmetic, format to INR only at presentation layer
- **No-Line Rule** — boundaries via background color shifts, never 1px borders (Heritage Gold)
- **Mobile-first** — bottom sheets, bottom tab nav, swipe gestures, 44px touch targets
- **Immutable state** — Zustand returns new objects, Drizzle `returning()` for updates
- **Repository pattern** — all DB access through Server Actions in `src/lib/actions/`
- **API envelope** — `{ success, data, error, meta }` for all routes

## Design System
Heritage Gold — see `stitch_ecom_drop/heritage_gold/DESIGN.md` for full spec.
Key: no borders, gold ambient shadows, tonal surface hierarchy, full-round buttons.

## Key Directories
- `src/app/(storefront)/` — Public store pages
- `src/app/(auth)/` — Login/signup flows
- `src/app/admin/` — Admin dashboard
- `src/lib/db/` — Drizzle schema + connection
- `src/lib/redis/` — Upstash Redis client
- `src/lib/auth/` — OTP + JWT auth
- `src/components/ui/` — Heritage Gold UI primitives
- `src/components/storefront/` — Store components
- `src/store/` — Zustand stores (cart, wishlist)
