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
- **3D Atmospheric Canvas & WebGL Integration:**
  - Single lazy-loaded canvas (`three/Scene.tsx`) loaded dynamically via `next/dynamic` (`ssr: false`) in `Hero3DCanvas.tsx`.
  - Mounts after `requestIdleCallback` and when `#home` intersects the viewport.
  - Zero external 3D model downloads (0 KB model budget consumed): fully procedural cel-shaded Moon (`MeshToonMaterial` with runtime crater bump map on 256px offscreen canvas), Ringed Planet with alpha gradient disc, and GPU-driven twinkling starfield with shooting star loop.
  - Shared normalized pointer pipeline $[-1, 1]$ driving camera parallax ($x \pm 0.4, y \pm 0.25$) and scroll-driven camera dolly transition into About.
  - Runtime FPS watchdog downgrades to CSS fallback if average FPS $< 30$ over 2s or on `webglcontextlost`, persisted in `sessionStorage`.
  - Manual testing overrides via URL flags: `?3d=off` (forces fallback) and `?3d=on` (forces WebGL).
  - Exposes `data-3d-state` (`running` | `paused` | `fallback`) for test and telemetry observation.
- **Global Ambient Layer & 3D Tilt:**
  - Desktop-only `CursorSparkles.tsx` fixed canvas generating 4-point star sparkles on fine pointer movement with 600ms fade, pausing when the tab is hidden or reduced motion is preferred.
  - Reusable `useTilt3D.ts` mathematical hook with spring damping (`lerp`), glare reflection, and touch/reduced-motion disable, integrated across trading cards, prize shields, sponsor windows, and memory frames.
- **Backend & Persistence:** Next.js Route Handlers (`app/api/*`) connected to Supabase Postgres (RLS enabled), validated with Zod, protected by Cloudflare Turnstile and rate limiting, notifying registrants via Resend.

## 4. Performance & Budget Enforcements
- Initial JS Bundle: <= 170 KB gzipped.
- First Load Total: <= 1.5 MB.
- Hero Image Layers: <= 150 KB (WebP/AVIF).
- 3D Models: <= 300 KB (Draco compressed).
- CI Automated Validation: `npm run budget:check` verifies asset constraints on every build.
