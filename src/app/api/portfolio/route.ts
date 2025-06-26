import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

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
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const portfolios = await response.json();
    
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
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
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

    // Check if slug already exists
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug }
    });

    if (existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio with this slug already exists' },
        { status: 400 }
      );
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        slug,
        description,
        content,
        featuredImage,
        images: images ? JSON.stringify(images) : null,
        clientName,
        projectUrl,
        githubUrl,
        featured,
        published,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        categoryId,
        tags: {
          create: tagIds.map((tagId: string) => ({
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

    return NextResponse.json(portfolio, { status: 201 });

  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 