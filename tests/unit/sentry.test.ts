import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isMonitoringEnabled,
  initMonitoring,
  captureException,
  captureMessage,
} from '@/lib/monitoring/sentry';

describe('Phase 9: Sentry Monitoring Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.SENTRY_DSN;
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('is disabled and no-ops when SENTRY_DSN is absent', () => {
    expect(isMonitoringEnabled()).toBe(false);

    const consoleSpy = vi.spyOn(console, 'error');
    captureException(new Error('Test error'));
    expect(consoleSpy).not.toHaveBeenCalled();

    const logSpy = vi.spyOn(console, 'info');
    captureMessage('Test info');
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('activates when SENTRY_DSN is set', () => {
    process.env.SENTRY_DSN = 'https://fake-key@o0.ingest.sentry.io/0000000';
    expect(isMonitoringEnabled()).toBe(true);

    initMonitoring();

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    captureException(new Error('Live error'), { route: '/api/register' });
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Monitoring] Exception captured:',
      expect.any(Error),
      { route: '/api/register' }
    );
  });
});
