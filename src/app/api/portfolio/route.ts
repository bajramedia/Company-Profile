import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

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
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const portfolios = await response.json();
    console.log('Portfolio API: Database success, items:', portfolios.length);
    
    // Apply filters on frontend since API bridge doesn't support all filtering yet
    let filteredPortfolios = portfolios;
    
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
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      featured: portfolio.featured === 1 || portfolio.featured === "1" || portfolio.featured === true,
      published: portfolio.published === 1 || portfolio.published === "1" || portfolio.published === true,
      category: {
        id: portfolio.categoryId,
        name: portfolio.categoryName || 'Uncategorized',
        slug: portfolio.categorySlug || 'uncategorized',
        icon: portfolio.categoryIcon || ''
      },
      tags: portfolio.tags || [],
      viewCount: portfolio.views || 0
    }));

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
    return NextResponse.json(
      { 
        error: 'Failed to fetch portfolios from database',
        message: 'Please check if portfolio table exists in bajx7634_bajra database',
        details: error.message 
      },
      { status: 500 }
    );
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