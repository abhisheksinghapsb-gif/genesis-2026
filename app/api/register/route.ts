import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validation';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { checkRateLimit } from '@/lib/ratelimit';
import { getDb } from '@/lib/db';
import { getEmailProvider } from '@/lib/email';
import eventConfig from '@/content/event.json';

export async function POST(req: NextRequest) {
  try {
    // 1. Identify Client IP for rate-limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0]?.trim() || '127.0.0.1' : '127.0.0.1';

    // 2. Enforce Rate Limiting (5 registration requests per minute per IP)
    const rateLimit = await checkRateLimit(`register:${clientIp}`, 5, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a minute before submitting another squad registration.',
          reset: rateLimit.reset,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.max(1, rateLimit.reset - Math.floor(Date.now() / 1000))),
          },
        }
      );
    }

    // 3. Parse JSON Body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload received' }, { status: 400 });
    }

    // 4. Validate Request Schema using Zod
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      const flattened = validationResult.error.flatten();
      const firstErrorMessage =
        validationResult.error.errors[0]?.message || 'Form validation failed. Please check inputs.';
      return NextResponse.json(
        {
          error: firstErrorMessage,
          fieldErrors: flattened.fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 5. Cloudflare Turnstile Bot Protection Verification
    const turnstileResult = await verifyTurnstileToken(data.turnstileToken, clientIp);
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          error: turnstileResult.error || 'Turnstile bot challenge verification failed.',
        },
        { status: 400 }
      );
    }

    // 6. Check for duplicate registrations per tournament edition
    const db = getDb();
    const currentEdition = eventConfig.edition || 'genesis-2026';

    const existingEmail = await db.findByEmail(data.leaderEmail, currentEdition);
    if (existingEmail) {
      return NextResponse.json(
        {
          error: `A team with leader email '${data.leaderEmail}' is already registered for ${eventConfig.name}.`,
          code: 'DUPLICATE_LEADER_EMAIL',
        },
        { status: 409 }
      );
    }

    const existingPhone = await db.findByPhone(data.leaderPhone, currentEdition);
    if (existingPhone) {
      return NextResponse.json(
        {
          error: `A team with leader phone number is already registered for ${eventConfig.name}.`,
          code: 'DUPLICATE_LEADER_PHONE',
        },
        { status: 409 }
      );
    }

    // 7. Insert Registration into Database
    const record = await db.createRegistration(data);

    // 8. Dispatch Confirmation Email (asynchronously, non-blocking failure)
    try {
      const emailProvider = getEmailProvider();
      await emailProvider.sendRegistrationConfirmation({
        to: record.leader_email,
        teamName: record.team_name,
        teamId: record.team_id,
        track: record.track,
        leaderName: record.leader_name,
      });
    } catch (emailErr) {
      console.warn('[Registration] Warning: Failed to send confirmation email:', emailErr);
    }

    // 9. Respond with 201 Created and Team Details
    return NextResponse.json(
      {
        success: true,
        message: 'Squad successfully registered for GENESIS 2026!',
        teamId: record.team_id,
        teamName: record.team_name,
        track: record.track,
        college: record.college,
        city: record.city,
        leaderName: record.leader_name,
        leaderEmail: record.leader_email,
        memberCount: (record.members?.length || 0) + 1,
        createdAt: record.created_at,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Registration API Error]:', error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
