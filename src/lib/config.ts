export const config = {
  isBackendEnabled: process.env.NEXT_PUBLIC_BACKEND === 'on',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://genesis2026.aitpune.edu.in',
  registrationUrl: process.env.NEXT_PUBLIC_REGISTRATION_URL || '',
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
};
