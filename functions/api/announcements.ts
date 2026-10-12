// functions/api/announcements.ts
// GET /api/announcements - Edge cached 30s (Section 7.4)

interface Env {
  DB?: any;
}

export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    if (env.DB) {
      const now = new Date().toISOString();
      const { results } = await env.DB.prepare(
        'SELECT id, text, link, starts_at, ends_at FROM announcements WHERE starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)'
      )
        .bind(now, now)
        .all();

      return new Response(JSON.stringify({ announcements: results ?? [] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        },
      });
    }

    // Static fallback if DB binding is not yet attached
    const fallback = [
      {
        id: 'genesis-2026-launch',
        text: 'Registrations opening soon! Follow our socials for latest track reveals.',
        link: '/faqs/#q=how-do-i-register',
        starts_at: new Date().toISOString(),
      },
    ];

    return new Response(JSON.stringify({ announcements: fallback }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: { code: 'internal_error', message: err?.message } }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
