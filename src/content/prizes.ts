import type { PrizeTrack } from '@/lib/schema';

export const prizeTracks: PrizeTrack[] = [
  {
    id: 'main',
    title: 'PRIZES',
    prizes: [
      { rank: 1, amount: 17500 },
      { rank: 2, amount: 15000 },
      { rank: 3, amount: 12500 },
    ],
  },
  {
    id: 'vr',
    title: 'VR TRACK',
    prizes: [
      { rank: 1, amount: 10000 },
      { rank: 2, amount: 5000 },
    ],
  },
];

export const prizePool = prizeTracks;
