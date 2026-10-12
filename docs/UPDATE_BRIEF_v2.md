# GENESIS 2026 — Update Brief v2

**Fixes · motion · responsive pass · new features · backend plan**

**Audience: the Antigravity agent.** This document amends `docs/BRIEF.md` (v1). Read v1 first. Where this document disagrees with v1, this document wins. Anything not mentioned here stays as v1 says.

Kickoff prompt for whoever runs Antigravity (paste as is):

```text
Read docs/BRIEF.md and docs/UPDATE_BRIEF_v2.md completely. Start with Phase U0:
write the failing tests that reproduce the navigation bugs and show me the failures.
Then continue phase by phase. After every phase run the dev server and screenshot at
1280x600, 390x844 and 1440x1024, and show me. Do not stop to ask questions unless you
are truly blocked: use the defaults in section 9 and list them under Assumptions.
```

---

## 0. Working rules for this update

1. **Verify before fixing.** The "likely cause" entries in §1 are hypotheses drawn from a phone recording of `localhost:3000`. Confirm each one in the code and report the real cause in the walkthrough.
2. **Tests first.** In Phase U0, write the Playwright tests from §10 that reproduce N-01 to N-06. They must fail on the current build. Show the failures, then fix.
3. **Same budgets, same bans.** The v1 §9 budgets, v1 §7 motion rules and the v1 "Do not" list still apply, except for the amendments in §2.
4. **Never invent facts** (v1 rule 4). §1.3 lists text in the current build that already breaks this rule.
5. **After each phase** run the dev server and screenshot at **1280×600** (a short laptop window), 390×844 and 1440×1024, and show them.
6. **Don't stop to ask** unless truly blocked. Use the defaults in §9 and list them under Assumptions.
7. Give every change an ID (N-01, A-03, F-02 …) in commit messages and in the final walkthrough.

---

## 1. Audit of the current build

Source: a 34-second screen recording of the site running at `localhost:3000`, filmed from a phone, so it is low resolution. Treat anything pixel-level as "verify in the code".

### 1.1 What works (keep as is)

Landing composition, wordmark, badge and REGISTER with the "Registrations opening soon!" toast; the menu drawer (items turn yellow on hover, REGISTER inside); the About card and hero art; the Timeline with four cards, info dots and the stage modal; prize badges in both windows; the staggered sponsor windows with logos; the FAQ accordion with the "GOT QUESTIONS?" header.

### 1.2 Defects

| ID | Where | What the recording shows | Likely cause | Fix |
|---|---|---|---|---|
| N-01 | About, FAQs, any scrolling inner screen | After scrolling, the Back and Home tabs and the banner are gone. On About, nothing navigational is visible at all; the only way out is the browser's own back button. | Top bar is in normal flow, or it is `position: fixed/sticky` but has an ancestor that breaks it (see §3.1) | §3.1 |
| N-02 | Every inner screen | The menu drawer exists only on the landing page, so going from Timeline to Prize Pool means Home → hamburger → Prize Pool. This is the "I have to restart from the home screen" feeling. | v1 §4.3 said "landing only" | §3.2 |
| N-03 | Back button | Behaviour on deep links, refresh and after menu jumps is unverified. v1's rule ("previous page if on this site, else `/`") is easy to get wrong with `document.referrer`. | Unknown | §3.3 |
| N-04 | Landing toast | "Registrations opening soon!" is a dead end: no next action. | v1 §4.6 | §3.6, §7 (B1) |
| N-05 | FAQs | Two nested scrollers (the page and the window body), so scrolling inside the window feels stuck and the page can't scroll back up to the top bar. The red X "goes back", which is surprising. | v1 §5.7 | §3.5 |
| N-06 | Menu, modals, lightbox | Overlays don't own a history entry, so on Android the hardware Back button probably leaves the page instead of closing the overlay (verify). | Overlay state lives only in React state | §3.4 |
| R-01 | Timeline, Sponsors, Prize Pool | On a short laptop window (browser chrome plus a bookmarks bar leave roughly 600px of height) the lower timeline cards, the second sponsor window and the VR TRACK window start below the fold with no hint to scroll. | Scale unit is width-only on scrolling screens | §4 |
| V-01 | Landing | The violet skull-planet pattern isn't visible in the recording and the platform looks flatter than the mockup. | May just be recording quality. Verify at 8–12% opacity per v1 §3.4 | verify only |

