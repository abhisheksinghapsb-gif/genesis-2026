import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genesis2026.aitpune.edu.in';

  const routes = [''];

  return routes.map((route) => ({
    url: `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  }));
}
