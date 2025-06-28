// BlogService using API Bridge instead of Prisma
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage: string;
  published: boolean;
  featured: boolean;
  date: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  views?: number;
  readTime?: number;
  tags?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Utility function to calculate read time
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(word => word.length > 0);
  const readTime = Math.ceil(words.length / wordsPerMinute);
  return readTime;
}

// Helper function to get the correct base URL for API calls
function getApiBaseUrl(): string {
  // During build time or server-side rendering
  if (typeof window === 'undefined') {
    // Check if we're in a Vercel environment
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    // Check if we have a custom domain
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }
    // Fallback for local development
    return process.env.NODE_ENV === 'production' 
      ? 'https://bajramedia.com' 
      : 'http://localhost:3000';
  }
  
  // Client-side: use relative URLs
  return '';
}

class BlogServiceAPI {
  private apiBaseUrl: string;

  constructor() {
    // Use environment variable or fallback
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.bajramedia.com/api_bridge.php';
  }

  async getAllPosts(page: number = 1, limit: number = 10): Promise<BlogPost[]> {
    try {
      // Build URL with proper base for build-time vs runtime
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/api/posts?page=${page}&limit=${limit}`;
      
      console.log('📡 BlogService: Fetching posts from', url);
      
      // Use our API route instead of direct API bridge
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ BlogService: HTTP error ${response.status} for ${url}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const posts = await response.json();
      
      if (!Array.isArray(posts)) {
        console.warn('⚠️ BlogService: Posts response is not an array:', posts);
        return [];
      }
      
      // Posts are already formatted by our API route
      return posts.map((post: any) => ({
        ...post,
        date: post.date || post.createdAt,
        featured: post.featured || false,
        readTime: parseInt(post.readTime) || calculateReadTime(post.content || ''),
        author: {
          id: post.author?.id || '1',
          name: post.author?.name || 'Unknown Author',
          email: post.author?.email || '',
          avatar: post.author?.avatar || '',
          bio: post.author?.bio || ''
        },
        category: {
          id: post.category?.id || '1',
          name: post.category?.name || 'Uncategorized',
          slug: post.category?.slug || 'uncategorized',
        },
        views: post.views || 0
      }));
    } catch (error) {
      console.error('❌ BlogService: Error fetching posts:', error);
      
      // During build time, return empty array instead of crashing
      if (typeof window === 'undefined') {
        console.log('🔄 BlogService: Build-time fallback, returning empty posts array');
        return [];
      }
      
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      // Build URL with proper base for build-time vs runtime
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/api/posts/${slug}`;
      
      console.log('📡 BlogService: Fetching post from', url);
      
      // Use our API route instead of direct API bridge
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ BlogService: HTTP error ${response.status} for ${url}`);
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const post = await response.json();
      
      if (!post) return null;
      
      // Post is already formatted by our API route
      return {
        ...post,
        date: post.date || post.createdAt,
        featured: post.featured || false,
        readTime: parseInt(post.readTime) || calculateReadTime(post.content || ''),
        author: {
          id: post.author?.id || '1',
          name: post.author?.name || 'Unknown Author',
          email: post.author?.email || '',
          avatar: post.author?.avatar || '',
          bio: post.author?.bio || ''
        },
        category: {
          id: post.category?.id || '1',
          name: post.category?.name || 'Uncategorized',
          slug: post.category?.slug || 'uncategorized',
        },
        views: post.views || 0
      };
    } catch (error) {
      console.error('❌ BlogService: Error fetching post:', error);
      
      // During build time, return null instead of crashing
      if (typeof window === 'undefined') {
        console.log('🔄 BlogService: Build-time fallback, returning null for post');
        return null;
      }
      
      return null;
    }
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      console.log('🔍 Fetching featured posts...');
      const allPosts = await this.getAllPosts(1, 100);
      console.log('📊 Total posts fetched:', allPosts.length);
      
      // Debug: Check featured field in posts
      console.log('🏷️ Featured status check:', allPosts.map(post => ({ 
        title: post.title.substring(0, 30) + '...', 
        featured: post.featured 
      })));
      
      // Try to get featured posts first
      const featuredPosts = allPosts.filter(post => post.featured === true);
      console.log('⭐ Featured posts found:', featuredPosts.length);
      
      // If no featured posts found, return the most recent posts instead
      if (featuredPosts.length === 0) {
        console.log('🔄 No featured posts found, returning recent posts instead');
        const recentPosts = allPosts.slice(0, limit);
        console.log('📈 Returning recent posts:', recentPosts.length);
        return recentPosts;
      }
      
      console.log('✅ Returning featured posts:', featuredPosts.length);
      return featuredPosts.slice(0, limit);
    } catch (error) {
      console.error('❌ Error fetching featured posts:', error);
      return [];
    }
  }

  async getPostsByCategory(categorySlug: string, limit: number = 4): Promise<BlogPost[]> {
    try {
      const allPosts = await this.getAllPosts(1, 100);
      return allPosts.filter(post => post.category.slug === categorySlug).slice(0, limit);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return [];
    }
  }

  async searchPosts(query: string): Promise<BlogPost[]> {
    try {
      const allPosts = await this.getAllPosts(1, 100);
      const searchTerm = query.toLowerCase();
      
      return allPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }

  async getCategories(): Promise<BlogCategory[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}?endpoint=categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async trackPostView(postId: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}?endpoint=post-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });
    } catch (error) {
      console.error('Error tracking post view:', error);
    }
  }
}

// Export singleton instance
export const blogService = new BlogServiceAPI();
export { BlogServiceAPI };
