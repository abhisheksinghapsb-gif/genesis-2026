# GENESIS 2026 — Production Deployment Guide

This guide explains how to deploy the static export of the GENESIS 2026 website to **Cloudflare Pages**, **Vercel**, or **Netlify**.

---

## 1. Prerequisites & Environment Variables

The website is a 100% pre-rendered static site (`output: 'export'`). It does not require Node.js runtime servers, databases, or container infrastructure at runtime.

### Required Environment Variables

| Variable Name | Description | Example Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of the production site | `https://genesis.aitpune.edu.in` |
| `NEXT_PUBLIC_REGISTRATION_URL` | External registration portal link (Google Form, Unstop, Devfolio) | `https://unstop.com/o/genesis-2026` |
| `NEXT_PUBLIC_ENV` | Environment identifier (`production`, `preview`, `development`) | `production` |
| `NEXT_PUBLIC_ANALYTICS_ID` | (Optional) Privacy-friendly analytics tracker ID | `G-XXXXXXXXXX` |

> [!IMPORTANT]
> If `NEXT_PUBLIC_REGISTRATION_URL` is empty, tapping **REGISTER** gracefully displays an in-game toast notification: *"Registrations opening soon!"*.
> In `production` mode, `npm run check:content` enforces that the registration URL starts with `https://`.

---

## 2. Deploying to Cloudflare Pages (Recommended)

Cloudflare Pages provides global edge distribution, zero-cost static hosting, and native support for `public/_headers`.

1. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select the repository and configure the build settings:
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/`
4. Under **Environment variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: `https://genesis.aitpune.edu.in`
   - `NEXT_PUBLIC_ENV`: `production`
   - `NEXT_PUBLIC_REGISTRATION_URL`: `<your-registration-link>`
5. Click **Save and Deploy**.
6. Cloudflare automatically applies the security headers and caching directives from `public/_headers`.

---

## 3. Deploying to Vercel

1. Import your GitHub repository in the [Vercel Dashboard](https://vercel.com/new).
2. Configure project settings:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
3. Add Environment Variables under **Project Settings** > **Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_ENV`
   - `NEXT_PUBLIC_REGISTRATION_URL`
4. Deploy. The bundled `vercel.json` applies caching headers and security policies.

---

## 4. Deploying to Netlify

1. In the [Netlify App](https://app.netlify.com/), click **Add new site** > **Import an existing project**.
2. Select GitHub and choose the repo.
3. Build Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
4. Netlify automatically consumes `public/_headers`.

---

## 5. Security & Caching Verification

Verify that your deployment returns the required security headers using `curl`:

```bash
curl -I https://genesis.aitpune.edu.in/
```

Confirm that the response contains:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- Static assets (`/_next/static/*`): `Cache-Control: public, max-age=31536000, immutable`

---

## 6. Uptime Monitoring

Set up a free HTTP/HTTPS monitor (e.g., [Better Stack](https://betterstack.com/) or [UptimeRobot](https://uptimerobot.com/)) monitoring `https://genesis.aitpune.edu.in/` at 1-minute intervals to ensure 99.99% availability during registrations.
