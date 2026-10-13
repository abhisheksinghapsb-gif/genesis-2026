// iCalendar (.ics) download helper for GENESIS 2026
import eventConfig from '@/content/event.json';

interface CalendarEventOptions {
  teamId?: string;
  teamName?: string;
  track?: string;
}

function formatIcsDate(isoString: string): string {
  const date = new Date(isoString);
  // Convert to UTC YYYYMMDDTHHmmssZ
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function generateIcsContent(options?: CalendarEventOptions): string {
  const start = formatIcsDate(eventConfig.startDate);
  const end = formatIcsDate(eventConfig.endDate);
  const now = formatIcsDate(new Date().toISOString());

  const summary = `${eventConfig.name} - GDXR Gaming & VR Tournament`;
  const location = `${eventConfig.venue}, ${eventConfig.institution}`;
  
  let description = `${eventConfig.name}: 5th Edition of GDXR Club Gaming and VR Tournament.`;
  if (options?.teamId) {
    description += `\\nRegistered Squad: ${options.teamName || 'Your Team'} (ID: ${options.teamId})\\nTrack: ${options.track || 'Gaming/VR'}`;
  }
  description += `\\nReporting Time: 09:00 AM IST with College/Govt Photo ID.\\nContact: ${eventConfig.contactEmail}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GDXR Club//GENESIS 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:genesis-2026-${options?.teamId || 'public'}@aitpune.edu.in`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:GENESIS 2026 Tournament Check-in Tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcsCalendar(options?: CalendarEventOptions): void {
  const icsData = generateIcsContent(options);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'genesis-2026-tournament.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
