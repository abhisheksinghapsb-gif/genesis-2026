# GENESIS 2026 — Backend Architecture & Integration Plan (`docs/BACKEND_PLAN.md`)

This document details the backend strategy, data models, edge API endpoints, and implementation recommendations for GENESIS 2026, aligned with Section 9 and Section 14 of the V2 Master Specification.

---

## 1. Architectural Principle

The GENESIS 2026 frontend remains **100% static, pre-rendered, and CDN-hosted** via Next.js (`output: 'export'`).
- Zero API calls occur on initial page load.
- All backend integrations execute exclusively on explicit user triggers (form submission, calendar export).
- The client codebase interfaces with the backend exclusively via `src/lib/api.ts`, which defaults to offline mock resolution when `NEXT_PUBLIC_API_BASE` is unset.

---

## 2. Recommended Stack: Option B (Edge Serverless)

For college hackathons with high traffic spikes, **Option B (Edge Serverless via Cloudflare Workers / Pages Functions)** is strongly recommended over managing a dedicated VM or traditional Node server:

1. **Hosting & CDN**: Cloudflare Pages (Free tier includes unlimited requests and bandwidth).
2. **Database**: Cloudflare D1 (Serverless SQLite) or Cloudflare KV for fast global reads.
3. **Bot & Spam Protection**: Cloudflare Turnstile (Privacy-friendly alternative to reCAPTCHA).
4. **Email Notifications**: Resend / Brevo (Transactional email API with generous free tiers).
5. **Cost**: **$0 / month** under ordinary college hackathon traffic volumes.

---

## 3. Data Models (DPDP Act & Privacy-Compliant)

```sql
-- Lead capture / Announcement notification signups
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  contact TEXT NOT NULL,
  contact_type TEXT CHECK(contact_type IN ('email', 'phone')),
  source TEXT DEFAULT 'website',
  consent_at TIMESTAMP NOT NULL,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions & Contact messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: In-house team registrations (If external Google Form / Devfolio is retired)
CREATE TABLE registrations (
  id TEXT PRIMARY KEY,
  team_name TEXT NOT NULL,
  track TEXT CHECK(track IN ('main', 'vr')),
  leader_name TEXT NOT NULL,
  leader_contact TEXT NOT NULL,
  college TEXT NOT NULL,
  team_size INTEGER NOT NULL,
  ticket_code TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Edge Endpoints Specification

| Endpoint | Method | Function | Protections |
|---|---|---|---|
| `/api/leads` | `POST` | Notification / ticket alerts signup | Rate limited, Turnstile verified, deduplicated by contact |
| `/api/messages` | `POST` | Question submission for FAQs | Rate limited, 500-char message cap, Turnstile |
| `/api/announcements`| `GET` | Dynamic ticker / banner message | Edge-cached 60s, stale-while-revalidate |

---

## 5. Answers to §14 Open Questions

1. **Registration**: Keep the external link (`registrationUrl` pointing to Unstop/Google Form/Devfolio). Custom in-house payments and QR ticketing remain unbuilt.
2. **Notify-me & Contact**: Built as clean UI in the client with mock fallback in `src/lib/api.ts`.
3. **Hosting**: Static front-end ready for Cloudflare Pages, Netlify, or Vercel.
4. **Dates & Venue**: Kept strictly as unconfirmed `TODO:` strings in `src/content/site.ts` until official club confirmation.
5. **Brand & Assets**: Brawl Stars aesthetic assets kept isolated in `public/art/` and marked `TEMP` for effortless drop-in swap prior to public marketing.