### 1.3 Content that appears to be invented

The recording shows text that is not in v1 and was not supplied by the club:

- Timeline stage names "Registrations Open", "Idea Submission", "The Hackathon Showdown", "Grand Finale & Demos", each with a one-line summary.
- The Stage 03 modal: a venue line that appears to read "Ramanujan Hall, AIT Pune", and a description ("On-site sprint with mentorship from industry game leads, VR testing gear, and midnight power-ups.").
- FAQ answers: only one answer was visible in the recording (the "Where can I see the prizes?" answer, which extends the one v1 supplied). Check all the others.

**Action:** replace anything the club has not confirmed with `TODO:` strings (v1 §6) so `check:content` blocks the production build. A wrong venue on an official event page is worse than a blank one.

---

## 2. Amendments to v1

| ID | v1 says | v2 says | Why |
|---|---|---|---|
| A-01 | v1 §4.2: top bar "stays pinned" (not achieved in the build) | Pinned on every inner screen, and it gains a Menu button | N-01, N-02 |
| A-02 | v1 §4.3: menu drawer is landing-only | One global drawer reachable from every screen | N-02 |
| A-03 | "Do not use cookies or localStorage" | Cookies stay banned. `localStorage` is allowed only for non-personal UI preferences (sound on/off, "install prompt dismissed", "announcement dismissed"), always inside try/catch, never for personal data. **Needs the owner's OK; default = yes.** | F-05, F-06, F-07 |
| A-04 | v1 §9: "no API calls on page load" | Allowed: at most one non-blocking, edge-cached `GET /api/status` after the browser is idle, and only when `NEXT_PUBLIC_BACKEND=on`. Failure is silent and falls back to build-time values. | §7 |
| A-05 | v1 §12: CSP | Add `https://challenges.cloudflare.com` to `script-src` and `frame-src` on routes that render a form (Cloudflare Turnstile), loaded on demand when the form opens | §7 |
| A-06 | v1 §5.7: FAQ red X = Back | X still goes back, now labelled "Close FAQs"; the window only scrolls internally when it must (§3.5) | N-05 |

---

## 3. Navigation overhaul (fixes N-01 to N-06) — Phase U1

### 3.1 Pin the top bar (N-01, A-01)

Two likely culprits. Check both.

1. **A transformed ancestor.** v1 §8 puts the entry animation in a shared `template.tsx` (opacity, `scale`, `translateY`). Any ancestor with `transform`, `filter`, `perspective`, `contain: paint` or `will-change: transform` becomes the containing block for `position: fixed` children, so the "fixed" bar scrolls away with the content. **Fix:** the entry animation applies to the *content region only*. The top bar must not have an animated, transformed or filtered ancestor.
2. **An `overflow` ancestor.** v1's "never allow horizontal scroll" tempts people to put `overflow-x: hidden` on `html`, `body` or a wrapper. That silently breaks `position: sticky`. **Fix:** use `overflow-x: clip` (it doesn't create a scroll container).

Implementation:

- `position: fixed; top: 0; left: 0; right: 0;` with height `calc(var(--topbar-h) + env(safe-area-inset-top))`. The bar has `pointer-events: none` and its buttons have `pointer-events: auto`, so the empty gap never blocks scrolling or taps.
- The content region gets `padding-top` equal to the bar height. The background stays fixed (v1 §4.1).
- **Compact mode:** after ~48px of scroll, scale the bar to ≈ 0.85 (transform only), driven by an IntersectionObserver sentinel, not a scroll listener.
- About has no banner (v1 §5.2) but still gets the pinned Back / Home / Menu cluster. Its stacked title scrolls with the content.

**Done when:** on every inner route at every viewport in §4.6, after scrolling to the very bottom, Back, Home and Menu are still inside the viewport.

### 3.2 One menu everywhere (N-02, A-02)

- Mount `MenuDrawer` once in the root layout through a small context. Keep it dynamically imported. Prefetch it on the first pointer or focus event on any menu button, and on idle.
- Top bar right cluster: **[Home] [Menu]**. On phones both are 44×48. At ≤ 380px the banner shrinks to `min(40vw, 150px)`; remove its skew only if the text would otherwise fall below 18px.
- The drawer marks the current screen with `aria-current="page"` and a small "YOU ARE HERE" tag. Tapping it just closes the drawer.
- Everything in v1 §4.3 still holds: focus trap, Esc, backdrop click, scroll lock, no blur.

