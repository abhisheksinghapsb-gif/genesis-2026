import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as registerPost } from '@/app/api/register/route';
import { GET as statsGet } from '@/app/api/stats/route';
import { GET as adminGet } from '@/app/api/admin/route';
import { MemoryAdapter, setDbAdapter } from '@/lib/db';
import { MockEmailProvider, setEmailProvider } from '@/lib/email';
import { resetRateLimits } from '@/lib/ratelimit';

describe('Phase 6 API: Squad Registration & Stats', () => {
  let memoryDb: MemoryAdapter;
  let mockEmail: MockEmailProvider;

  beforeEach(() => {
    // Reset DB with fresh empty seed
    memoryDb = new MemoryAdapter(false);
    setDbAdapter(memoryDb);

    mockEmail = new MockEmailProvider();
    setEmailProvider(mockEmail);

    resetRateLimits();
  });

  const createJsonRequest = (url: string, body: unknown, ip = '127.0.0.1') => {
    return new NextRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify(body),
    });
  };

  const createGetRequest = (url: string, headers: Record<string, string> = {}) => {
    return new NextRequest(url, {
      method: 'GET',
      headers: {
        'x-forwarded-for': '127.0.0.1',
        ...headers,
      },
    });
  };

  it('successfully registers a valid solo squad and dispatches confirmation email', async () => {
    const payload = {
      teamName: 'Vortex Legends',
      track: 'gaming',
      leaderName: 'Karan Mehra',
      leaderEmail: 'karan@example.com',
      leaderPhone: '+919876543210',
      members: [],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const req = createJsonRequest('http://localhost:3000/api/register', payload);
    const res = await registerPost(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.teamId).toMatch(/^GEN-2026-\d{4}$/);
    expect(data.teamName).toBe('Vortex Legends');
    expect(data.track).toBe('gaming');
    expect(data.memberCount).toBe(1);

    // Verify mock email was sent
    expect(mockEmail.sentEmails.length).toBe(1);
    expect(mockEmail.sentEmails[0]?.to).toBe('karan@example.com');
    expect(mockEmail.sentEmails[0]?.teamId).toBe(data.teamId);
  });

  it('successfully registers a full 4-person squad with VR track', async () => {
    const payload = {
      teamName: 'VR Cyber Knights',
      track: 'vr',
      leaderName: 'Ananya Sharma',
      leaderEmail: 'ananya@example.com',
      leaderPhone: '+919876543215',
      members: [
        { name: 'Rohan Verma', email: 'rohan@example.com', phone: '+919876543216' },
        { name: 'Dev Sen', email: 'dev@example.com' },
        { name: 'Pooja Iyer', email: 'pooja@example.com' },
      ],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const req = createJsonRequest('http://localhost:3000/api/register', payload);
    const res = await registerPost(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.track).toBe('vr');
    expect(data.memberCount).toBe(4);
  });

  it('rejects registration when consent is false or missing', async () => {
    const payload = {
      teamName: 'Rogue Squad',
      track: 'gaming',
      leaderName: 'Arjun Das',
      leaderEmail: 'arjun@example.com',
      leaderPhone: '+919876543219',
      members: [],
      consent: false,
      turnstileToken: 'test-turnstile-token',
    };

    const req = createJsonRequest('http://localhost:3000/api/register', payload);
    const res = await registerPost(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain('accept the tournament rules');
  });

  it('rejects duplicate leader email within the same tournament edition with 409 Conflict', async () => {
    const payload1 = {
      teamName: 'Alpha Clan',
      track: 'gaming',
      leaderName: 'Sameer Rao',
      leaderEmail: 'sameer@example.com',
      leaderPhone: '+919876543290',
      members: [],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const req1 = createJsonRequest('http://localhost:3000/api/register', payload1, '10.0.0.1');
    const res1 = await registerPost(req1);
    expect(res1.status).toBe(201);

    // Second registration with same email
    const payload2 = {
      teamName: 'Beta Clan',
      track: 'vr',
      leaderName: 'Sameer Rao',
      leaderEmail: 'sameer@example.com',
      leaderPhone: '+919876543291',
      members: [],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const req2 = createJsonRequest('http://localhost:3000/api/register', payload2, '10.0.0.2');
    const res2 = await registerPost(req2);
    expect(res2.status).toBe(409);

    const data2 = await res2.json();
    expect(data2.code).toBe('DUPLICATE_LEADER_EMAIL');
  });

  it('rejects duplicate leader phone within the same tournament edition with 409 Conflict', async () => {
    const payload1 = {
      teamName: 'Gamma Team',
      track: 'gaming',
      leaderName: 'Rahul V',
      leaderEmail: 'rahul1@example.com',
      leaderPhone: '+919876543888',
      members: [],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const req1 = createJsonRequest('http://localhost:3000/api/register', payload1, '10.0.0.3');
    const res1 = await registerPost(req1);
    expect(res1.status).toBe(201);

    // Second registration with same phone
    const payload2 = {
      teamName: 'Delta Team',
      track: 'gaming',
      leaderName: 'Other Person',
      leaderEmail: 'other@example.com',
      leaderPhone: '+919876543888',
      members: [],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const req2 = createJsonRequest('http://localhost:3000/api/register', payload2, '10.0.0.4');
    const res2 = await registerPost(req2);
    expect(res2.status).toBe(409);

    const data2 = await res2.json();
    expect(data2.code).toBe('DUPLICATE_LEADER_PHONE');
  });

  it('rejects registration when member email duplicates leader email', async () => {
    const payload = {
      teamName: 'Self Loopers',
      track: 'gaming',
      leaderName: 'Sanjay Dutt',
      leaderEmail: 'sanjay@example.com',
      leaderPhone: '+919876543777',
      members: [{ name: 'Sanjay Clone', email: 'sanjay@example.com' }],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const req = createJsonRequest('http://localhost:3000/api/register', payload);
    const res = await registerPost(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain('Duplicate email detected');
  });

  it('rejects squad with more than 3 additional members (max team size 4)', async () => {
    const payload = {
      teamName: 'Overcrowded Army',
      track: 'gaming',
      leaderName: 'Captain Over',
      leaderEmail: 'captain@example.com',
      leaderPhone: '+919876543666',
      members: [
        { name: 'P1', email: 'p1@example.com' },
        { name: 'P2', email: 'p2@example.com' },
        { name: 'P3', email: 'p3@example.com' },
        { name: 'P4', email: 'p4@example.com' }, // 4 members = 5 total
      ],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const req = createJsonRequest('http://localhost:3000/api/register', payload);
    const res = await registerPost(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain('Maximum 3 additional team members allowed');
  });

  it('GET /api/stats returns counts and incorporates demo hype count', async () => {
    // Add one squad
    const payload = {
      teamName: 'Hype Check Squad',
      track: 'gaming',
      leaderName: 'Hype Leader',
      leaderEmail: 'hype@example.com',
      leaderPhone: '+919876543555',
      members: [],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };
    await registerPost(createJsonRequest('http://localhost:3000/api/register', payload, '10.0.0.5'));

    const statsReq = createGetRequest('http://localhost:3000/api/stats');
    const statsRes = await statsGet(statsReq);
    expect(statsRes.status).toBe(200);

    const statsData = await statsRes.json();
    expect(statsData.success).toBe(true);
    expect(statsData.actual).toBe(1);
    expect(statsData.total).toBeGreaterThanOrEqual(1);
    expect(statsData.edition).toBe('genesis-2026');
  });

  it('GET /api/admin returns paginated registration list in dev mode', async () => {
    // Add one squad
    const payload = {
      teamName: 'Admin Inspection Squad',
      track: 'vr',
      leaderName: 'Admin Inspect Leader',
      leaderEmail: 'admin-inspect@example.com',
      leaderPhone: '+919876543444',
      members: [],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };
    await registerPost(createJsonRequest('http://localhost:3000/api/register', payload, '10.0.0.6'));

    const adminReq = createGetRequest('http://localhost:3000/api/admin?dev=true');
    const adminRes = await adminGet(adminReq);
    expect(adminRes.status).toBe(200);

    const adminData = await adminRes.json();
    expect(adminData.success).toBe(true);
    expect(adminData.items.length).toBeGreaterThanOrEqual(1);
    expect(adminData.items.some((i: { team_name: string }) => i.team_name === 'Admin Inspection Squad')).toBe(true);
  });

  it('enforces rate limiting when spamming the register endpoint from same IP', async () => {
    const payload = {
      teamName: 'Spam Squad',
      track: 'gaming',
      leaderName: 'Spam Leader',
      leaderEmail: 'spam1@example.com',
      leaderPhone: '+919876543331',
      members: [],
      consent: true,
      turnstileToken: 'test-turnstile-token',
    };

    const ip = '192.168.1.100';

    // Submit 5 times (limit is 5)
    for (let i = 1; i <= 5; i++) {
      const p = { ...payload, leaderEmail: `spam${i}@example.com`, leaderPhone: `+91987654333${i}` };
      const res = await registerPost(createJsonRequest('http://localhost:3000/api/register', p, ip));
      expect(res.status).toBe(201);
    }

    // 6th attempt should be blocked by rate limit (HTTP 429)
    const p6 = { ...payload, leaderEmail: 'spam6@example.com', leaderPhone: '+919876543336' };
    const res6 = await registerPost(createJsonRequest('http://localhost:3000/api/register', p6, ip));
    expect(res6.status).toBe(429);

    const data6 = await res6.json();
    expect(data6.error).toContain('Rate limit exceeded');
  });
});
