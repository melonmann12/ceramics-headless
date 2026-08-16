import type { MetadataRoute } from 'next';
// Phase 4: import { getAllProductHandles } from '@/lib/shopify/queries';

const baseUrl = 'https://oura-ceramics.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Phase 4: uncomment to pull real handles from Shopify
  // const handles = await getAllProductHandles();
  // const productUrls: MetadataRoute.Sitemap = handles.map((handle) => ({
  //   url: `${baseUrl}/product/${handle}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly',
  //   priority: 0.8,
  // }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [
    ...staticUrls,
    // Phase 4: ...productUrls,
  ];
}