### 3.3 A Back button that can't strand anyone (N-03)

Rule: **Back goes to the previous page only if that page is inside this site; otherwise it goes to `/`.** Never use `document.referrer`.

- Keep a depth counter inside `history.state` under the key `gx`. Merge into the existing state; never replace Next's own keys, and pass no URL.
  - On load: `depth = history.state?.gx ?? 0`; write it back if it was missing.
  - After each client navigation that isn't a popstate: `depth = previous + 1`; write it back.
  - On `popstate`: `depth = history.state?.gx ?? 0`.
  - `canGoBack = depth > 0`. Back button: `canGoBack ? router.back() : router.push('/')`.
- If this proves flaky with the App Router, use the Navigation API's `navigation.canGoBack` where it exists and fall back to an "internal navigation has happened" flag. Document which approach you chose.
- The direction-aware entry animation (§5) reads the same depth: forward slides in from the right, back from the left.

### 3.4 Overlays own a history entry (N-06)

The menu, modals and lightbox keep their state in the URL hash (`#menu`, `#m=stage-3`, `#photo=14`). That way the **Android hardware Back button and the browser Back button close the overlay instead of leaving the page**, and the link is shareable.

- Open = push the hash. Close via X, Esc or backdrop = `history.back()` if this session pushed the hash, otherwise replace the hash away.
- Hash values must not match any element id (so nothing scrolls).
- Opening a link that already contains `#m=stage-3` opens that modal on load.
- Only one overlay at a time.

### 3.5 FAQ window and nested scrolling (N-05, A-06)

- Phones: the FAQ window grows with its content and the page scrolls. No inner scroller.
- Desktop: keep the inner scroller only when the content is taller than `100dvh − bar − footer`, with `overscroll-behavior: contain`. Don't render a second scrollbar when everything fits.
- Question ids are slugs of the question text. `/faqs/#q=how-do-i-register` opens that question on load.

### 3.6 No dead ends anywhere

- **Next / Previous rail** at the bottom of every inner screen: two chunky tabs, "◀ ABOUT" and "TIMELINE ▶", following the menu order (About → Timeline → Prize Pool → Memories → Sponsors → FAQs). The first screen's previous is Home; the last screen's next is REGISTER (yellow).
- **Toast with an action.** "Registrations opening soon!" gets a button: **NOTIFY ME** when the backend is on (opens the form in §7, B1), otherwise **SEE FAQs** (links to `/faqs/#q=how-do-i-register`). The toast stays `role="status"`, the action is a real `<button>`/link, and the toast does not auto-dismiss while it has focus.
- `not-found.tsx` and `error.tsx` both render the full top bar and menu, so a crash never strands anyone. `error.tsx` has a **TRY AGAIN** button.
- After each route change: scroll to top (unless there is a hash), move focus to the `<h1>` (`tabIndex={-1}`), and announce the new title in a visually hidden `aria-live="polite"` region.
- Prefetch: menu routes on first menu open, rail links on idle.

---

## 4. Responsive overhaul — Phase U2 (fixes R-01 and more)

### 4.1 Scale with the container, not only the viewport

Inside windows, cards and the timeline, replace `calc(var(--u) * N)` with container-query units: put `container-type: inline-size` on each window and card and size the children with `cqw`, clamped. This stops badges, logos and cards overflowing at odd viewport sizes. The landing scene keeps the v1 `--u` rule, because it must always fit the viewport.

### 4.2 Short viewports (R-01)

`@media (min-width: 900px) and (max-height: 760px)`:

- The top bar and window headers lose about 15% of their height; badges scale to about 0.8×.
- **Prize Pool:** at ≥ 1100px wide, show the two windows side by side so every prize is visible without scrolling.
- **Timeline:** compute card size and bar position from the available height so both card rows are visible. If they can't fit, the screen scrolls and shows the scroll hint (§4.4).
- **Sponsors:** reduce the diagonal stagger so both windows appear within about 1.3 screens.

### 4.3 Phone landscape (≤ 500px tall)

The landing scene still fits and REGISTER stays visible. The menu drawer scrolls inside itself. The top bar stays in compact mode. FAQ content and modals scroll inside themselves.

### 4.4 Scroll affordance

When an inner screen is taller than the viewport, show a bouncing "▼ MORE" chip and a bottom fade. Hide both after the first scroll or when the end is reached. Under reduced motion the chip stays but does not bounce.

