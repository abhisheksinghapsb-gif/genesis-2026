// Data Access Layer: DatabaseAdapter interface with MemoryAdapter & SupabaseAdapter implementations
import { RegistrationInput, RegistrationRecord } from './validation';
import eventConfig from '@/content/event.json';

export interface RegistrationStats {
  edition: string;
  total: number;
  gaming: number;
  vr: number;
}

export interface DatabaseAdapter {
  createRegistration(data: RegistrationInput): Promise<RegistrationRecord>;
  findByEmail(email: string, edition?: string): Promise<RegistrationRecord | null>;
  findByPhone(phone: string, edition?: string): Promise<RegistrationRecord | null>;
  getStats(edition?: string): Promise<RegistrationStats>;
  listRegistrations(
    edition?: string,
    limit?: number,
    offset?: number
  ): Promise<{ items: RegistrationRecord[]; total: number }>;
}

// ---------------------------------------------------------------------------
// 1. In-Memory Adapter (Default for Dev, Test, and Offline environments)
// ---------------------------------------------------------------------------
export class MemoryAdapter implements DatabaseAdapter {
  private records: RegistrationRecord[] = [];

  constructor(initialSeed: boolean = true) {
    if (initialSeed) {
      this.seedInitialData();
    }
  }

  private seedInitialData() {
    this.records = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        team_id: 'GEN-2026-1001',
        edition: eventConfig.edition || 'genesis-2026',
        team_name: 'Apex Brawlers',
        track: 'gaming',
        college: 'Army Institute of Technology',
        city: 'Pune',
        leader_name: 'Aarav Sharma',
        leader_email: 'aarav.sharma@example.com',
        leader_phone: '+919876543210',
        members: [
          { name: 'Rohan Gupta', email: 'rohan.gupta@example.com', phone: '+919876543211' },
          { name: 'Vikram Singh', email: 'vikram.singh@example.com' },
        ],
        consent: true,
        consent_timestamp: '2026-10-10T10:00:00.000Z',
        privacy_version: '1.0',
        created_at: '2026-10-10T10:00:00.000Z',
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        team_id: 'GEN-2026-1002',
        edition: eventConfig.edition || 'genesis-2026',
        team_name: 'Cyber Vortex VR',
        track: 'vr',
        college: 'COEP Tech',
        city: 'Pune',
        leader_name: 'Neha Patel',
        leader_email: 'neha.patel@example.com',
        leader_phone: '+919876543220',
        members: [{ name: 'Ananya Joshi', email: 'ananya.joshi@example.com' }],
        consent: true,
        consent_timestamp: '2026-10-11T14:30:00.000Z',
        privacy_version: '1.0',
        created_at: '2026-10-11T14:30:00.000Z',
      },
    ];
  }

  public clear(): void {
    this.records = [];
  }

  public resetSeed(): void {
    this.clear();
    this.seedInitialData();
  }

  private generateTeamId(): string {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `GEN-2026-${randomSuffix}`;
  }

  async createRegistration(data: RegistrationInput): Promise<RegistrationRecord> {
    const edition = eventConfig.edition || 'genesis-2026';

    // Duplicate checks
    const emailConflict = await this.findByEmail(data.leaderEmail, edition);
    if (emailConflict) {
      throw new Error(`A squad with leader email '${data.leaderEmail}' is already registered for ${edition}`);
    }

    const phoneConflict = await this.findByPhone(data.leaderPhone, edition);
    if (phoneConflict) {
      throw new Error(`A squad with leader phone '${data.leaderPhone}' is already registered for ${edition}`);
    }

    // Ensure generated team ID is unique
    let teamId = this.generateTeamId();
    while (this.records.some((r) => r.team_id === teamId)) {
      teamId = this.generateTeamId();
    }

    const newRecord: RegistrationRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `mock-${Date.now()}-${Math.random()}`,
      team_id: teamId,
      edition,
      team_name: data.teamName,
      track: data.track,
      college: data.college,
      city: data.city,
      leader_name: data.leaderName,
      leader_email: data.leaderEmail.toLowerCase(),
      leader_phone: data.leaderPhone,
      members: data.members || [],
      consent: data.consent,
      consent_timestamp: new Date().toISOString(),
      privacy_version: data.privacyVersion || '1.0',
      created_at: new Date().toISOString(),
    };

    this.records.push(newRecord);
    return newRecord;
  }

  async findByEmail(email: string, edition: string = eventConfig.edition || 'genesis-2026'): Promise<RegistrationRecord | null> {
    const normalized = email.trim().toLowerCase();
    const match = this.records.find(
      (r) => r.edition === edition && r.leader_email.toLowerCase() === normalized
    );
    return match || null;
  }

  async findByPhone(phone: string, edition: string = eventConfig.edition || 'genesis-2026'): Promise<RegistrationRecord | null> {
    const normalized = phone.replace(/[\s\-]/g, '');
    const match = this.records.find(
      (r) => r.edition === edition && r.leader_phone.replace(/[\s\-]/g, '') === normalized
    );
    return match || null;
  }

  async getStats(edition: string = eventConfig.edition || 'genesis-2026'): Promise<RegistrationStats> {
    const filtered = this.records.filter((r) => r.edition === edition);
    const total = filtered.length;
    const gaming = filtered.filter((r) => r.track === 'gaming').length;
    const vr = filtered.filter((r) => r.track === 'vr').length;

    return { edition, total, gaming, vr };
  }

  async listRegistrations(
    edition: string = eventConfig.edition || 'genesis-2026',
    limit: number = 50,
    offset: number = 0
  ): Promise<{ items: RegistrationRecord[]; total: number }> {
    const filtered = this.records.filter((r) => r.edition === edition);
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const items = sorted.slice(offset, offset + limit);
    return { items, total: filtered.length };
  }
}

