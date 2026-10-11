# GENESIS 2026 — Official Website

Official website for **GENESIS 2026 (Fifth Edition)**, the flagship annual gaming & XR hackathon organized by the **GDXR Club (AR/VR Club) of Army Institute of Technology (AIT), Pune**.

Designed in a Brawl-Stars-style mobile game lobby UI with chunky 3D buttons, outlined typography, cosmic observatory scenery, and blazing-fast static-export hosting.

---

## 🚀 Quick Start for Developers & Club Members

### Requirements
- **Node.js** v20+ (LTS)
- **npm** v10+

### Installation & Local Preview

```bash
# 1. Clone repository and install dependencies
npm install

# 2. Run local development server
npm run dev
# Opens at http://localhost:3000

# 3. Build static production bundle
npm run build

# 4. Preview exported build locally
npm run start
```

---

## 📝 How to Update Site Content (No Coding Required!)

All editable event details live in plain TypeScript files under `src/content/`. Anyone on the team can update these files without modifying any UI components:

| What to Update | File to Edit | Instructions |
|---|---|---|
| **Registration Link** | `.env.local` or `src/content/site.ts` | Set `NEXT_PUBLIC_REGISTRATION_URL=https://...`. If left empty, tapping REGISTER automatically shows *"Registrations opening soon!"*. |
| **Event Dates & Venue** | `src/content/site.ts` | Update `startISO`, `endISO`, `venue`, and college information. |
| **Prizes & Amounts** | `src/content/prizes.ts` | Update rank awards. The total prize pool (₹60,000) is calculated automatically! |
| **Sponsors & Logos** | `src/content/sponsors.ts` | Add sponsor companies, URLs, and place logos in `public/sponsors/`. |
| **Timeline Stages** | `src/content/timeline.ts` | Edit dates, venue, stage titles, and details for each phase. |
| **FAQs** | `src/content/faqs.ts` | Add or update question & answer pairs in the accordion. |
| **About Copy** | `src/content/about.ts` | Event story and club introduction text. |

---

## 📸 How to Add Photos to Memories

1. Drop your event photos into `public/memories/<year>/` (for example, `public/memories/2025/photo1.jpg`).
2. Run the image optimization pipeline:
   ```bash
   npm run images
   ```
3. This automatically optimizes photos, generates responsive formats, and updates `src/content/memories.generated.json`.

---

## 🎨 How to Swap Art Assets

Art assets are stored in `public/art/`:
- `public/art/badge.png`: The winged skull-star badge.
- `public/art/about-hero.webp`: Robot astronomer hero illustration.
- `public/art/timeline-card.webp`: Collectible character card.
- `public/art/landing/telescope.png`: Observatory telescope.

See [`public/art/README.md`](file:///public/art/README.md) for exact replacement dimensions and guidelines.

---

## 🛡️ Content Validation Guard

Before releasing or deploying to production, run:
```bash
npm run check:content
```
This scans all content files and reports any remaining `TODO` placeholders in [`docs/CONTENT_CHECKLIST.md`](file:///docs/CONTENT_CHECKLIST.md), ensuring no unfinished text is ever pushed live by mistake.

---

## 🚢 Deployment

The site exports as a purely static directory in `out/`. See [`docs/DEPLOYMENT.md`](file:///docs/DEPLOYMENT.md) for step-by-step instructions on deploying to **Cloudflare Pages**, **Vercel**, or **Netlify**.

---

## 🛠️ Available Scripts

- `npm run dev`: Start Next.js local dev server.
- `npm run build`: Compile and generate static export to `out/`.
- `npm run start`: Serve the exported `out/` folder locally on port 3000.
- `npm run typecheck`: Run TypeScript compiler checks.
- `npm run test`: Run Vitest unit test suite.
- `npm run images`: Process memories photos and regenerate metadata.
- `npm run check:content`: Check content files for pending `TODO` items.
- `npm run screenshot`: Capture automated desktop and mobile screenshots.
