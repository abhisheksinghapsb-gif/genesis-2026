/**
 * Lightweight privacy-friendly analytics helper.
 * Fires events when configured, no cookies, no tracking IDs stored.
 */

export type AnalyticsEvent =
  | { name: 'register_click'; placement: 'landing' | 'menu' | 'footer' | 'hud' | 'menu_drawer' | 'final' }
  | { name: 'nav_click'; destination: string }
  | { name: 'modal_open'; modalId: string }
  | { name: 'faq_open'; question: string };

export function trackEvent(
  eventOrName: AnalyticsEvent | string,
  payload?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  const eventDetail =
    typeof eventOrName === 'string'
      ? { name: eventOrName, ...(payload || {}) }
      : eventOrName;

  try {
    const customEvent = new CustomEvent('genesis_analytics', { detail: eventDetail });
    window.dispatchEvent(customEvent);
  } catch {
    // Silent fail
  }
}
