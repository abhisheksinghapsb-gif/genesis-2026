/**
 * Lightweight privacy-friendly analytics helper.
 * Fires events when configured, no cookies, no tracking IDs stored.
 */

type AnalyticsEvent =
  | { name: 'register_click'; placement: 'landing' | 'menu' | 'footer' }
  | { name: 'nav_click'; destination: string }
  | { name: 'modal_open'; modalId: string }
  | { name: 'faq_open'; question: string };

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  // In production, can forward to Cloudflare Web Analytics / Plausible / Vercel
  if (process.env.NODE_ENV === 'development') {
    // console.log in dev only if enabled
    return;
  }

  // Forward to standard custom event if an analytics script is listening
  try {
    const customEvent = new CustomEvent('genesis_analytics', { detail: event });
    window.dispatchEvent(customEvent);
  } catch {
    // Silent fail
  }
}
