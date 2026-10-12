# GENESIS 2026 — 5th Edition GDXR Flagship Event

An interactive, heavily animated single-page web experience with a production backend for the **GDXR (AR/VR) Club** at **AIT Pune**.

## Visual Design
- **Brawl Stars Game UI Aesthetic:** Chunky typography, beveled angled plaques, drop-base tactile buttons, custom SVG shields, numbered game coins, and watermark patterns.
- **Living Layered Scenes:** Multilayered continuous motion (entrance, idle breathing, and interactive reactions) powered by GSAP, ScrollTrigger, and React Three Fiber.

## Tech Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript (Strict).
- **Styling:** Tailwind CSS + custom game UI tokens.
- **Animations & Smooth Scroll:** GSAP, ScrollTrigger, Lenis (desktop-only).
- **3D Atmospheric Canvas:** React Three Fiber / Drei (single lazy-loaded canvas).
- **Validation & Backend:** Zod, Next.js Route Handlers, Supabase Postgres, Resend, Cloudflare Turnstile.
- **Testing:** Vitest, Playwright, depcheck.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local

# 3. Run development server
npm run dev

# 4. Run tests and checks
npm run lint
npm run typecheck
npm run test
npm run budget:check
```

## Structure
```
app/          # Next.js App Router (page.tsx, layout.tsx, api routes)
components/   # Component modules (hud, hero, about, timeline, prizes, sponsors, memories, faq, ui)
animations/   # GSAP timelines, idle loop hooks (useIdleLoop.ts)
three/        # Procedural 3D scene (Scene.tsx, Moon.tsx, Planet.tsx, Stars.tsx)
content/      # Structured content JSON files (DEMO_MODE supported)
lib/          # Database, email, rate limiting, and Zod schemas
public/       # Fonts, SVGs, optimized AVIF/WebP assets, CREDITS.md
tests/        # Unit, API, and E2E test suites
docs/         # Architecture & QA reports
scripts/      # CI budget enforcement scripts
```
