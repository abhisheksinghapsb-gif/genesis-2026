import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { checkRateLimit } from '@/lib/ratelimit';
import eventConfig from '@/content/event.json';

export async function GET(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0]?.trim() || '127.0.0.1' : '127.0.0.1';

    // Rate limit: 30 requests per minute
    const rateLimit = await checkRateLimit(`stats:${clientIp}`, 30, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const currentEdition = eventConfig.edition || 'genesis-2026';
    const db = getDb();
    const stats = await db.getStats(currentEdition);

    // In demo mode, incorporate seeded registered squads to showcase full hype stats
    const seedHype = eventConfig.isDemoMode ? (eventConfig.demoSeedTeamsRegistered || 128) : 0;
    const displayTotal = stats.total + seedHype;
    const gamingDisplay = stats.gaming + (eventConfig.isDemoMode ? Math.floor(seedHype * 0.65) : 0);
    const vrDisplay = stats.vr + (eventConfig.isDemoMode ? Math.floor(seedHype * 0.35) : 0);

    return NextResponse.json({
      success: true,
      edition: currentEdition,
      total: displayTotal,
      actual: stats.total,
      gaming: gamingDisplay,
      vr: vrDisplay,
      isDemoMode: Boolean(eventConfig.isDemoMode),
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to retrieve stats';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
