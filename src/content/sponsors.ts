import type { SponsorTier } from '@/lib/schema';

export const sponsorTiers: SponsorTier[] = [
  {
    id: 'title',
    title: 'TITLE SPONSORS',
    sponsors: [
      {
        name: 'GameCloud Technologies Private Limited',
        logo: '/sponsors/gamecloud.png',
        url: 'TODO: https://gamecloud-ltd.com',
      },
    ],
  },
  {
    id: 'platform',
    title: 'PLATFORM SPONSORS',
    sponsors: [
      {
        name: 'Gamedoora',
        logo: '/sponsors/gamedoora.png',
        url: 'TODO: https://gamedoora.com',
      },
    ],
  },
];

export const sponsors = sponsorTiers;
