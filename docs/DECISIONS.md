# Architecture Decisions & Defaults Log (ADR)

This document tracks default design decisions, trade-offs, and how to change them as mandated by the GENESIS 2026 engineering protocol.

---

### DECISION 001: Three.js Lazy Loading Strategy & Bundle Budget Isolation
* **Context:** Initial JS budget is capped strictly at $\le 170\text{ KB gzip}$. Three.js and `@react-three/fiber` alone would exceed this budget if imported synchronously in the root chunk.
* **Decision:** We isolate the 3D canvas into `three/Scene.tsx`, loaded asynchronously via `next/dynamic` (`ssr: false`) inside `Hero3DCanvas.tsx`. The initial paint renders the lightweight 2D CSS/SVG celestial layers immediately, ensuring LCP $\le 2.5\text{s}$ on throttled 4G. When the 3D scene finishes initial frame generation, a smooth 400ms crossfade transitions the view to 3D and unmounts the 2D celestial layers.
* **How to Change:** If synchronous SSR 3D is ever needed (requires relaxing the 170 KB initial JS rule), update `Hero3DCanvas.tsx` to remove `dynamic()` and import `Scene` directly.

---

### DECISION 002: Procedural Shader & Canvas Textures vs. External GLB Models
* **Context:** Image download budgets strictly cap hero layers at $\le 150\text{ KB}$ each and 3D assets at $\le 300\text{ KB}$. External network requests at build or runtime introduce failure points and inflate bundle sizes.
* **Decision:** All celestial 3D bodies (Moon, Ringed Planet, Twinkling Stars, Shooting Stars) are generated procedurally at runtime:
  - Moon: `MeshToonMaterial` with runtime 3-step toon palette and procedural crater normal map on an offscreen 256px canvas.
  - Planet: Concentric `RingGeometry` with canvas linear alpha gradient.
  - Starfield: GPU `ShaderMaterial` point cloud with time-based twinkle (halved on low power) + periodic shooting star streak.
  Total download weight: **0 KB** consumed.
* **How to Change:** If artist-authored `.glb` models are provided, place them in `public/models/` (ensuring file size $\le 300\text{ KB}$) and load via `@react-three/drei`'s `useGLTF`.

---

### DECISION 003: Hardware & WebGL Degradation Watchdog
* **Context:** Users on low-tier mobile devices, low memory ($\le 4\text{ GB}$), low CPU cores ($\le 4$), slow connections (`2g`/`3g`/`saveData`), or systems where WebGL crashes must not experience jank, freezes, or broken visuals.
* **Decision:** 
  1. `useHardwareCapabilities.ts` inspects hardware signals and tests a live WebGL context inside a `try/catch`.
  2. If low power or reduced motion is detected, it falls back to the CSS/SVG vector scene.
  3. `three/Scene.tsx` runs an active FPS watchdog: after a 1.0s warm-up, if moving average FPS $< 30$ over a 2.0s window, or if `webglcontextlost` fires, it saves `genesis_3d_disabled = 'true'` in `sessionStorage` and downgrades seamlessly to the CSS fallback.
  4. Manual overrides: `?3d=off` and `?3d=on` query flags.
* **How to Change:** Adjust the 30 FPS threshold or 2.0s evaluation window in `three/Scene.tsx` lines 60–85.

---

### DECISION 004: Shared Normalized Pointer Pipeline
* **Context:** Having separate mouse listeners for R3F 3D camera parallax and 2D DOM cards introduces event duplication and layout thrashing.
* **Decision:** A single pointer listener on `#home` normalizes coordinates into $[-1, 1]$ and stores them in a shared mutable ref. R3F's `useFrame` reads this directly to smoothly lerp the camera, and 2D DOM cards utilize `useTilt3D` via passive `pointermove` with local relative bounding boxes.

---

### DECISION 005: Dual-Adapter Data Access Layer (Memory vs Supabase)
* **Context:** Supabase production keys are optional during development and local CI testing. The app must run offline and pass all unit/API test suites without requiring external database connections or Docker.
* **Decision:** Implemented `DatabaseAdapter` interface in `lib/db.ts` with two interchangeable implementations:
  1. `MemoryAdapter`: In-memory storage with seeded mock squads, duplicate check enforcement, and unique `GEN-2026-XXXX` ID generation. Default when `NEXT_PUBLIC_SUPABASE_URL` is missing or in test mode.
  2. `SupabaseAdapter`: Production client querying Supabase PostgREST endpoints directly using native `fetch` with `apikey` and `Authorization: Bearer` headers, avoiding heavy third-party client library bundle bloat.
* **How to Change:** Set `DB_ADAPTER=supabase` or configure production `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

---

### DECISION 006: Duplicate Detection Scope per Tournament Edition
* **Context:** Teams from previous or future tournament editions should not be blocked from registering, but squads within the current edition (`genesis-2026`) must have unique leader contact information to prevent spam and bracket tampering.
* **Decision:** Duplicate verification on leader email and leader phone number is scoped per edition (`edition = 'genesis-2026'`). Unique indexes are declared in SQL migrations (`idx_registrations_edition_leader_email`, `idx_registrations_edition_leader_phone`) and verified pre-insert by both database adapters, returning `HTTP 409 Conflict`.
* **How to Change:** Adjust edition constants in `content/event.json`.

---

### DECISION 007: Cloudflare Turnstile Bot Verification with Dev/Test Fallbacks
* **Context:** Automated submissions must be blocked in production, but local developers and automated CI tests must not fail due to missing Cloudflare network connectivity.
* **Decision:** `lib/turnstile.ts` utilizes Cloudflare's published dummy test keys (`Sitekey: 1x00000000000000000000AA`, `Secret: 1x0000000000000000000000000000000AA`). In development/test mode, mock tokens (`test-turnstile-token`) or dummy keys are automatically verified without throwing network errors. Production environments verify against `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
* **How to Change:** Supply valid `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in production environment variables.

---

### DECISION 008: Sliding Window Rate Limiting (In-Memory with Upstash Redis Upgrade)
* **Context:** Preventing registration endpoint denial-of-service without mandating a live Redis instance for local developers.
* **Decision:** `lib/ratelimit.ts` checks for `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. If present, it executes an atomic pipeline via Upstash REST. Otherwise, it maintains an in-memory sliding window limiter (5 requests per 60 seconds per IP on `/api/register`; 30 requests per 60 seconds on `/api/stats`).
* **How to Change:** Set Upstash REST environment variables to enable distributed edge rate limiting across multiple serverless instances.

---

### DECISION 009: Decoupled Email Provider Interface with Arcade HTML Template
* **Context:** Registration confirmation emails must be dispatched reliably upon successful squad creation, with support for offline testing and zero dependencies on Resend during development.
* **Decision:** `lib/email.ts` exposes `EmailProvider` with `MockEmailProvider` (stores sent emails in an array for unit test inspection and console logging) and `ResendEmailProvider` (dispatches to Resend REST API via `fetch`). The confirmation template is custom styled with high-contrast Brawl Stars tournament banners, Team ID badges, venue instructions, and Discord invites.
* **How to Change:** Supply `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local` to switch from mock to live email dispatch.

---

### DECISION 010: Free Registration & No-Payment Architecture Extension Points
* **Context:** GENESIS 2026 is free of charge (`registrationFee: 0`, `paymentsEnabled: false` in `event.json`).
* **Decision:** The backend and frontend enforce free entry. Payment processing libraries are strictly excluded from dependencies to preserve bundle budget. If paid registrations are added in a future edition, an extension point is documented to introduce a Razorpay/Stripe checkout webhook step between validation and DB insertion.

