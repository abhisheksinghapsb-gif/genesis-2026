# GENESIS 2026 — Architecture & System Design

## 1. Executive Overview
GENESIS 2026 is the 5th edition of the GDXR (AR/VR) Club's gaming and virtual reality flagship event at AIT Pune.
The application is structured as a high-performance, single-page, heavily animated web experience engineered with Next.js (App Router), TypeScript, Tailwind CSS, GSAP, Lenis, and React Three Fiber.

## 2. Design System & Visual Philosophy
- **Game UI Paradigm:** Faithful re-creation of Brawl Stars game UI dynamics:
  - Heavy drop-bases on interactive buttons (`0 6px 0 #000000`).
  - Chunky outlined text with directional strokes and drop shadows.
  - Angular chamfered cards and slanted panels cut via CSS polygon `clip-path`.
  - Continuous movement: entrance reveals, desynchronized idle loops, and interactive micro-reactions.
- **Pure Code Construction:** Flat design mockups are never used as page backgrounds. All banners, cards, shields, coins, and dividers are generated via responsive SVG and CSS components.

## 3. Technology Stack & Key Libraries
- **Framework:** Next.js 15+ (App Router), React 19.
- **Language:** TypeScript in strict mode (`noImplicitAny`, strict null checks, unchecked index access).
- **Styling:** Tailwind CSS with custom game design tokens and keyframes.
- **Animation Engine:** GSAP + ScrollTrigger for scroll-linked sequences and complex timelines; lightweight custom hooks for idle loops (`useIdleLoop`).
- **Smooth Scrolling:** Lenis enabled exclusively on desktop pointers (native scroll on touch devices).
- **3D Atmospheric Canvas:** React Three Fiber / Drei with a single lazy-loaded canvas rendering procedural sky, moon, and planet rings, featuring an automatic fallback on low-end devices.
- **Backend & Persistence:** Next.js Route Handlers (`app/api/*`) connected to Supabase Postgres (RLS enabled), validated with Zod, protected by Cloudflare Turnstile and rate limiting, notifying registrants via Resend.

## 4. Performance & Budget Enforcements
- Initial JS Bundle: <= 170 KB gzipped.
- First Load Total: <= 1.5 MB.
- Hero Image Layers: <= 150 KB (WebP/AVIF).
- 3D Models: <= 300 KB (Draco compressed).
- CI Automated Validation: `npm run budget:check` verifies asset constraints on every build.
