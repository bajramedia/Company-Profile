// This service connects to the backend API to fetch blog posts

export interface BlogPostAuthor {
  id?: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogCategory {
  id?: string;
  name: string;
  slug?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  featuredImage: string;
  date: string;
  category: string | BlogCategory;
  author: BlogPostAuthor;
  tags?: string[];
  readTime?: number;
  published?: boolean;
  views?: number;
}

// Helper to build API URL
const getApiUrl = (endpoint: string) => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL
    return `/api${endpoint}`;
  } else {
    // Server-side: use absolute URL  
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    return `${baseUrl}/api${endpoint}`;
  }
};

// Service class with methods for fetching blog posts
class BlogService {
  /**
   * Get featured blog posts
   * @param limit Number of posts to return
   * @returns Promise resolving to blog posts
   */
  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      const response = await fetch(getApiUrl(`/posts/featured?limit=${limit}`));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch featured posts: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  }
  
  /**
   * Get all blog posts, with optional pagination
   * @param page Page number (starts at 1)
   * @param limit Number of posts per page
   * @returns Promise resolving to blog posts array
   */
  async getAllPosts(page: number = 1, limit: number = 10): Promise<BlogPost[]> {
    try {
      const response = await fetch(getApiUrl(`/posts?page=${page}&limit=${limit}`));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
      
      const data = await response.json();
      
      // API returns { posts: [...], total, page, totalPages }
      // Return just the posts array
      return data.posts || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }
  
  /**
   * Get a single blog post by slug
   * @param slug The post slug
   * @returns Promise resolving to a blog post
   */  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(getApiUrl(`/posts/${slug}`), {
        cache: 'no-store', // Disable caching to ensure fresh data
        next: { revalidate: 30 } // Revalidate every 30 seconds as a fallback
      });
      
      if (response.status === 404) {
        console.log(`Post with slug "${slug}" not found`);
        return null;
      }
      
      if (!response.ok) {
        console.error(`Failed to fetch post: ${response.status}`);
        return null; // Return null instead of throwing to prevent UI crashes
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching post with slug "${slug}":`, error);
      return null;
    }
  }
  
  /**
   * Get posts by category
   * @param category Category slug
   * @param limit Number of posts to return
   * @returns Promise resolving to blog posts
   */
  async getPostsByCategory(category: string, limit: number = 4): Promise<BlogPost[]> {
    try {
      const response = await fetch(getApiUrl(`/posts/category/${category}?limit=${limit}`));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts by category: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching posts for category "${category}":`, error);
      return [];
    }
  }
  
  /**
   * Search posts by keyword
   * @param query Search query
   * @param limit Maximum number of results
   * @returns Promise resolving to blog posts
   */
  async searchPosts(query: string, limit: number = 10): Promise<BlogPost[]> {
    try {
      const response = await fetch(getApiUrl(`/posts/search?q=${encodeURIComponent(query)}&limit=${limit}`));
      
      if (!response.ok) {
        throw new Error(`Failed to search posts: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error searching posts with query "${query}":`, error);
      return [];
    }
  }
}

// Export a singleton instance
export const blogService = new BlogService();
