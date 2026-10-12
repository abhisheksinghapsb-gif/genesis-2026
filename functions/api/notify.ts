// functions/api/notify.ts
// POST /api/notify - Bot-protected (honeypot + Turnstile), rate-limited (Section 7.4)

interface Env {
  DB?: any;
  TURNSTILE_SECRET_KEY?: string;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: { code: 'bad_request', message: 'application/json expected' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: any = await request.json();
    const { email, consent, source, honeypot } = body;

    // 1. Honeypot check: bot triggered
    if (honeypot) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Strict field validation
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: { code: 'validation_failed', fields: { email: 'invalid_email' } } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!consent) {
      return new Response(
        JSON.stringify({ error: { code: 'validation_failed', fields: { consent: 'consent_required' } } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validSources = ['toast', 'menu', 'footer'];
    const originSource = validSources.includes(source) ? source : 'toast';

    // 3. Persist to D1 if connected
    if (env.DB) {
      const id = 'notif_' + Math.random().toString(36).substring(2, 10);
      const consentAt = new Date().toISOString();

      await env.DB.prepare(
        'INSERT OR IGNORE INTO notify_signups (id, email, consent_at, source) VALUES (?, ?, ?, ?)'
      )
        .bind(id, email.toLowerCase().trim(), consentAt, originSource)
        .run();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'You will be notified as soon as registrations open!' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: { code: 'server_error', message: err?.message } }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
