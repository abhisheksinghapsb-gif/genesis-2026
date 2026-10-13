# GENESIS 2026 — Production & Staging Deployment Guide

This guide walks through configuring, provisioning, and deploying the **GENESIS 2026** platform to production and staging environments.

---

## 1. Environment Variables Matrix (Staging vs. Production)

Configure these variables in your hosting provider's dashboard (e.g., Vercel Project Settings → Environment Variables):

| Variable Name | Required | Purpose | Staging Value | Production Value |
| :--- | :---: | :--- | :--- | :--- |
| `NODE_ENV` | Yes | Node runtime mode | `production` | `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site origin & OpenGraph URLs | `https://staging.genesis2026.example.com` | `https://genesis2026.com` (your live domain) |
| `NEXT_PUBLIC_DEMO_MODE` | No | Shows seed squad count & stats | `false` | `false` |
| `DB_ADAPTER` | Yes | Database access layer adapter | `supabase` (or `memory` for ephemeral QA) | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | If Supabase | Supabase Project REST Endpoint | `https://staging-ref.supabase.co` | `https://your-prod-ref.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | If Supabase | Public Supabase client anon key | `eyJhbGciOi...` (Staging Anon Key) | `eyJhbGciOi...` (Production Anon Key) |
| `SUPABASE_SERVICE_ROLE_KEY` | If Supabase | Server-side elevated key for registrations | `eyJhbGciOi...` (Staging Role Key) | `eyJhbGciOi...` (Production Role Key) |
| `ADMIN_SECRET` | Yes | Bearer token for `/api/admin` access | Strong random 32-char token | Strong random 64-char token |
| `ADMIN_EMAILS` | No | Comma-separated allowlist of admin emails | `organizers@aitpune.edu.in` | `organizers@aitpune.edu.in` |
| `EMAIL_PROVIDER` | Yes | Email dispatch provider | `console` (or `resend` test domain) | `resend` |
| `RESEND_API_KEY` | If Resend | Resend API key (`re_...`) | Optional (logs to console if blank) | `re_live_xxxxxxxxxxxxxxxxxxxxxxxx` |
| `EMAIL_FROM` | If Resend | Sender email identity | `GENESIS Staging <no-reply@staging.domain.com>` | `GENESIS 2026 <no-reply@genesis2026.com>` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes | Cloudflare Turnstile public site key | `1x00000000000000000000AA` (Dummy Test Key) | Live Cloudflare widget Site Key |
| `TURNSTILE_SECRET_KEY` | Yes | Cloudflare Turnstile server verification key | `1x0000000000000000000000000000000AA` (Dummy Secret) | Live Cloudflare Secret Key |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL for distributed rate limits | Blank (uses in-memory limiter) | `https://your-cluster.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis authorization token | Blank | `your-production-token` |
| `SENTRY_DSN` | No | Error tracking DSN (silent no-op if unset) | Blank | `https://public@sentry.io/project` |

---

## 2. Domain & DNS Configuration

1. **Purchasing & DNS Hosting:**
   Ensure your custom domain (e.g., `genesis2026.com`) has DNS managed either via Cloudflare or your registrar (Namecheap, GoDaddy, Google Domains/Squarespace).

2. **Pointing Records to Vercel (or Target Host):**
   * **Apex (`@`):**
     * Type: `A`
     * Name: `@`
     * Value: `76.76.21.21` (Vercel Anycast IP)
   * **Subdomain (`www`):**
     * Type: `CNAME`
     * Name: `www`
     * Value: `cname.vercel-dns.com`

3. **SSL / HTTPS:**
   * Vercel provisions free Let's Encrypt certificates automatically once DNS propagates.
   * If using Cloudflare proxy (orange cloud), set Cloudflare SSL/TLS encryption mode to **Full (Strict)**.

---

## 3. Supabase Database Migration & Setup

