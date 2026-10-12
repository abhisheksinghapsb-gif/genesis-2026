import type { SiteConfig } from '@/lib/schema';

export const site: SiteConfig = {
  name: 'GENESIS',
  edition: 'Fifth Edition',
  year: 2026,
  club: 'GDXR Club',
  clubAlias: 'AR/VR Club',
  college: 'AIT Pune',
  registrationUrl: process.env.NEXT_PUBLIC_REGISTRATION_URL ?? '',
  contactEmail: 'TODO: contact@gdxrclub.com',
  socials: [
    { label: 'Instagram', url: 'TODO: https://instagram.com/gdxr_ait' },
    { label: 'LinkedIn', url: 'TODO: https://linkedin.com/company/gdxr-ait' },
    { label: 'Discord', url: 'TODO: https://discord.gg/genesis2026' },
  ],
  event: {
    startISO: 'TODO: 2026-03-20T09:00:00+05:30',
    endISO: 'TODO: 2026-03-22T18:00:00+05:30',
    venue: 'TODO: Army Institute of Technology, Pune',
    timezone: 'Asia/Kolkata',
  },
};

export const siteConfig = site;
