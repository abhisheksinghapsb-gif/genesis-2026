import { z } from 'zod';

export const SiteSchema = z.object({
  name: z.string(),
  edition: z.string(),
  year: z.number(),
  club: z.string(),
  clubAlias: z.string(),
  college: z.string(),
  registrationUrl: z.string(),
  contactEmail: z.string(),
  socials: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    })
  ),
  event: z.object({
    startISO: z.string(),
    endISO: z.string(),
    venue: z.string(),
    timezone: z.string(),
  }),
});

export const PrizeTrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  prizes: z.array(
    z.object({
      rank: z.number(),
      amount: z.number(),
    })
  ),
});

export const SponsorTierSchema = z.object({
  id: z.string(),
  title: z.string(),
  sponsors: z.array(
    z.object({
      name: z.string(),
      logo: z.string(),
      url: z.string(),
    })
  ),
});

export const TimelineStageSchema = z.object({
  n: z.number(),
  title: z.string(),
  startISO: z.string(),
  endISO: z.string(),
  venue: z.string(),
  summary: z.string(),
  details: z.string(),
  poster: z.string().optional(),
  link: z.string().optional(),
});

export const FaqItemSchema = z.object({
  q: z.string(),
  a: z.string(),
});

export type SiteConfig = z.infer<typeof SiteSchema>;
export type PrizeTrack = z.infer<typeof PrizeTrackSchema>;
export type SponsorTier = z.infer<typeof SponsorTierSchema>;
export type TimelineStage = z.infer<typeof TimelineStageSchema>;
export type FaqItem = z.infer<typeof FaqItemSchema>;
