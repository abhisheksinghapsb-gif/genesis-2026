import { describe, it, expect } from 'vitest';
import { formatPrize, calculateTotalPrize, formatDate, getTimelineStatus } from './format';
import { prizeTracks } from '@/content/prizes';

describe('Format utilities', () => {
  it('formats prize amount matching mockup without separators', () => {
    expect(formatPrize(17500)).toBe('₹17500');
    expect(formatPrize(10000)).toBe('₹10000');
    expect(formatPrize(5000)).toBe('₹5000');
  });

  it('calculates total prize pool correctly from configured tracks', () => {
    const total = calculateTotalPrize(prizeTracks);
    expect(total).toBe(60000);
  });

  it('handles TODO in dates gracefully', () => {
    expect(formatDate('TODO: 2026-03-20T09:00:00+05:30')).toBe('TBA');
    expect(formatDate('invalid-date')).toBe('TBA');
  });

  it('computes timeline stage status', () => {
    expect(getTimelineStatus('TODO', 'TODO')).toBeNull();

    const futureStart = new Date(Date.now() + 100000).toISOString();
    const futureEnd = new Date(Date.now() + 200000).toISOString();
    expect(getTimelineStatus(futureStart, futureEnd)).toBe('upcoming');

    const pastStart = new Date(Date.now() - 200000).toISOString();
    const pastEnd = new Date(Date.now() - 100000).toISOString();
    expect(getTimelineStatus(pastStart, pastEnd)).toBe('done');

    const liveStart = new Date(Date.now() - 50000).toISOString();
    const liveEnd = new Date(Date.now() + 50000).toISOString();
    expect(getTimelineStatus(liveStart, liveEnd)).toBe('live');
  });
});
