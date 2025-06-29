import { MetadataRoute } from 'next';

// Types for our content
interface BlogPost {
  slug: string;
  date: string;
  published: boolean;
  updated_at?: string;
}

interface PortfolioItem {
  slug: string;
  createdAt: string;
  published: boolean;
  updated_at?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.bajramedia.com';
  
  // Static pages dengan prioritas yang disesuaikan
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage - Prioritas tertinggi
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    
    // Main navigation pages
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
    
    // Service pages - Semua service pages
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
  ];

  // Dynamic blog posts - Menggunakan API yang sudah working
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    console.log('Fetching blog posts for sitemap...');
    
    // Use the working API bridge URL
    const blogResponse = await fetch('https://balimoonartandspeace.com/api_bridge.php?endpoint=posts&published=1', {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'BajramediaBot/1.0'
      }
    });
    
    if (blogResponse.ok) {
      const blogData = await blogResponse.json();
      console.log('Blog posts fetched:', Array.isArray(blogData) ? blogData.length : 'not array');
      
      if (Array.isArray(blogData) && blogData.length > 0) {
        blogPages = blogData
          .filter(post => post.published && post.slug)
          .map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at || post.date),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          }));
      }
    } else {
      console.warn('Blog API response not OK:', blogResponse.status);
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Dynamic portfolio items
  let portfolioPages: MetadataRoute.Sitemap = [];
  try {
    console.log('Fetching portfolio items for sitemap...');
    
    // Use the working API bridge URL  
    const portfolioResponse = await fetch('https://balimoonartandspeace.com/api_bridge.php?endpoint=portfolio&published=1', {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'BajramediaBot/1.0'
      }
    });
    
    if (portfolioResponse.ok) {
      const portfolioData = await portfolioResponse.json();
      console.log('Portfolio items fetched:', Array.isArray(portfolioData) ? portfolioData.length : 'not array');
      
      if (Array.isArray(portfolioData) && portfolioData.length > 0) {
        portfolioPages = portfolioData
          .filter(item => item.published && item.slug)
          .map(item => ({
            url: `${baseUrl}/portfolio/${item.slug}`,
            lastModified: new Date(item.updated_at || item.createdAt || item.date),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          }));
      }
    } else {
      console.warn('Portfolio API response not OK:', portfolioResponse.status);
    }
  } catch (error) {
    console.error('Error fetching portfolio items for sitemap:', error);
  }

  console.log(`Sitemap generated: ${staticPages.length} static pages, ${blogPages.length} blog pages, ${portfolioPages.length} portfolio pages`);
  
  return [...staticPages, ...blogPages, ...portfolioPages];
}
