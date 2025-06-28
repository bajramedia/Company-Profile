'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export interface PortfolioData {
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string;
  images?: string[];
  clientName?: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  published: boolean;
  startDate?: Date;
  endDate?: Date;
  categoryId: string;
  tagIds: string[];
}

// Get all portfolios with pagination and filters
export async function getPortfolios(params: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  published?: boolean;
  search?: string;
} = {}) {
  const {
    page = 1,
    limit = 12,
    category,
    featured,
    published = true,
    search
  } = params;

  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      endpoint: 'portfolio',
      page: page.toString(),
      limit: limit.toString()
    });

    if (category) queryParams.append('category', category);
    if (featured !== undefined) queryParams.append('featured', featured.toString());
    if (published !== undefined) queryParams.append('published', published.toString());
    if (search) queryParams.append('search', search);

    const response = await fetch(`${API_BASE_URL}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Format response to match expected structure
    const portfolios = Array.isArray(data) ? data : data.portfolios || [];
    
    return {
      portfolios: portfolios.map((portfolio: any) => ({
        ...portfolio,
        images: portfolio.images ? JSON.parse(portfolio.images) : [],
        featured: portfolio.featured === "1" || portfolio.featured === 1 || portfolio.featured === true,
        published: portfolio.published === "1" || portfolio.published === 1 || portfolio.published === true,
        tags: portfolio.tags || [],
        viewCount: portfolio.views || 0
      })),
      pagination: {
        page,
        limit,
        total: portfolios.length,
        pages: Math.ceil(portfolios.length / limit)
      }
    };
    
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return {
      portfolios: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 }
    };
  }
}

// Get single portfolio by slug
export async function getPortfolioBySlug(slug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return null;
    }

    const portfolio = Array.isArray(data) ? data[0] : data;
    
    return {
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      featured: portfolio.featured === "1" || portfolio.featured === 1 || portfolio.featured === true,
      published: portfolio.published === "1" || portfolio.published === 1 || portfolio.published === true,
      tags: portfolio.tags || [],
      viewCount: portfolio.views || 0
    };
    
  } catch (error) {
    console.error('Error fetching portfolio by slug:', error);
    return null;
  }
}

// Create new portfolio
export async function createPortfolio(data: PortfolioData) {
  try {
    const portfolioData = {
      ...data,
      images: data.images ? JSON.stringify(data.images) : null,
      featured: data.featured ? 1 : 0,
      published: data.published ? 1 : 0,
      startDate: data.startDate ? data.startDate.toISOString().slice(0, 19).replace('T', ' ') : null,
      endDate: data.endDate ? data.endDate.toISOString().slice(0, 19).replace('T', ' ') : null,
      tags: data.tagIds || []
    };

    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(portfolioData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create portfolio');
    }

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    
    return { success: true, portfolio: result.data };
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return { success: false, error: 'Failed to create portfolio' };
  }
}

// Update portfolio
export async function updatePortfolio(id: string, data: PortfolioData) {
  try {
    const portfolioData = {
      ...data,
      images: data.images ? JSON.stringify(data.images) : null,
      featured: data.featured ? 1 : 0,
      published: data.published ? 1 : 0,
      startDate: data.startDate ? data.startDate.toISOString().slice(0, 19).replace('T', ' ') : null,
      endDate: data.endDate ? data.endDate.toISOString().slice(0, 19).replace('T', ' ') : null,
      tags: data.tagIds || []
    };

    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(portfolioData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update portfolio');
    }

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${data.slug}`);
    
    return { success: true, portfolio: result.data };
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return { success: false, error: 'Failed to update portfolio' };
  }
}

// Delete portfolio
export async function deletePortfolio(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete portfolio');
    }

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return { success: false, error: 'Failed to delete portfolio' };
  }
}

// Toggle portfolio featured status
export async function togglePortfolioFeatured(id: string, featured: boolean) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ featured: featured ? 1 : 0 })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update portfolio');
    }

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling portfolio featured:', error);
    return { success: false, error: 'Failed to update portfolio' };
  }
}

// Toggle portfolio published status
export async function togglePortfolioPublished(id: string, published: boolean) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ published: published ? 1 : 0 })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update portfolio');
    }

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling portfolio published:', error);
    return { success: false, error: 'Failed to update portfolio' };
  }
}

// Get portfolio categories
export async function getPortfolioCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio_categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const categories = await response.json();
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Error fetching portfolio categories:', error);
    return [];
  }
}

// Get portfolio tags
export async function getPortfolioTags() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio_tags`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tags = await response.json();
    return Array.isArray(tags) ? tags : [];
  } catch (error) {
    console.error('Error fetching portfolio tags:', error);
    return [];
  }
}

// Create portfolio category
export async function createPortfolioCategory(data: {
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio_categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create category');
    }

    revalidatePath('/admin/portfolio');
    return { success: true, category: result.data };
  } catch (error) {
    console.error('Error creating portfolio category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

// Create portfolio tag
export async function createPortfolioTag(data: {
  name: string;
  slug: string;
  color?: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio_tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create tag');
    }

    revalidatePath('/admin/portfolio');
    return { success: true, tag: result.data };
  } catch (error) {
    console.error('Error creating portfolio tag:', error);
    return { success: false, error: 'Failed to create tag' };
  }
}

// Track portfolio view
export async function trackPortfolioView(portfolioId: string, ipAddress?: string, userAgent?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portfolioId,
        ipAddress,
        userAgent,
        viewedAt: new Date().toISOString()
      })
    });

    if (response.ok) {
      const result = await response.json();
      return { success: result.success };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error tracking portfolio view:', error);
    return { success: false };
  }
} 