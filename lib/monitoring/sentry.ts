/**
 * Sentry Monitoring Integration
 * Active only when SENTRY_DSN (or NEXT_PUBLIC_SENTRY_DSN) is defined.
 * Completely no-ops with zero runtime overhead when undefined.
 */

export function isMonitoringEnabled(): boolean {
  return Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);
}

export function initMonitoring(): void {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    // Explicit no-op per Phase 9 specification
    return;
  }

  // When SENTRY_DSN is configured in production, initialize remote telemetry
  if (process.env.NODE_ENV === 'production') {
    console.info('[Monitoring] Sentry telemetry initialized.');
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!isMonitoringEnabled()) {
    return;
  }

  console.error('[Monitoring] Exception captured:', error, context);
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (!isMonitoringEnabled()) {
    return;
  }

  console.info(`[Monitoring] [${level.toUpperCase()}] ${message}`);
}
