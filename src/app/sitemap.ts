import { MetadataRoute } from 'next';
import { blogService } from '@/services/BlogService.api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const posts = await blogService.getAllPosts(1, 100);
  
  const blogPosts = posts.map((post) => ({
    url: `https://bajramedia.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add static routes
  const routes = [
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
    // Add more static routes as needed
  ];

  return [...routes, ...blogPosts];
}
