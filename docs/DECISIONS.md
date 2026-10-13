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