// ---------------------------------------------------------------------------
// 2. Supabase PostgREST Adapter (Production)
// ---------------------------------------------------------------------------
export class SupabaseAdapter implements DatabaseAdapter {
  private url: string;
  private apiKey: string;

  constructor(url: string, apiKey: string) {
    this.url = url.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  private get headers(): HeadersInit {
    return {
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
  }

  private generateTeamId(): string {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `GEN-2026-${randomSuffix}`;
  }

  async createRegistration(data: RegistrationInput): Promise<RegistrationRecord> {
    const edition = eventConfig.edition || 'genesis-2026';

    // Duplicate verification
    const emailConflict = await this.findByEmail(data.leaderEmail, edition);
    if (emailConflict) {
      throw new Error(`A squad with leader email '${data.leaderEmail}' is already registered for ${edition}`);
    }

    const phoneConflict = await this.findByPhone(data.leaderPhone, edition);
    if (phoneConflict) {
      throw new Error(`A squad with leader phone '${data.leaderPhone}' is already registered for ${edition}`);
    }

    const teamId = this.generateTeamId();

    const payload = {
      team_id: teamId,
      edition,
      team_name: data.teamName,
      track: data.track,
      college: data.college,
      city: data.city,
      leader_name: data.leaderName,
      leader_email: data.leaderEmail.toLowerCase(),
      leader_phone: data.leaderPhone,
      members: data.members || [],
      consent: data.consent,
      consent_timestamp: new Date().toISOString(),
      privacy_version: data.privacyVersion || '1.0',
    };

    const res = await fetch(`${this.url}/rest/v1/registrations`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      if (res.status === 409 || errText.includes('duplicate key')) {
        throw new Error('A registration with these leader credentials already exists.');
      }
      throw new Error(`Supabase registration insert failed: ${res.status} ${errText}`);
    }

    const inserted = (await res.json()) as RegistrationRecord[];
    const first = inserted[0];
    if (!first) {
      throw new Error('Registration failed to return inserted record');
    }

    return first;
  }

  async findByEmail(email: string, edition: string = eventConfig.edition || 'genesis-2026'): Promise<RegistrationRecord | null> {
    const encodedEmail = encodeURIComponent(email.trim().toLowerCase());
    const encodedEdition = encodeURIComponent(edition);

    const res = await fetch(
      `${this.url}/rest/v1/registrations?edition=eq.${encodedEdition}&leader_email=ilike.${encodedEmail}&select=*&limit=1`,
      { headers: this.headers }
    );

    if (!res.ok) return null;
    const items = (await res.json()) as RegistrationRecord[];
    return items[0] ?? null;
  }

  async findByPhone(phone: string, edition: string = eventConfig.edition || 'genesis-2026'): Promise<RegistrationRecord | null> {
    const encodedPhone = encodeURIComponent(phone.trim());
    const encodedEdition = encodeURIComponent(edition);

    const res = await fetch(
      `${this.url}/rest/v1/registrations?edition=eq.${encodedEdition}&leader_phone=eq.${encodedPhone}&select=*&limit=1`,
      { headers: this.headers }
    );

    if (!res.ok) return null;
    const items = (await res.json()) as RegistrationRecord[];
    return items[0] ?? null;
  }

  async getStats(edition: string = eventConfig.edition || 'genesis-2026'): Promise<RegistrationStats> {
    // Try calling the RPC helper if available
    try {
      const rpcRes = await fetch(`${this.url}/rest/v1/rpc/get_registration_stats`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ p_edition: edition }),
      });

      if (rpcRes.ok) {
        return (await rpcRes.json()) as RegistrationStats;
      }
    } catch {
      // Fallback to table query below
    }

