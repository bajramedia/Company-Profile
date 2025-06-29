import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://bajramedia.com/sitemap.xml',
    host: 'https://balimoonartandspeace.com',
  };
}
