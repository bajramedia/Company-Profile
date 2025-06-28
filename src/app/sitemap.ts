import { MetadataRoute } from 'next';

// Required for static export
export const dynamic = 'force-static';
  
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bajramedia.com';

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ];

  // Service pages
  const serviceRoutes = [
    'web-development',
    'uiux-design',
    'mobile-apps',
    'sistem-development',
    'digital-marketing',
    'consulting',
    'sosial-media-management',
    'aset-game-development'
  ].map(service => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
        }));

  // For static export, we'll skip dynamic content fetching
  // In production with server, you would fetch posts and portfolio here
  
  return [...staticRoutes, ...serviceRoutes];
}
