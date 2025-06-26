import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get portfolio from external API
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const portfolio = await response.json();
    
    // Format the portfolio to match admin panel expectations
    const formattedPortfolio = portfolio.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      content: item.content,
      featuredImage: item.featuredImage,
      images: item.images ? JSON.parse(item.images) : [],
      clientName: item.clientName,
      projectUrl: item.projectUrl,
      githubUrl: item.githubUrl,
      featured: item.featured === "1" || item.featured === 1 || item.featured === true,
      published: item.published === "1" || item.published === 1 || item.published === true,
      startDate: item.startDate,
      endDate: item.endDate,
      createdAt: item.createdAt || item.date,
      category: {
        id: item.categoryId || "1",
        name: item.categoryName || "Uncategorized",
        slug: item.categorySlug || "uncategorized"
      },
      tags: item.tags || []
    }));

    return NextResponse.json({
      portfolio: formattedPortfolio,
      total: formattedPortfolio.length,
      page,
      limit
    });

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

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
    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'Title, description, and content are required' },
        { status: 400 }
      );
    }

    // Create portfolio via external API bridge
    const portfolioData = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      content,
      featuredImage: featuredImage || '',
      images: images ? JSON.stringify(images) : null,
      clientName: clientName || '',
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      featured: featured ? 1 : 0,
      published: published ? 1 : 0,
      startDate: startDate || null,
      endDate: endDate || null,
      categoryId: categoryId || '1',
      tags: tagIds || []
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
      throw new Error('Failed to create portfolio');
    }

    return NextResponse.json({ 
      success: true, 
      portfolio: { 
        id: result.id,
        ...portfolioData
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 