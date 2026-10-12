/**
 * Client-side iCalendar (.ics) generator (Feature F-04)
 * Hidden or disabled when dates are 'TODO:' placeholders.
 */

export interface CalendarEventParams {
  title: string;
  description: string;
  startISO: string;
  endISO: string;
  venue?: string;
}

export function isRealDate(isoString: string): boolean {
  if (!isoString || isoString.includes('TODO')) return false;
  const d = new Date(isoString);
  return !isNaN(d.getTime());
}

export function generateIcsBlobUrl({
  title,
  description,
  startISO,
  endISO,
  venue = 'AIT Pune',
}: CalendarEventParams): string | null {
  if (!isRealDate(startISO) || !isRealDate(endISO)) return null;

  const formatDate = (iso: string) => {
    return new Date(iso).toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GDXR Club//GENESIS 2026//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${venue}`,
    `DTSTART:${formatDate(startISO)}`,
    `DTEND:${formatDate(endISO)}`,
    `DTSTAMP:${formatDate(new Date().toISOString())}`,
    `UID:${Date.now()}@genesis2026.aitpune.edu.in`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  return URL.createObjectURL(blob);
}
