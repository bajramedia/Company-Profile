import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (published !== null) {
      where.published = published === 'true';
    }
    
    if (featured !== null) {
      where.featured = featured === 'true';
    }
    
    if (category && category !== 'all') {
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

    const formattedPortfolios = portfolios.map(portfolio => ({
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      tags: portfolio.tags.map(pt => pt.tag),
      viewCount: portfolio._count.portfolioViews
    }));

    return NextResponse.json({
      portfolios: formattedPortfolios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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