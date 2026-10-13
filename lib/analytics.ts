// Tiny zero-dependency analytics helper
// Completely no-op unless NEXT_PUBLIC_ANALYTICS_URL is explicitly configured

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

export function track(event: string, properties?: Record<string, unknown>): void {
  const analyticsUrl = process.env.NEXT_PUBLIC_ANALYTICS_URL;
  if (!analyticsUrl) {
    return; // Silent no-op
  }

  const payload: AnalyticsEvent = {
    event,
    properties,
    timestamp: new Date().toISOString(),
  };

  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(analyticsUrl, blob);
    } else if (typeof fetch !== 'undefined') {
      fetch(analyticsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently swallow analytics dispatch errors
      });
    }
  } catch {
    // Non-blocking fail-safe
  }
}
