# GENESIS 2026 — V2 Motion Guide (`docs/MOTION.md`)

This guide catalogs the motion choreography, progress intervals, and motion primitives powering the **One-Page 3D Scroll Experience** on `/`. All parameters and spring constants can be tuned in `src/lib/motion-config.ts`.

---

## 1. Scene Choreography & Progress Ranges

| Scene ID | Section | Scroll Budget | Entry Transition | Core Primitives Used | Reactive & Idle Effects |
|---|---|---|---|---|---|
| `loader` | Lobby Loader | n/a (≤ 1.2s) | Coin-spin badge, progress fill | `animate-coin-spin`, doors slide apart | Sound pop, random rotating tips |
| `hero` | Observatory Hub | 150 vh | Arch tilts, stars stream | `FloatLoop`, `Wordmark`, `StarBurst`, `Button3D` | 40+ twinkling stars, scanning telescope, interactive spinning planets, 5-tap badge easter egg |
| `about` | About Arena | 180 vh | Moon dive (scale 1→9 into navy) | `Tilt3D`, `FloatLoop` | Orbiting holographic blue spheres, bronze dome rib rotation, expanding chamfer card |
| `timeline` | Stage Road | 350 vh | Warp wipe, Colt 3D arc | `Tilt3D`, `Node`, `StarBurst`, `Modal` | Bar drawing with glowing runner, shockwave ring pops, hinge card drop, horizontal & vertical mobile |
| `prize-pool` | Prize Pool | 220 vh | Window flip-down | `ScreenShake`, `StarBurst`, `CountUp`, `Badge`, `Tilt3D` | Slamming badges (3rd→2nd→1st), rotating light-ray fan on 1st place, animated ₹60,000 count-up |
| `sponsors` | Partner Plaque | 200 vh | Diagonal orange panel wipes | `Window`, `Tilt3D`, `ShineSweep`, `StarBurst` | Staggered diagonal fly-in windows, unlock padlock bursts, 3D pointer tilt on logos |
| `faqs` | FAQs Menu | 120 vh | Center popup with backdrop dim | `Window`, `Accordion`, live search | Peeking skull badge with bounce on click, live filter highlight, mailto action |
| `register` | Final CTA | 100 vh | Night sky return, moon rise | `ScreenShake`, `FloatLoop`, `confetti`, `Button3D` | Giant dropping REGISTER button, confetti star burst, Add to Calendar (.ics), Web Share |

---

## 2. Motion Primitives Directory (`src/components/motion/`)

- **`Tilt3D.tsx`**: Pointer-following 3D perspective tilt (`rotateX/Y`) with dynamic specular glare highlight.
- **`FloatLoop.tsx`**: Continuous idle bobbing, hovering, and swaying with configurable distance, speed, and phase.
- **`BounceLetters.tsx`**: Outlined typography with letter wave loops and interactive individual letter hops.
- **`StarBurst.tsx`**: Expanding ring of 8 gold star particles bursting on heavy impact or achievement.
- **`ScreenShake.tsx`**: ±6px momentary impact shake for heavy landings (scene container only, never HUD).
- **`CountUp.tsx`**: Animated numerical ticker using `requestAnimationFrame` with easing.
- **`ShineSweep.tsx`**: Diagonal light glint traversing badges, cards, and sponsor plaques.
- **`CustomCursor.tsx`**: Desktop gold star cursor following mouse pointer with enlargement on interactive controls.

---

## 3. Quality Tiers (`<html data-tier="...">`)

1. **`ultra`**: Powerful desktop (≥ 8 cores, ≥ 8 GB RAM) — full 3D, cursor, all loops.
2. **`high`** (Default): Standard desktop and modern smartphones — full CSS 3D scroll choreography, particle bursts, sound FX.
3. **`lite`**: Low-end devices or FPS < 40 — particles and pointer parallax disabled, animations simplified.
4. **`reduced`**: `prefers-reduced-motion: reduce` — no 3D, zero pinning, instant transitions, clean stacked layout.
