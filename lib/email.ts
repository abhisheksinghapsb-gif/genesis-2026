// Email Provider Layer: MockEmailProvider & ResendEmailProvider

export interface EmailOptions {
  to: string;
  teamName: string;
  teamId: string;
  track: 'gaming' | 'vr';
  leaderName: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface EmailProvider {
  sendRegistrationConfirmation(options: EmailOptions): Promise<EmailResult>;
}

// ---------------------------------------------------------------------------
// 1. Mock Email Provider (Dev & Test default)
// ---------------------------------------------------------------------------
export class MockEmailProvider implements EmailProvider {
  public sentEmails: (EmailOptions & { sentAt: string; id: string })[] = [];

  async sendRegistrationConfirmation(options: EmailOptions): Promise<EmailResult> {
    const id = `mock-email-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record = {
      ...options,
      sentAt: new Date().toISOString(),
      id,
    };
    this.sentEmails.push(record);

    if (process.env.NODE_ENV !== 'test') {
      console.info(
        `[Email Mock] Sent registration confirmation to: ${options.to} | Squad: ${options.teamName} (${options.teamId})`
      );
    }

    return { success: true, id };
  }

  public clear(): void {
    this.sentEmails = [];
  }
}

// ---------------------------------------------------------------------------
// 2. Resend Email Provider (Production)
// ---------------------------------------------------------------------------
export class ResendEmailProvider implements EmailProvider {
  private apiKey: string;
  private from: string;

  constructor(apiKey: string, from?: string) {
    this.apiKey = apiKey;
    this.from = from || process.env.EMAIL_FROM || 'GENESIS 2026 <no-reply@genesis-gdxr.com>';
  }

  private buildHtml(options: EmailOptions): string {
    const trackLabel = options.track === 'gaming' ? '🎮 Gaming Championship' : '🥽 VR Immersion Track';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GENESIS 2026 - Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #060D24; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #FFFFFF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #060D24; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0E2054; border: 4px solid #F59E0B; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 0 #000000;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(180deg, #F97316 0%, #EA580C 100%); padding: 24px; text-align: center; border-bottom: 4px solid #000000;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #FFFFFF; text-shadow: 2px 2px 0 #000000; letter-spacing: 1px;">
                GENESIS 2026
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #FEF08A; text-shadow: 1px 1px 0 #000000; text-transform: uppercase;">
                GDXR Club • Army Institute of Technology, Pune
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #FBBF24; text-shadow: 1px 1px 0 #000000;">
                SQUAD REGISTRATION CONFIRMED!
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #E2E8F0;">
                Greetings <strong>${options.leaderName}</strong>, your battle squad has successfully entered the arena for GENESIS 2026. Keep this confirmation safe for physical check-in.
              </p>

              <!-- Squad ID Card -->
              <table role="presentation" width="100%" style="background-color: #1E293B; border: 3px solid #38BDF8; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px;">
                    <div style="font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">OFFICIAL TEAM IDENTIFIER</div>
                    <div style="font-size: 24px; font-weight: 900; color: #38BDF8; letter-spacing: 2px; margin: 4px 0 12px 0;">${options.teamId}</div>

                    <div style="font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">SQUAD NAME</div>
                    <div style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 2px 0 12px 0;">${options.teamName}</div>

                    <div style="font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">COMPETITIVE TRACK</div>
                    <div style="font-size: 16px; font-weight: 700; color: #FBBF24; margin-top: 2px;">${trackLabel}</div>
                  </td>
                </tr>
              </table>

              <!-- Event Details -->
              <table role="presentation" width="100%" style="border-top: 2px dashed #334155; padding-top: 16px; margin-bottom: 20px;">
                <tr>
                  <td style="font-size: 14px; color: #CBD5E1; line-height: 1.6;">
                    📍 <strong>Venue:</strong> AIT Pune Campus Arena<br>
                    📅 <strong>Dates:</strong> December 12 - 13, 2026<br>
                    🛡️ <strong>Check-in:</strong> 09:00 AM IST with Student ID / Govt ID
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <div style="text-align: center; margin-top: 28px;">
                <a href="https://discord.gg/genesis-gdxr" style="display: inline-block; background-color: #5865F2; color: #FFFFFF; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 10px; border: 2px solid #000000; box-shadow: 0 4px 0 #000000;">
                  JOIN TOURNAMENT DISCORD
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0B132B; padding: 16px 24px; text-align: center; border-top: 2px solid #1E293B; font-size: 12px; color: #64748B;">
              © 2026 GDXR Club, Army Institute of Technology, Pune. Questions? Email <a href="mailto:gdxr@aitpune.edu.in" style="color: #38BDF8; text-decoration: none;">gdxr@aitpune.edu.in</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  async sendRegistrationConfirmation(options: EmailOptions): Promise<EmailResult> {
    try {
      const htmlContent = this.buildHtml(options);
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: [options.to],
          subject: `⚡ GENESIS 2026 - Squad Registration Confirmed [${options.teamId}]`,
          html: htmlContent,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { success: false, error: `Resend error: ${res.status} ${errorText}` };
      }

      const data = (await res.json()) as { id: string };
      return { success: true, id: data.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown email dispatch error';
      return { success: false, error: msg };
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Factory & Global Instance Management
// ---------------------------------------------------------------------------
let activeEmailProvider: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (activeEmailProvider) {
    return activeEmailProvider;
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && !resendKey.includes('re_1234')) {
    activeEmailProvider = new ResendEmailProvider(resendKey);
  } else {
    activeEmailProvider = new MockEmailProvider();
  }

  return activeEmailProvider;
}

export function setEmailProvider(provider: EmailProvider | null): void {
  activeEmailProvider = provider;
}
