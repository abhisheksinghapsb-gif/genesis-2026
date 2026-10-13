import { describe, it, expect } from 'vitest';
import { GET as healthGet, HEAD as healthHead } from '@/app/api/health/route';

describe('Phase 9: /api/health Endpoint', () => {
  it('returns 200 OK with status: ok, edition, and uptime info on GET', async () => {
    const res = await healthGet();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.edition).toBe('genesis-2026');
    expect(typeof data.uptimeSeconds).toBe('number');
    expect(typeof data.timestamp).toBe('string');
  });

  it('returns 200 OK with null body on HEAD for lightweight pingers', async () => {
    const res = await healthHead();
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