### 4.5 Touch and input

- Hover-only effects live inside `@media (hover: hover)`. Touch devices get pressed states instead (no sticky hover).
- `touch-action: manipulation`, a custom `-webkit-tap-highlight-color`, and every target ≥ 44×44px.
- `navigator.connection?.saveData` true, or `prefers-reduced-data: reduce`, sets `data-motion="lite"` and skips optional art.
- Use `svh` for the landing's first layout and `dvh` for fixed elements, so mobile browser bars don't cause jumps.

### 4.6 Test matrix (extends v1 §14)

360×640 · 390×844 · 412×915 · 430×932 · 768×1024 · 820×1180 · 844×390 · 1024×768 · **1280×600** · 1366×768 · 1440×900 · 1920×1080 · 2560×1440. Also check 390 and 1440 wide at 200% zoom. Save screenshots to `docs/qa/<route>-<viewport>.png`.

---

## 5. Animation upgrade — Phase U3

Same rules as v1 §7: animate only `transform` and `opacity`; reduced-motion and `data-motion="lite"` switch loops, parallax and bounces off; every loop pauses while the tab is hidden. Loops are CSS only; motion JS stays inside the v1 budgets.

| Where | Add |
|---|---|
| **Global** | Direction-aware screen transitions (§3.3): forward enters from the right, back from the left, ≈ 280ms with `--ease-out`; windows overshoot with `--ease-pop`. The transform applies to the content region only (§3.1). |
| **Global** | Button "jelly" press (scale 1 → 0.96 → 1.04 → 1 over ≈ 180ms). A light shine sweep across the yellow REGISTER every ≈ 6s (pseudo-element, transform only). |
| **Global** | Tap burst: six tiny stars fly out of a 3D button on press (CSS, pooled elements, one burst at a time). Optional haptics: `navigator.vibrate(8)` on primary buttons (Android only; off under reduced motion). |
| **Top bar** | Back and Home tabs slide in from their own edges with an 80ms stagger. The banner drops in with a bounce. |
| **Menu drawer** | Panel overshoots in; items pop in staggered 40ms; icons wobble on hover and focus; backdrop fades. |
| **Landing** | Shooting star every 8–15s (random per visit). Moon glow breathes (opacity, 8s). Telescope scans slowly (±2°, 10s) and tilts toward the pointer. Planet ring wobble. Badge floats 6px with a periodic sparkle. Wordmark letters ripple once on load and again on hover. **Tap the badge 5 times: skull-star rain** (12 SVG stars, 2s). |
| **About** | Card text reveals by paragraph (not per word). Robot floats; holographic spheres orbit along CSS ellipses; sparkles twinkle. |
| **Timeline** | Bar draws, nodes pop in sequence, cards are "dealt" from the collectible card into place (translate, rotate, opacity; 120ms stagger). Active node pulses. A **progress fill** runs along the bar up to the current stage by date (hidden while dates are `TODO`). LIVE NOW tag glows. |
| **Prize Pool** | Badges drop 3rd → 2nd → 1st. Shine sweep on tap. **Coin and sparkle burst on 1st place.** Pointer tilt on desktop (`perspective`, ±6°). The window's X rotates 90° when collapsed. |
| **Sponsors** | Windows slide in from their own corners. Logo plaques float 3px in a slow, offset loop; hover lifts the plaque. |
| **FAQs** | Rows slide down with a small overshoot; chevron flips; the open row's header lights up. |
| **Memories** | Cards deal in with a stagger (first screenful only). The lightbox opens with a scale-from-thumbnail transform computed from the thumbnail's `getBoundingClientRect()` (no layout-animation library). Swipe with inertia; neighbours preloaded. |

**Motion QA:** record a Performance trace with 4× CPU slowdown. No long task over 50ms during an entrance; zero layout shift; `will-change` removed after each animation. With `prefers-reduced-motion: reduce`, no infinite animation may be running:
`document.getAnimations().filter(a => a.effect?.getComputedTiming().iterations === Infinity).length === 0`.

---

## 6. New features that need no backend — Phase U4

