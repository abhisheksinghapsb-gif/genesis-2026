import { describe, it, expect } from 'vitest';
import {
  SiteSchema,
  PrizeTrackSchema,
  SponsorTierSchema,
  TimelineStageSchema,
  FaqItemSchema,
} from './schema';
import { site } from '@/content/site';
import { prizeTracks } from '@/content/prizes';
import { sponsorTiers } from '@/content/sponsors';
import { timeline } from '@/content/timeline';
import { faqs } from '@/content/faqs';

describe('Zod Content Schemas', () => {
  it('validates site configuration', () => {
    const parsed = SiteSchema.safeParse(site);
    expect(parsed.success).toBe(true);
  });

  it('validates prize tracks', () => {
    for (const track of prizeTracks) {
      const parsed = PrizeTrackSchema.safeParse(track);
      expect(parsed.success).toBe(true);
    }
  });

  it('validates sponsor tiers', () => {
    for (const tier of sponsorTiers) {
      const parsed = SponsorTierSchema.safeParse(tier);
      expect(parsed.success).toBe(true);
    }
  });

  it('validates timeline stages', () => {
    for (const stage of timeline) {
      const parsed = TimelineStageSchema.safeParse(stage);
      expect(parsed.success).toBe(true);
    }
  });

  it('validates all FAQs', () => {
    expect(faqs.length).toBe(10);
    for (const item of faqs) {
      const parsed = FaqItemSchema.safeParse(item);
      expect(parsed.success).toBe(true);
    }
  });
});