    const encodedEdition = encodeURIComponent(edition);
    const res = await fetch(
      `${this.url}/rest/v1/registrations?edition=eq.${encodedEdition}&select=track`,
      { headers: this.headers }
    );

    if (!res.ok) {
      return { edition, total: 0, gaming: 0, vr: 0 };
    }

    const rows = (await res.json()) as { track: 'gaming' | 'vr' }[];
    const total = rows.length;
    const gaming = rows.filter((r) => r.track === 'gaming').length;
    const vr = rows.filter((r) => r.track === 'vr').length;

    return { edition, total, gaming, vr };
  }

  async listRegistrations(
    edition: string = eventConfig.edition || 'genesis-2026',
    limit: number = 50,
    offset: number = 0
  ): Promise<{ items: RegistrationRecord[]; total: number }> {
    const encodedEdition = encodeURIComponent(edition);
    const res = await fetch(
      `${this.url}/rest/v1/registrations?edition=eq.${encodedEdition}&order=created_at.desc&limit=${limit}&offset=${offset}`,
      {
        headers: {
          ...this.headers,
          Prefer: 'count=exact',
        },
      }
    );

    if (!res.ok) return { items: [], total: 0 };
    const items = (await res.json()) as RegistrationRecord[];
    const contentRange = res.headers.get('content-range');
    const total = contentRange ? parseInt(contentRange.split('/')[1] || '0', 10) : items.length;

    return { items, total };
  }
}

// ---------------------------------------------------------------------------
// 3. Factory & Global Instance Management
// ---------------------------------------------------------------------------
let activeDbAdapter: DatabaseAdapter | null = null;

export function getDb(): DatabaseAdapter {
  if (activeDbAdapter) {
    return activeDbAdapter;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isProd = process.env.NODE_ENV === 'production';
  const forceSupabase = process.env.DB_ADAPTER === 'supabase';

  // In production or when explicitly configured, use SupabaseAdapter
  if ((isProd || forceSupabase) && supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
    activeDbAdapter = new SupabaseAdapter(supabaseUrl, supabaseKey);
  } else {
    // Default to in-memory adapter
    activeDbAdapter = new MemoryAdapter();
  }

  return activeDbAdapter;
}

export function setDbAdapter(adapter: DatabaseAdapter | null): void {
  activeDbAdapter = adapter;
}
