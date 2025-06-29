import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/config/api';

// Types for our content
interface BlogPost {
  slug: string;
  date: string;
  published: boolean;
}

interface PortfolioItem {
  slug: string;
  createdAt: string;
  published: boolean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bajramedia.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/web-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/mobile-apps`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/uiux-design`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/digital-marketing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/sistem-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/aset-game-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/sosial-media-management`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/consulting`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogResponse = await fetch(`${API_BASE_URL}?endpoint=posts&published=1`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (blogResponse.ok) {
      const blogData = await blogResponse.json();
      const posts: BlogPost[] = Array.isArray(blogData) ? blogData : blogData.posts || [];
      
      blogPages = posts
        .filter(post => post.published && post.slug)
        .map(post => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Dynamic portfolio items
  let portfolioPages: MetadataRoute.Sitemap = [];
  try {
    const portfolioResponse = await fetch(`${API_BASE_URL}?endpoint=portfolio&published=1`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (portfolioResponse.ok) {
      const portfolioData = await portfolioResponse.json();
      const portfolios: PortfolioItem[] = Array.isArray(portfolioData) ? portfolioData : portfolioData.portfolio || [];
      
      portfolioPages = portfolios
        .filter(item => item.published && item.slug)
        .map(item => ({
          url: `${baseUrl}/portfolio/${item.slug}`,
          lastModified: new Date(item.createdAt),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
    }
  } catch (error) {
    console.error('Error fetching portfolio items for sitemap:', error);
  }

  return [...staticPages, ...blogPages, ...portfolioPages];
}
