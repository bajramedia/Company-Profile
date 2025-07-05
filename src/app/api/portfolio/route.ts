import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL } from '@/config/api';
import { getFallbackData, formatPortfolioForDisplay } from '@/utils/fallback-data';

// GET /api/portfolio - Get all portfolios with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const search = searchParams.get('search');

    // Get portfolio from external API
    console.log('Portfolio API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&page=${page}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BajraMedia-NextJS/1.0',
        'Origin': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    console.log('Portfolio API: Raw response:', JSON.stringify(rawData, null, 2));
    
    // Handle different response formats:
    // 1. PowerShell format: { value: [...], Count: 1 }
    // 2. Direct array: [...]
    // 3. Object with portfolios key: { portfolios: [...] }
    let portfolioArray = [];
    if (rawData.value && Array.isArray(rawData.value)) {
      portfolioArray = rawData.value;
    } else if (Array.isArray(rawData)) {
      portfolioArray = rawData;
    } else if (rawData.portfolios && Array.isArray(rawData.portfolios)) {
      portfolioArray = rawData.portfolios;
    } else {
      console.error('Portfolio API: Unexpected response format:', rawData);
      portfolioArray = [];
    }
    
    console.log('Portfolio API: Extracted array length:', portfolioArray.length);
    
    // Apply filters on frontend since API bridge doesn't support all filtering yet
    let filteredPortfolios = portfolioArray;
    
    if (published !== null) {
      const isPublished = published === 'true';
      filteredPortfolios = filteredPortfolios.filter((p: any) => 
        (p.published === 1 || p.published === "1" || p.published === true) === isPublished
      );
    }
    
    if (featured !== null) {
      const isFeatured = featured === 'true';
      filteredPortfolios = filteredPortfolios.filter((p: any) => 
        (p.featured === 1 || p.featured === "1" || p.featured === true) === isFeatured
      );
    }
    
    if (category && category !== 'all') {
      filteredPortfolios = filteredPortfolios.filter((p: any) => 
        p.categoryName?.toLowerCase() === category.toLowerCase() ||
        p.categorySlug?.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPortfolios = filteredPortfolios.filter((p: any) =>
        p.title?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.clientName?.toLowerCase().includes(searchLower)
      );
    }

    const formattedPortfolios = filteredPortfolios.map((portfolio: any) => ({
      ...portfolio,
      images: portfolio.images ? (typeof portfolio.images === 'string' ? JSON.parse(portfolio.images) : portfolio.images) : [],
      featured: portfolio.featured === 1 || portfolio.featured === "1" || portfolio.featured === true,
      published: portfolio.published === 1 || portfolio.published === "1" || portfolio.published === true,
      category: {
        id: portfolio.categoryId,
        name: portfolio.categoryName || 'Uncategorized',
        slug: portfolio.categorySlug || 'uncategorized',
        icon: portfolio.categoryIcon || ''
      },
      tags: portfolio.tags || [],
      viewCount: portfolio.views || 0,
      // Map untuk compatibility dengan Portfolio component
      featured_image: portfolio.featuredImage,
      excerpt: portfolio.description,
      client_name: portfolio.clientName
    }));

    console.log('Portfolio API: Final formatted portfolios:', formattedPortfolios.length);

    return NextResponse.json({
      portfolios: formattedPortfolios,
      pagination: {
        page,
        limit,
        total: formattedPortfolios.length,
        pages: Math.ceil(formattedPortfolios.length / limit)
      }
    });

  } catch (error) {
    console.error('Portfolio API: Database connection failed:', error);
    console.log('🔄 API connection failed, loading fallback portfolio data...');
    
    // Use fallback dummy data instead of returning error
    const fallbackData = getFallbackData();
    const formattedPortfolios = formatPortfolioForDisplay(fallbackData.portfolioItems);
    
    // Apply the same filtering logic as above
    let filteredPortfolios = formattedPortfolios;
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    
    if (published !== null) {
      const isPublished = published === 'true';
      filteredPortfolios = filteredPortfolios.filter((p: any) => p.published === isPublished);
    }
    
    if (featured !== null) {
      const isFeatured = featured === 'true';
      filteredPortfolios = filteredPortfolios.filter((p: any) => p.featured === isFeatured);
    }
    
    if (category && category !== 'all') {
      filteredPortfolios = filteredPortfolios.filter((p: any) => 
        p.categoryName?.toLowerCase() === category.toLowerCase() ||
        p.categorySlug?.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPortfolios = filteredPortfolios.filter((p: any) =>
        p.title?.toLowerCase().includes(searchLower) ||
        p.excerpt?.toLowerCase().includes(searchLower) ||
        p.client_name?.toLowerCase().includes(searchLower)
      );
    }
    
    console.log('✅ Fallback portfolio data loaded successfully:', filteredPortfolios.length, 'items');
    
    return NextResponse.json({
      portfolios: filteredPortfolios,
      pagination: {
        page,
        limit,
        total: filteredPortfolios.length,
        pages: Math.ceil(filteredPortfolios.length / limit)
      }
    });
  }
}

// POST /api/portfolio - Create new portfolio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      slug, 
      description, 
      content, 
      featuredImage, 
      images,
      clientName,
      projectUrl,
      githubUrl,
      featured = false,
      published = false,
      startDate,
      endDate,
      categoryId,
      tagIds = []
    } = body;

    // Validate required fields
    if (!title || !slug || !description || !content || !featuredImage || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists via API bridge
    const checkResponse = await fetch(`${API_BASE_URL}?endpoint=portfolio`);
    if (checkResponse.ok) {
      const existingPortfolios = await checkResponse.json();
      const existingPortfolio = existingPortfolios.find((p: any) => p.slug === slug);
      
      if (existingPortfolio) {
        return NextResponse.json(
          { error: 'Portfolio with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Create portfolio via API bridge
    const portfolioData = {
      title,
      slug,
      description,
      content,
      featuredImage,
      images: images ? JSON.stringify(images) : null,
      clientName,
      projectUrl,
      githubUrl,
      featured: featured ? 1 : 0,
      published: published ? 1 : 0,
      startDate: startDate ? new Date(startDate).toISOString().slice(0, 19).replace('T', ' ') : null,
      endDate: endDate ? new Date(endDate).toISOString().slice(0, 19).replace('T', ' ') : null,
      categoryId,
      tagIds: JSON.stringify(tagIds),
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const createResponse = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'portfolio',
        data: portfolioData
      })
    });

    if (!createResponse.ok) {
      throw new Error(`HTTP error! status: ${createResponse.status}`);
    }

    const result = await createResponse.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create portfolio');
    }

    // Return formatted response similar to Prisma format
    const newPortfolio = {
      id: result.data.id,
      ...portfolioData,
      images: portfolioData.images ? JSON.parse(portfolioData.images) : [],
      featured: portfolioData.featured === 1,
      published: portfolioData.published === 1,
      category: {
        id: categoryId,
        name: 'Unknown', // API bridge doesn't return category details
        slug: 'unknown'
      },
      tags: tagIds.map((tagId: string) => ({
        id: tagId,
        name: 'Unknown', // API bridge doesn't return tag details
        slug: 'unknown'
      }))
    };

    return NextResponse.json(newPortfolio, { status: 201 });

  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 
