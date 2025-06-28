import { MetadataRoute } from 'next';
import { fetchWithFallback } from '@/utils/api-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bajramedia.com';

  try {
    // Basic routes
    const routes = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/portfolio`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ];

    // Fetch dynamic posts
    try {
      const response = await fetchWithFallback("?endpoint=posts&limit=100", {
        next: { revalidate: 3600 } // Revalidate every hour
      });
      
      if (response.ok) {
        const posts = await response.json();
        const postRoutes = posts.map((post: any) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
        routes.push(...postRoutes);
      }
    } catch (error) {
      console.error('Error fetching posts for sitemap:', error);
    }

    // Fetch portfolio items
    try {
      const portfolioResponse = await fetchWithFallback("?endpoint=portfolio&limit=100", {
        next: { revalidate: 3600 }
      });
      
      if (portfolioResponse.ok) {
        const portfolioItems = await portfolioResponse.json();
        const portfolioRoutes = portfolioItems.map((item: any) => ({
          url: `${baseUrl}/portfolio/${item.slug}`,
          lastModified: new Date(item.updatedAt || item.createdAt || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
        routes.push(...portfolioRoutes);
      }
    } catch (error) {
      console.error('Error fetching portfolio for sitemap:', error);
    }

    return routes;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic routes as fallback
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/portfolio`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