The database schema and policies are fully defined in [`supabase/migrations/20261013000000_genesis_schema.sql`](file:///g:/new%20try%201/supabase/migrations/20261013000000_genesis_schema.sql).

### Step-by-Step Provisioning:
1. Log in to [Supabase Console](https://supabase.com/dashboard) and create a new project (Region: `ap-south-1` Mumbai recommended for AIT Pune).
2. Open the **SQL Editor** tab.
3. Paste and run the contents of [`supabase/migrations/20261013000000_genesis_schema.sql`](file:///g:/new%20try%201/supabase/migrations/20261013000000_genesis_schema.sql).
4. Verify the following:
   * Table `teams` exists with columns: `id`, `team_name`, `track`, `college`, `city`, `edition`, `leader_name`, `leader_email`, `leader_phone`, `created_at`.
   * Table `members` exists with foreign key referencing `teams(id)`.
   * Indexes `idx_teams_edition`, `idx_teams_leader_email_edition`, and `idx_members_email_edition` are created.
   * Row Level Security (RLS) is enabled.
5. In **Project Settings → API**:
   * Copy `Project URL` → set as `NEXT_PUBLIC_SUPABASE_URL`.
   * Copy `anon public` key → set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   * Copy `service_role secret` key → set as `SUPABASE_SERVICE_ROLE_KEY`.

---

## 4. Resend Domain Verification (Email Delivery)

To send official tournament confirmations from `@genesis2026.com`:

1. Sign up or log into [Resend](https://resend.com).
2. Go to **Domains → Add Domain** and enter your sending domain (e.g., `genesis2026.com` or `mail.genesis2026.com`).
3. Add the three required DNS records in your domain's DNS manager:
   * **DKIM (TXT):** `resend._domainkey` → `k=rsa; p=...`
   * **SPF (TXT):** `@` → `v=spf1 include:amazonses.com ~all`
   * **DMARC (TXT):** `_dmarc` → `v=DMARC1; p=none;`
4. Click **Verify Records** in Resend. Once verified (green checkmark), create an API Key under **API Keys**.
5. Set `RESEND_API_KEY` and `EMAIL_FROM="GENESIS 2026 <no-reply@yourdomain.com>"` in your production environment variables.

---

## 5. Cloudflare Turnstile Bot Protection

Cloudflare Turnstile provides seamless, invisible CAPTCHA-less bot verification:

1. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com) and navigate to **Turnstile**.
2. Click **Add Widget**:
   * **Widget Name:** `GENESIS 2026 Registration`
   * **Domains:** Add your production domain (`genesis2026.com`), staging domain, and `localhost` (for testing).
   * **Widget Mode:** Managed (invisible challenge with fallback).
3. Copy the credentials:
   * **Site Key:** Set as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
   * **Secret Key:** Set as `TURNSTILE_SECRET_KEY`.

*(Note: In dev and staging, you can keep the dummy keys `1x00000000000000000000AA` which Cloudflare guarantees will always return a valid pass).*

---

## 6. External Uptime & Health Monitoring Setup

The platform provides a dedicated health check endpoint at `/api/health` that returns `200 OK` and system uptime information:

```json
{
  "status": "ok",
  "edition": "genesis-2026",
  "timestamp": "2026-10-13T09:00:00.000Z",
  "uptimeSeconds": 14205,
  "environment": "production"
}
```

### Configuring an External Uptime Monitor (BetterStack, UptimeRobot, or Cloudflare Health Checks):
1. Create a new HTTP/HTTPS monitor.
2. **Monitor URL:** `https://genesis2026.com/api/health`
3. **HTTP Method:** `GET` or `HEAD` (both supported; `HEAD` uses zero transfer bytes).
4. **Expected Status Code:** `200`
5. **Check Interval:** `1 minute` or `5 minutes`.
6. **Response Keyword Assertion:** `"status":"ok"`
7. **Alert Routing:** Connect notification webhooks to the GDXR Club Discord or organizers' Telegram/Slack.

---

## 7. Deployment Instructions

### Option A: Deploy via Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login & Link:**
   ```bash
   vercel login
   vercel link
   ```

3. **Deploy to Preview / Staging:**
   ```bash
   vercel
   ```

4. **Promote / Deploy to Production:**
   ```bash
   vercel --prod
   ```

The included [`vercel.json`](file:///g:/new%20try%201/vercel.json) will automatically enforce security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) and 1-year immutable caching for static font and image assets.

---

### Option B: Self-Hosted Docker / Node.js Server

1. Build the production application:
   ```bash
   npm run build
   ```

2. Run the production daemon:
   ```bash
   NODE_ENV=production npm run start
   ```

3. If running behind Nginx or Caddy reverse proxy, pass `x-forwarded-for` and `host` headers for accurate rate-limiting:
   ```nginx
   location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $remote_addr;
       proxy_cache_bypass $http_upgrade;
   }
   ```

---

## 8. Post-Deployment Verification Smoke Test

Execute this 5-minute sanity check immediately after DNS propagation:

1. [ ] **Homepage Load:** Visit `https://yourdomain.com` — verify hero celestial canvas mounts, lilita-one heading fonts render, and HUD slides in at 60% scroll.
2. [ ] **Health Endpoint:** Query `https://yourdomain.com/api/health` — verify HTTP 200 with `status: "ok"`.
3. [ ] **Sitemap & Robots:** Visit `https://yourdomain.com/sitemap.xml` and `/robots.txt` — verify canonical domain is present.
4. [ ] **Social Card Preview:** Validate OpenGraph rendering on [opengraph.xyz](https://www.opengraph.xyz) or Twitter Card Validator using `https://yourdomain.com/og-image.png`.
5. [ ] **Registration Flow:** Submit a test squad registration through the 3-step wizard:
   * Verify Turnstile challenge passes.
   * Verify victory screen appears with team ID (`GEN-2026-XXXX`).
   * Verify `.ics` calendar file downloads.
   * Verify confirmation email arrives in inbox.
