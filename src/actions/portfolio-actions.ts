'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

  const skip = (page - 1) * limit;

  const where: any = {};
  
  if (published !== undefined) {
    where.published = published;
  }
  
  if (featured !== undefined) {
    where.featured = featured;
  }
  
  if (category) {
    where.category = { slug: category };
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { clientName: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [portfolios, total] = await Promise.all([
    prisma.portfolio.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            portfolioViews: true
          }
        }
      }
    }),
    prisma.portfolio.count({ where })
  ]);

  return {
    portfolios: portfolios.map(portfolio => ({
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      tags: portfolio.tags.map(pt => pt.tag),
      viewCount: portfolio._count.portfolioViews
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// Get single portfolio by slug
export async function getPortfolioBySlug(slug: string) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: {
        include: {
          tag: true
        }
      },
      _count: {
        select: {
          portfolioViews: true
        }
      }
    }
  });

  if (!portfolio) {
    return null;
  }

  return {
    ...portfolio,
    images: portfolio.images ? JSON.parse(portfolio.images) : [],
    tags: portfolio.tags.map(pt => pt.tag),
    viewCount: portfolio._count.portfolioViews
  };
}

// Create new portfolio
export async function createPortfolio(data: PortfolioData) {
  try {
    const { tagIds, images, ...portfolioData } = data;

    const portfolio = await prisma.portfolio.create({
      data: {
        ...portfolioData,
        images: images ? JSON.stringify(images) : null,
        tags: {
          create: tagIds.map(tagId => ({
            tagId
          }))
        }
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    
    return { success: true, portfolio };
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return { success: false, error: 'Failed to create portfolio' };
  }
}

// Update portfolio
export async function updatePortfolio(id: string, data: PortfolioData) {
  try {
    const { tagIds, images, ...portfolioData } = data;

    // Delete existing tags
    await prisma.portfolioTags.deleteMany({
      where: { portfolioId: id }
    });

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        ...portfolioData,
        images: images ? JSON.stringify(images) : null,
        tags: {
          create: tagIds.map(tagId => ({
            tagId
          }))
        }
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${portfolio.slug}`);
    
    return { success: true, portfolio };
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return { success: false, error: 'Failed to update portfolio' };
  }
}

// Delete portfolio
export async function deletePortfolio(id: string) {
  try {
    await prisma.portfolio.delete({
      where: { id }
    });

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return { success: false, error: 'Failed to delete portfolio' };
  }
}

// Toggle portfolio published status
export async function togglePortfolioPublished(id: string) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id }
    });

    if (!portfolio) {
      return { success: false, error: 'Portfolio not found' };
    }

    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        published: !portfolio.published
      }
    });

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    
    return { success: true, portfolio: updated };
  } catch (error) {
    console.error('Error toggling portfolio published:', error);
    return { success: false, error: 'Failed to toggle published status' };
  }
}

// Toggle portfolio featured status
export async function togglePortfolioFeatured(id: string) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id }
    });

    if (!portfolio) {
      return { success: false, error: 'Portfolio not found' };
    }

    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        featured: !portfolio.featured
      }
    });

    revalidatePath('/admin/portfolio');
    revalidatePath('/portfolio');
    
    return { success: true, portfolio: updated };
  } catch (error) {
    console.error('Error toggling portfolio featured:', error);
    return { success: false, error: 'Failed to toggle featured status' };
  }
}

// Get portfolio categories
export async function getPortfolioCategories() {
  return await prisma.portfolioCategory.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          portfolios: true
        }
      }
    }
  });
}

// Get portfolio tags
export async function getPortfolioTags() {
  return await prisma.portfolioTag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          portfolios: true
        }
      }
    }
  });
}

// Create portfolio category
export async function createPortfolioCategory(data: {
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}) {
  try {
    const category = await prisma.portfolioCategory.create({
      data
    });

    revalidatePath('/admin/portfolio');
    return { success: true, category };
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
    const tag = await prisma.portfolioTag.create({
      data
    });

    revalidatePath('/admin/portfolio');
    return { success: true, tag };
  } catch (error) {
    console.error('Error creating portfolio tag:', error);
    return { success: false, error: 'Failed to create tag' };
  }
}

// Track portfolio view
export async function trackPortfolioView(portfolioId: string, ipAddress?: string, userAgent?: string) {
  try {
    await prisma.portfolioView.create({
      data: {
        portfolioId,
        ipAddress,
        userAgent
      }
    });

    // Increment views count
    await prisma.portfolio.update({
      where: { id: portfolioId },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking portfolio view:', error);
    return { success: false };
  }
} 