| ID | Feature | Behaviour |
|---|---|---|
| F-01 | **Prize total counter** | "TOTAL PRIZE POOL" on Prize Pool, computed from `prizeTracks` (17500 + 15000 + 12500 + 10000 + 5000 = ₹60,000). Counts up once when scrolled into view; under reduced motion it shows the final value. Uses `formatPrize()`. |
| F-02 | **Countdown and event-day mode** | Once `event.startISO` is a real date, the landing shows "STARTS IN 12D 04H". During the event it switches to "LIVE NOW → Timeline", and after `endISO` to "THANKS FOR PLAYING → Memories". Evaluated in Asia/Kolkata. Hidden while dates are `TODO`. |
| F-03 | **Share** | Web Share API button in the menu and footer; fallback copies the link and shows a toast. Plus an **"Invite your squad"** WhatsApp link (`https://wa.me/?text=…` containing the site URL), since the audience is mostly on phones in India. |
| F-04 | **Add to calendar** | `.ics` generated client-side for the whole event and for each stage in its modal. Hidden until real dates exist. |
| F-05 | **Sound effects** (v1 §17) | Muted by default, toggle in the menu, lazy-loaded after the first interaction, preference kept in `localStorage` (A-03). |
| F-06 | **Install as an app** | A tiny hand-written service worker caches the shell, fonts and visited routes, registered after load. An "Add to Home Screen" card in the menu (Android `beforeinstallprompt`; short instructions for iOS). Offline: cached pages plus a "You're offline" toast. |
| F-07 | **Announcement bar** | `src/content/announcements.ts` feeds a slim dismissible strip under the top bar for last-minute news. Later fed by `/api/announcements` (§7). Dismissal kept in `localStorage`. |
| F-08 | **"Now / Next up" pill** | In the menu: the current or next timeline stage, from the dates. Hidden while dates are `TODO`. |
| F-09 | **Sponsor CTA** | "BECOME A SPONSOR" on Sponsors (`mailto:` from `contactEmail`). Hidden until set. |
| F-10 | **Memories extras** | Photo share link (hash link, §3.4) and a "download" link to the original-size image in the lightbox. |

**Not now:** language toggle (EN / हिन्दी / मराठी: needs a Devanagari font subset and translated copy, and will strain the font budget); AR badge `<model-viewer>` (v1 §17; needs a `.glb`); a team-finder board (needs a backend plus moderation).

---

## 7. Backend plan

### 7.0 Principles (inherit v1 §9 and §12)

- Pages stay static and CDN-served. The backend is never on the page-load path, and every backend feature has a **no-backend fallback** (a kill switch).
- Serverless only. Every write endpoint is validated (Zod, strict), rate-limited, idempotent and bot-protected (honeypot plus Turnstile).
- Collect the minimum personal data, keep it out of logs, and delete it on a schedule.
- v1 said "do not build a custom registration backend unless I ask". **This section is a plan.** Nothing in §7 beyond B1 is built until §9 decision 1 is answered.
- `NEXT_PUBLIC_BACKEND=on|off` is the master switch. `off` must behave exactly like v1 plus §3–§6.

### 7.1 Options compared

| Option | Setup | Admin for non-coders | Spike-proof? | Cost | Watch out for |
|---|---|---|---|---|---|
| **Cloudflare Pages + Functions + D1** (recommended) | Medium. One vendor; `/api/*` is same-origin | Needs a small admin page (§7.6) behind Cloudflare Access | Yes: runs at the edge and the static site is unaffected | Free tier is usually enough for a college event. Check current limits and whether a card is required | D1 is SQLite-style SQL; some learning curve |
| **Supabase** (Postgres, Auth, Edge Functions) | Easy | Best: built-in table editor and CSV export | Good | Free tier exists. Check current limits and its inactivity-pausing policy | The browser talks to the Supabase host (CSP `connect-src`); row-level security must be exactly right; idle free projects may pause |
| **Firebase** (Firestore, Cloud Functions) | Medium | Console is workable | Good | Functions typically need a billing account. Check | Many students can't attach a card |
| **Google Sheet + Apps Script** | Easiest | Excellent (everyone knows Sheets) | **No.** Slow and quota-limited | Free | Fine for tens of "notify me" sign-ups; not for a registration rush |

**Recommendation: Cloudflare.** Functions run on the same origin as the static export (no CORS, no CSP change beyond Turnstile), spikes hit the edge instead of your code, and v1 already ships a `_headers` file for it. Pick Supabase instead if the club wants to manage registrations in a spreadsheet-like UI and nobody will write SQL.

### 7.2 Architecture (default)

