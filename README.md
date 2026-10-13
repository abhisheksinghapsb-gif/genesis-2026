# GENESIS 2026 — 5th Edition GDXR Flagship Event

An interactive, heavily animated single-page web experience with a production-grade full-stack backend for the **GDXR (AR/VR) Club** at **Army Institute of Technology (AIT), Pune**.

---

## Visual Design & Aesthetics
- **Brawl Stars Game UI Aesthetic:** Chunky Lilita One typography, beveled angled plaques, drop-base tactile buttons, custom SVG crests & shields, numbered game coins, and watermark patterns.
- **Living Layered Scenes:** Multilayered continuous motion (entrance, idle breathing, and interactive reactions) powered by GSAP, ScrollTrigger, and React Three Fiber.
- **3D Atmospheric Canvas:** Single lazy-loaded React Three Fiber canvas featuring procedural moon craters, ringed planets, and dynamic starfields with automatic low-power CSS fallback.

---

## Tech Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript (Strict).
- **Styling:** Tailwind CSS + custom game UI tokens.
- **Animations & Smooth Scroll:** GSAP 3.12, ScrollTrigger, Lenis (desktop-only).
- **3D Canvas:** React Three Fiber, Drei, Three.js (procedural first, 0 KB model download).
- **Data & Validation:** Dual Database Adapter (In-memory & Supabase PostgREST), Zod shared schemas.
- **Bot Defense & Security:** Cloudflare Turnstile CAPTCHA verification, sliding-window rate limiting.
- **Transactional Email:** Resend API integration with branded HTML templates and console/mock transport fallback.
- **Verification & Testing:** Vitest (unit & integration), Playwright (cross-browser matrix), Autocannon (load testing), Lighthouse CI (Core Web Vitals).

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local

# 3. Run development server
npm run dev

# 4. Run tests and verification checks
npm run lint          # ESLint zero warnings
npm run typecheck     # TypeScript compiler verification
npm run test          # Vitest unit & integration suite
npm run budget:check  # Performance budgets & asset sizes
npm run test:e2e      # Playwright end-to-end suite
```

---

## Git Remote Setup

To publish this repository to your remote origin (GitHub, GitLab, or Gitea):

```bash
# 1. Add your remote repository URL
git remote add origin https://github.com/<your-username-or-org>/genesis-2026.git

# 2. Ensure main branch is active
git branch -M main

# 3. Push commits and tags to remote
git push -u origin main
```

---

## Project Structure

```
├── app/                  # Next.js App Router (page.tsx, layout.tsx, /api endpoints)
│   └── api/
│       ├── admin/        # Secured admin dashboard API
│       ├── health/       # External uptime monitoring endpoint (GET & HEAD)
│       ├── register/     # Turnstile-protected squad registration
│       └── stats/        # Live team registration counter
├── components/           # Brawl Stars UI components
│   ├── ambient/          # Cursor sparkles & ambient particles
│   ├── hud/              # Global game HUD, nav drawer, and section trackers
│   ├── hero/             # Genesis 2026 hero, crest badge, countdown timer
│   ├── about/            # Official briefing & robot brawler mascot
│   ├── timeline/         # Scrubbed event roadmap & milestone details modals
│   ├── prizes/           # ₹60k prize pool cards & collapsible track trays
│   ├── sponsors/         # Tiered sponsor window plaques
│   ├── memories/         # Bi-directional marquee photo gallery & lightbox
│   ├── faq/              # Searchable FAQ accordion & contact modals
│   ├── registration/     # 3-step squad registration wizard
│   └── ui/               # GameLoader, buttons, badges, modals
├── animations/           # GSAP timelines, hardware capability detectors, idle hooks
├── three/                # Procedural 3D scene (Scene, Moon, Planet, Stars)
├── content/              # Event configuration (event.json, timeline.json, sponsors.json, etc.)
├── lib/                  # Database adapters, Resend email provider, Zod schemas, Sentry
├── docs/                 # QA screenshots, load test reports, Lighthouse audits
├── scripts/              # CI budget checks, load tests, Lighthouse runner, OG image generator
└── supabase/             # PostgreSQL database migrations and RLS schema
```

---

## Deployment & Verification Documentation

- [DEPLOY.md](DEPLOY.md): Complete step-by-step production deployment guide, Staging vs. Production environment variable matrix, Supabase migration setup, Resend domain verification, and Cloudflare Turnstile keys.
- [QA_REPORT.md](QA_REPORT.md): Comprehensive Phase 8 & 9 QA verification report covering cross-browser Playwright test matrix, visual screenshot archives, Autocannon load testing, and Lighthouse CI Core Web Vitals audits.
