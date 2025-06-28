import { MetadataRoute } from 'next';
import { fetchWithFallback } from '@/utils/api-client';

// Helper function to safely parse dates
function safeDate(dateString: any): Date {
  if (!dateString) return new Date();
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date found:', dateString, 'using current date instead');
      return new Date();
    }
    return date;
  } catch (error) {
    console.warn('Error parsing date:', dateString, 'using current date instead');
    return new Date();
  }
}

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

    // Fetch dynamic posts with better error handling
    try {
      const response = await fetchWithFallback("?endpoint=posts&limit=100", {
        next: { revalidate: 3600 } // Revalidate every hour
      });
      
      if (response.ok) {
        const posts = await response.json();
        
        if (Array.isArray(posts)) {
          const postRoutes = posts
            .filter((post: any) => post && post.slug) // Filter out invalid posts
            .map((post: any) => ({
              url: `${baseUrl}/blog/${post.slug}`,
              lastModified: safeDate(post.updatedAt || post.createdAt),
              changeFrequency: 'weekly' as const,
              priority: 0.6,
            }));
          routes.push(...postRoutes);
        }
      }
    } catch (error) {
      console.error('Error fetching posts for sitemap:', error);
    }

    // Fetch portfolio items with better error handling
    try {
      const portfolioResponse = await fetchWithFallback("?endpoint=portfolio&limit=100", {
        next: { revalidate: 3600 }
      });
      
      if (portfolioResponse.ok) {
        const portfolioItems = await portfolioResponse.json();
        
        if (Array.isArray(portfolioItems)) {
          const portfolioRoutes = portfolioItems
            .filter((item: any) => item && item.slug) // Filter out invalid items
            .map((item: any) => ({
              url: `${baseUrl}/portfolio/${item.slug}`,
              lastModified: safeDate(item.updatedAt || item.createdAt),
              changeFrequency: 'weekly' as const,
              priority: 0.7,
            }));
          routes.push(...portfolioRoutes);
        }
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