```text
Browser ──► CDN (static out/)                     pages, art, fonts
   │
   └─ only on a form submit, or one deferred status read
      ──► /api/*  (Pages Functions, same origin)
            ├─ validate        Zod schemas shared with the form UI (src/lib/schemas.ts)
            ├─ protect         Turnstile verify + honeypot + rate limit
            ├─ store           D1 (SQLite): registrations, notify_signups, ...
            └─ email           transactional email provider (API key as a secret)

Admin ──► /admin (static page, noindex) ──► /api/admin/*  (Cloudflare Access JWT verified in the function)
```

Secrets live only in the host's secret store, never in `NEXT_PUBLIC_*`.

### 7.3 Data model (D1 / SQLite starting point)

```sql
-- migrations/0001_init.sql
CREATE TABLE registrations (
  id            TEXT PRIMARY KEY,                 -- ULID, generated server-side
  idem_key      TEXT NOT NULL UNIQUE,             -- from the Idempotency-Key header
  track         TEXT NOT NULL CHECK (track IN ('main', 'vr')),
  team_name     TEXT NOT NULL,
  leader_name   TEXT NOT NULL,
  leader_email  TEXT NOT NULL,
  leader_phone  TEXT NOT NULL,
  college       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'confirmed'
                CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  checked_in_at TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (track, leader_email)
);

CREATE TABLE team_members (
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL,
  name            TEXT NOT NULL,
  email           TEXT,
  PRIMARY KEY (registration_id, position)
);

CREATE TABLE notify_signups (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  consent_at TEXT NOT NULL,
  source     TEXT NOT NULL CHECK (source IN ('toast', 'menu', 'footer')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE announcements (
  id        TEXT PRIMARY KEY,
  text      TEXT NOT NULL,
  link      TEXT,
  starts_at TEXT NOT NULL,
  ends_at   TEXT
);
```

Later (B3): `scores`, `certificates`, `contact_messages` (30-day retention). Add only the columns a feature needs.

### 7.4 API contract

| Endpoint | Method | Protection | Rate limit per IP (starting point) | Edge cache | Notes |
|---|---|---|---|---|---|
| `/api/status` | GET | public | none | 15 s | `{ registrationOpen, spotsLeft? }`; allowed by A-04 |
| `/api/announcements` | GET | public | none | 30 s | tiny JSON; feeds F-07 |
| `/api/notify` | POST | Turnstile + honeypot | 5 / min | none | email + consent; idempotent by email |
| `/api/contact` | POST | Turnstile + honeypot | 3 / min | none | emails the club inbox; stored 30 days |
| `/api/register` | POST | Turnstile + honeypot + `Idempotency-Key` | 3 / min | none | see §7.5 |
| `/api/scoreboard` | GET | public | none | 10 s | event day (B3) |
| `/api/certificate/:id` | GET | unguessable id | 30 / min | 1 h | B3 |
| `/api/admin/*` | any | Cloudflare Access JWT verified in the function | none | `no-store` | see §7.6 |

- Errors: `{ "error": { "code": "validation_failed", "fields": { "leader_email": "invalid" } } }` with HTTP 400, 409, 413, 429 (with `Retry-After`) or 503.
- `POST /api/register` success: `201 { id, status: "confirmed" | "waitlist", ticketUrl }`. Replaying the same `Idempotency-Key` returns the original response with `200`.
- Max body 8 KB; `application/json` only; same-origin only; strict schemas (unknown fields rejected).
- Rate limiting: Cloudflare's rate-limiting feature (rules or the Workers binding; check what the free plan offers), with a small counter table as a fallback. Any IP is stored only as a salted hash that rotates daily.

### 7.5 Registration-day spike plan

- Static pages absorb the traffic. Only the final POST reaches a function.
- **Atomic capacity:** one conditional `INSERT … SELECT … WHERE (SELECT COUNT(*) …) < cap` decides confirmed versus waitlist. Never read-then-write.
- **Idempotency:** the form generates a UUID when it opens and sends it as `Idempotency-Key`. The unique constraint makes double taps and retries safe.
- **Kill switch and fallback:** `REGISTRATION_OPEN=false` turns REGISTER back into the toast without a redeploy. `FALLBACK_FORM_URL` is what REGISTER opens if `/api/register` fails twice in a row.
- **Email never blocks:** write the row first, send the email afterwards (`waitUntil` or a queue). A failed email never fails the registration.
- **Load test** with `loadtest/k6.js` on the real host before announcing a date: ramp the static routes to 10× the expected concurrent users and `POST /api/register` to 2–3×.

