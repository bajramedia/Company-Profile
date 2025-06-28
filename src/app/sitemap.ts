import { MetadataRoute } from 'next';
  
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes (always available)
  const staticRoutes = [
    {
      url: 'https://bajramedia.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://bajramedia.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: 'https://bajramedia.com/portfolio',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://bajramedia.com/services',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Try to get blog posts from API bridge
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.bajramedia.com/api_bridge.php";
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&limit=100`, {
      // Add timeout to prevent hanging during build
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (response.ok) {
      const posts = await response.json();
      
      const blogPosts = posts
        .filter((post: any) => post.id && post.id !== '' && post.slug) // Filter valid posts
        .map((post: any) => ({
          url: `https://bajramedia.com/blog/${post.slug}`,
          lastModified: new Date(post.date || post.createdAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));

      return [...staticRoutes, ...blogPosts];
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    // Continue with static routes only if API fails
  }

  // Return static routes if API fails
  return staticRoutes;
}
