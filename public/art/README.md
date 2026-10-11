# GENESIS 2026 — Art Assets Inventory

This directory contains the illustrations, scenery, cropped character art, and pattern tiles for the GENESIS 2026 website.

## Asset Directory Map & Replacement Specs

| File Path | Source Mockup | Status | Description & Replacement Spec |
|---|---|---|---|
| `public/art/badge.png` | `landing-page.png` | **TEMP** | Winged skull-star golden badge. Replace with transparent PNG or SVG, at least 2× display size (≥ 440×400px), anti-aliased black stroke. |
| `public/art/landing/telescope.png` | `landing-page.png` | **TEMP** | Observatory telescope on tripod with skull-star star emblem. Replace with transparent PNG or SVG, ≥ 500×600px. |
| `public/art/about-hero.webp` | `about.png` (x ≥ 700) | **TEMP** | Robot astronomer hero on pedestal with holographic planetary spheres. Replace with transparent/edge-faded WebP or PNG, ≥ 1400×1024px. |
| `public/art/timeline-card.webp` | `timeline.png` (left card) | **TEMP** | Collectible character card featuring Colt with money fan and skull barcode ticket. Replace with transparent WebP/PNG, ≥ 800×1300px. |
| `public/sponsors/gamecloud.png` | `sponsor.png` | **TEMP** | GameCloud Technologies Private Limited logo. Replace with vector SVG or high-res transparent PNG. |
| `public/sponsors/gamedoora.png` | `sponsor.png` | **TEMP** | Gamedoora platform sponsor logo. Replace with vector SVG or high-res transparent PNG. |
| `public/art/pattern-blue.svg` | Rebuilt vector | **FINAL** | Repeating SVG tile (skull, star, revolver, potion flask) for all inner screen blue radial backgrounds. |
| `public/art/pattern-violet.svg` | Rebuilt vector | **FINAL** | Repeating SVG tile (ringed skull planet, 4-point sparkle, star) for landing sky. |

## Important Rules for Replacing Assets
1. Keep exact file names and paths intact (`public/art/...` and `public/sponsors/...`).
2. Assets must be transparent PNG, WebP, or SVG.
3. No components depend on a crop's exact pixel dimensions; UI scales responsively.
