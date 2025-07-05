// BlogService using API Bridge instead of Prisma
import { getFallbackData, formatBlogForDisplay } from '@/utils/fallback-data';

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

class BlogServiceAPI {
  private apiBaseUrl: string;
  private isServer: boolean;
  private baseUrl: string;

  constructor() {
    // Check if we're on server or client
    this.isServer = typeof window === 'undefined';
    
    // Use environment variable or fallback to new hosting domain
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://balimoonartandspeace.com/api_bridge.php';
    
    // For build time and server-side, use full URL
    if (this.isServer) {
      this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bajramedia.com';
    } else {
      // For client-side, use relative URLs
      this.baseUrl = '';
    }
  }

  private getApiUrl(endpoint: string): string {
    // For server-side (build time), use full URL
    if (this.isServer) {
      return `${this.baseUrl}${endpoint}`;
    }
    // For client-side, use relative URL
    return endpoint;
  }

  async getAllPosts(page: number = 1, limit: number = 10): Promise<BlogPost[]> {
    try {
      // Use our API route with proper URL handling
      const url = this.getApiUrl(`/api/posts?page=${page}&limit=${limit}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const posts = await response.json();
      
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
      console.error('Error fetching posts:', error);
      console.log('🔄 API connection failed, loading fallback blog posts...');
      
      // Use fallback dummy data instead of empty array
      const fallbackData = getFallbackData();
      const formattedBlogPosts = formatBlogForDisplay(fallbackData.blogPosts);
      
      console.log('✅ Fallback blog posts loaded successfully:', formattedBlogPosts.length, 'posts');
      return formattedBlogPosts;
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      // Use our API route with proper URL handling
      const url = this.getApiUrl(`/api/posts/${slug}`);
      const response = await fetch(url);
      
      if (!response.ok) {
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
      console.error('Error fetching post:', error);
      console.log('🔄 API connection failed, trying fallback data for slug:', slug);
      
      // Try to find the post in fallback data
      const fallbackData = getFallbackData();
      const formattedBlogPosts = formatBlogForDisplay(fallbackData.blogPosts);
      const fallbackPost = formattedBlogPosts.find(p => p.slug === slug);
      
      if (fallbackPost) {
        console.log('✅ Found fallback post:', fallbackPost.title);
        return fallbackPost;
      }
      
      console.log('❌ Post not found in fallback data');
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
      console.log('🔄 API connection failed, loading fallback featured posts...');
      
      // Use fallback dummy data instead of empty array
      const fallbackData = getFallbackData();
      const formattedBlogPosts = formatBlogForDisplay(fallbackData.blogPosts);
      
      // Get featured posts from fallback data
      const featuredPosts = formattedBlogPosts.filter(post => post.featured === true);
      
      if (featuredPosts.length === 0) {
        console.log('🔄 No featured posts in fallback data, returning recent posts');
        return formattedBlogPosts.slice(0, limit);
      }
      
      console.log('✅ Fallback featured posts loaded successfully:', featuredPosts.length, 'posts');
      return featuredPosts.slice(0, limit);
    }
  }

  async getPostsByCategory(categorySlug: string, limit: number = 4): Promise<BlogPost[]> {
    try {
      const allPosts = await this.getAllPosts(1, 100);
      return allPosts.filter(post => post.category.slug === categorySlug).slice(0, limit);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      console.log('🔄 API connection failed, loading fallback posts by category:', categorySlug);
      
      // Use fallback dummy data
      const fallbackData = getFallbackData();
      const formattedBlogPosts = formatBlogForDisplay(fallbackData.blogPosts);
      const categoryPosts = formattedBlogPosts.filter(post => post.category.slug === categorySlug);
      
      console.log('✅ Fallback category posts loaded:', categoryPosts.length, 'posts');
      return categoryPosts.slice(0, limit);
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
      console.log('🔄 API connection failed, searching in fallback data for:', query);
      
      // Use fallback dummy data for search
      const fallbackData = getFallbackData();
      const formattedBlogPosts = formatBlogForDisplay(fallbackData.blogPosts);
      const searchTerm = query.toLowerCase();
      
      const searchResults = formattedBlogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );
      
      console.log('✅ Fallback search results found:', searchResults.length, 'posts');
      return searchResults;
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
