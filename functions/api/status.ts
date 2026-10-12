// functions/api/status.ts
// GET /api/status - Edge cached 15s (Section 7.4)

interface Env {
  REGISTRATION_OPEN?: string;
}

export const onRequestGet = async ({ env }: { env: Env }) => {
  const isOpen = env.REGISTRATION_OPEN === 'true';

  const body = JSON.stringify({
    registrationOpen: isOpen,
    spotsLeft: null,
    timestamp: new Date().toISOString(),
  });

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=15, stale-while-revalidate=30',
    },
  });
};
