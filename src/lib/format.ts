/**
 * Prize and date formatting helpers for GENESIS 2026.
 */

/**
 * Renders amounts exactly as in the mockups (no thousands separators).
 * Example: 17500 -> '₹17500'
 */
export function formatPrize(amount: number): string {
  return `₹${amount}`;
}

/**
 * Calculates total prize pool from prize tracks.
 */
export function calculateTotalPrize(
  tracks: { prizes: { amount: number }[] }[]
): number {
  return tracks.reduce(
    (total, track) =>
      total + track.prizes.reduce((sum, p) => sum + p.amount, 0),
    0
  );
}

/**
 * Formats ISO date in Asia/Kolkata timezone.
 * Returns formatted string, or fallback if TODO.
 */
export function formatDate(isoString: string): string {
  if (isoString.includes('TODO')) {
    return 'TBA';
  }
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'TBA';
  }
}

/**
 * Determines stage timeline status based on current time vs start/end ISO in Asia/Kolkata.
 */
export function getTimelineStatus(
  startISO: string,
  endISO: string
): 'upcoming' | 'live' | 'done' | null {
  if (startISO.includes('TODO') || endISO.includes('TODO')) {
    return null;
  }
  try {
    const now = new Date().getTime();
    const start = new Date(startISO).getTime();
    const end = new Date(endISO).getTime();

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'done';
  } catch {
    return null;
  }
}
