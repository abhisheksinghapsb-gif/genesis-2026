import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import eventConfig from '@/content/event.json';

export async function GET(req: NextRequest) {
  try {
    const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    const authHeader = req.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || 'genesis-secret-admin-key';
    const hasBearer = authHeader && (authHeader === `Bearer ${adminSecret}` || authHeader === 'Bearer dev-admin-token');
    const searchParams = req.nextUrl.searchParams;
    const isDevParam = searchParams.get('dev') === 'true';

    // Allow mock admin in dev/test or if authorized
    if (!isDevOrTest && !hasBearer) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    if (isDevOrTest && !hasBearer && !isDevParam) {
      // Return helpful message and dev instructions
      return NextResponse.json(
        {
          message: 'Admin endpoint accessible in dev mode with ?dev=true or Authorization: Bearer dev-admin-token',
          isDev: true,
        },
        { status: 200 }
      );
    }

    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const edition = searchParams.get('edition') || eventConfig.edition || 'genesis-2026';

    const db = getDb();
    const result = await db.listRegistrations(edition, limit, offset);

    return NextResponse.json({
      success: true,
      edition,
      items: result.items,
      total: result.total,
      limit,
      offset,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal admin error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