### 7.6 Admin (B2)

`/admin` is a static page excluded from the sitemap, robots and every menu, protected by Cloudflare Access (an allow-list of 2–3 club emails). Every `/api/admin/*` function also verifies the Access JWT itself. Features: registrations table with search and filter; CSV export; toggle registration open/closed; post and expire announcements; check-in (QR scan with the browser's `BarcodeDetector` where available, manual code entry as the fallback); enter scores (B3).

### 7.7 Privacy and compliance (India)

*This is not legal advice. Ask the college's administration or legal contact to review before launch.*

- India's DPDP Act applies to digital personal data. It treats anyone under 18 as a child and requires verifiable parental or guardian consent before processing a child's data. Many first-year students are 17, so add an age-confirmation step ("I'm 18 or older, or I have a parent or guardian's consent") and ask the college how it wants under-18s handled. Check the current commencement dates and rules.
- Collect only what registration needs: team name, leader name, email and phone, college, track, member names. No Aadhaar or ID uploads, no photos, unless a real need is decided.
- Show a notice at the point of collection (what, why, how long, who to contact = `contactEmail`). Consent for reminders is an **unticked** checkbox, and every email has an unsubscribe link. There must be a working erasure path (email the club; an admin deletes the row).
- Retention default: delete registrations and notify sign-ups 90 days after the event, and say so in the notice.
- No personal data in logs. Backups: a scheduled export to storage you control, access limited to the allow-list; rehearse one restore.
- Add a static `/privacy` page (text from `src/content/privacy.ts`) linked from the footer and from every form.

### 7.8 Rollout

| Phase | Scope | Size | Needs |
|---|---|---|---|
| B0 | Today: static site, REGISTER opens an external link | — | — |
| B1 | Notify-me (email + consent), contact form (FAQ #10), `/api/status`, `/api/announcements`, `/privacy`, kill switch | S–M | Host decision, an email-provider account, Turnstile keys |
| B2 | In-house registration with team members, capacity and waitlist, confirmation email with a ticket code/QR, admin page, CSV export | M–L | §9 decisions 1, 3, 4 |
| B3 | Event day: check-in scanner, scoreboard, certificates with a `/verify/<id>` page | M | Dates, certificate design |
| B4 | Memories uploads with a moderation queue | M | B2 admin |

Each phase ships behind its own flag and leaves v1 behaviour intact when it is off. Build B1 disabled-by-default so it is ready when credentials exist.

### 7.9 Form UI rules (B1 and B2)

Forms use the v1 Modal/Window style. Inputs: 48px tall, `--panel-inset` background, 2px darker border, 10px radius, **visible labels** (never placeholder-only), inline errors with ≥ 4.5:1 contrast, correct `autocomplete` and `inputmode`, and a visible success state ("You're in, Brawler!"). The Turnstile widget loads only when a form opens (A-05). The honeypot is visually hidden and not focusable. Check Cloudflare's current Turnstile CSP guidance when writing the header.

### 7.10 Backend tests

Unit tests for every schema. Local integration tests (Wrangler's local mode) for every endpoint, including: replayed idempotency key; capacity boundary (cap−1, cap, cap+1 in parallel); honeypot filled; bad Turnstile token; body over 8 KB (413); wrong content type; rate limit (429 with `Retry-After`). Plus the k6 run from §7.5, `npm audit`, a check that logs contain no personal data, and Lighthouse with `NEXT_PUBLIC_BACKEND=on` on the static routes.

---

## 8. Content integrity and risks

- **§1.3:** replace unconfirmed text with `TODO:` strings.
- **Artwork rights.** The mockups use Brawl Stars–style art (the badge, the characters and the UI language). For a public, sponsored event that can be an IP problem. Before launch, read Supercell's fan-content policy and/or ask for permission, or replace the character art with original art. v1 already keeps all art in `public/art/` with TEMP flags, so swapping is cheap.
- **Sponsor logos:** get written permission to display them, and replace the TEMP crops with the official files.
- **Memories photos:** confirm the club has the right to publish them, and remove any photo when a person asks.

---

## 9. Decisions needed (defaults used if unanswered)

| # | Decision | Default | Why it matters |
|---|---|---|---|
| 1 | Should registration happen **inside this site**, or keep sending people to an external form? | Keep the external `registrationUrl` for launch; build B1 only; B2 stays unbuilt | Decides whether a database, an admin page and privacy work are needed |
| 2 | Where will the site be hosted? | Cloudflare Pages | Backend choice, `_headers`, same-origin API |
| 3 | Is there a registration fee or payment? | No payment code at all | Payments add UPI/gateway integration, refunds, reconciliation |
| 4 | Team size, tracks, caps, eligibility | Config-driven; every value `TODO` | Form validation and capacity logic |
| 5 | Allow `localStorage` for UI preferences only (A-03)? | Yes | Sound toggle, dismissals |
| 6 | Who may use `/admin`? | 2–3 emails from an environment variable | Access control |
| 7 | WhatsApp community link, socials, contact email | `TODO` | Footer, menu, notify-me, privacy contact |
| 8 | How will club members edit content later? | Keep `src/content/*.ts` and the README; optionally a Google Sheet that syncs into those files on a schedule | Non-coder editing |
| 9 | Data retention after the event | 90 days, then delete | Privacy notice and the delete job |
| 10 | Languages | English only | Font budget and copy |
| 11 | Keep the Brawl Stars–style art or replace it? | Keep for now, flagged TEMP | IP risk (§8) |

---

## 10. Tests to write in Phase U0 (Playwright)

Run each across the viewports in §4.6 unless noted.

1. `bar-stays-pinned`: on every inner route, scroll to the very bottom; Back, Home and Menu are in the viewport (`toBeInViewport()`).
2. `menu-from-everywhere`: on every inner route open the menu; each item reaches its route; the current item has `aria-current="page"`.
3. `back-after-deep-link`: open `/faqs/` directly; Back lands on `/`.
4. `back-chain`: `/` → About → Timeline → Back → About → Back → `/`. The landing page has no Back.
5. `back-after-reload`: reload on `/prize-pool/`; Back lands on `/`.
6. `hardware-back-closes-overlay`: open the menu, a timeline modal and a lightbox in turn; `page.goBack()` closes the overlay and stays on the page. Opening `/timeline/#m=stage-3` directly shows that modal.
7. `rail-links`: each inner route shows the right previous and next tabs; About's previous is Home; FAQs' next is REGISTER.
8. `no-horizontal-scroll`: `document.documentElement.scrollWidth <= window.innerWidth` on every route.
9. `focus-after-navigation`: focus is on the `<h1>` after every route change and the live region announces the title.
10. `reduced-motion`: emulate `reduce`; no infinite animations are running (§5).
11. `register-without-url` and `register-with-url`: toast plus action versus a new tab with UTM parameters (v1 §5.1).
12. `axe`: zero serious or critical issues on every route, also with the menu open and with a modal open.

Tests 1–6 **must fail on the current build** before the fixes.

---

## 11. Phases and definition of done

| Phase | Work |
|---|---|
| U0 | Write the §10 tests and show tests 1–6 failing; confirm each "likely cause" in the code; replace invented text (§1.3) with `TODO:` |
| U1 | Navigation overhaul (§3) |
| U2 | Responsive overhaul (§4) |
| U3 | Animation upgrade (§5) |
| U4 | Features without a backend (§6) |
| U5 | Backend B1 (§7), built but disabled by default |
| U6 | Backend B2, **only if** decision 1 says in-house registration |
| U7 | Hardening: v1 §14 gates plus the new tests; update README, `docs/DEPLOYMENT.md` and `docs/CONTENT_CHECKLIST.md` |

**Done when:**

- All §10 tests pass at every viewport, and N-01 to N-06 and R-01 have before/after screenshots.
- No horizontal scroll at any width in §4.6.
- The v1 §14 quality gates still pass: Lighthouse mobile Performance ≥ 90 and Accessibility, Best Practices and SEO ≥ 95; zero console errors; axe clean; budgets met.
- Reduced-motion and `data-motion="lite"` modes are checked.
- `check:content` fails the production build while any `TODO` remains, and the §1.3 text is gone.
- With `NEXT_PUBLIC_BACKEND=off` the site behaves like v1 plus §3–§6.

---

## 12. Walkthrough to deliver

Before/after screenshots for N-01 to N-06 and R-01; a list of what changed per ID; test output; Lighthouse and axe results; the **Assumptions** list (including every §9 default used); the deliberate deviations from v1 and the mockups; the TEMP assets; the remaining `TODO`s; and the status of each backend phase.
