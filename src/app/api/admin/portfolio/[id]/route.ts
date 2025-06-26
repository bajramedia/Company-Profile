import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

// GET /api/admin/portfolio/[id] - Get single portfolio by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const portfolioId = params.id;

    if (!portfolioId) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    // Get portfolio from external API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&id=${portfolioId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Handle both array and single object response
    const portfolio = Array.isArray(data) ? data[0] : data;
    
    // Format the portfolio to match admin panel expectations
    const formattedPortfolio = {
      id: portfolio.id,
      title: portfolio.title,
      slug: portfolio.slug,
      description: portfolio.description,
      content: portfolio.content,
      featuredImage: portfolio.featuredImage,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      clientName: portfolio.clientName,
      projectUrl: portfolio.projectUrl,
      githubUrl: portfolio.githubUrl,
      featured: portfolio.featured === "1" || portfolio.featured === 1 || portfolio.featured === true,
      published: portfolio.published === "1" || portfolio.published === 1 || portfolio.published === true,
      startDate: portfolio.startDate,
      endDate: portfolio.endDate,
      createdAt: portfolio.createdAt || portfolio.date,
      updatedAt: portfolio.updatedAt,
      categoryId: portfolio.categoryId || "1",
      category: {
        id: portfolio.categoryId || "1",
        name: portfolio.categoryName || "Uncategorized",
        slug: portfolio.categorySlug || "uncategorized"
      },
      tags: portfolio.tags || []
    };

    return NextResponse.json({
      success: true,
      portfolio: formattedPortfolio
    });

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/portfolio/[id] - Update portfolio by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const portfolioId = params.id;
    const body = await request.json();

    if (!portfolioId) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

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

    // Update portfolio via API bridge
    const portfolioData = {
      id: portfolioId,
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
      tags: tagIds || [],
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&id=${portfolioId}`, {
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

    return NextResponse.json({ 
      success: true, 
      portfolio: { 
        id: portfolioId,
        ...portfolioData,
        featured: portfolioData.featured === 1,
        published: portfolioData.published === 1,
        images: portfolioData.images ? JSON.parse(portfolioData.images) : []
      }
    });

  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/portfolio/[id] - Delete portfolio by ID  
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const portfolioId = params.id;

    if (!portfolioId) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    // Delete portfolio via API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio&id=${portfolioId}`, {
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

    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
} 