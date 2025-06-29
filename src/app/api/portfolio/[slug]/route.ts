import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

// GET /api/portfolio/[slug] - Get single portfolio by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get all portfolios from API bridge and find by slug
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const portfolios = await response.json();
    const portfolio = portfolios.find((p: any) => p.slug === slug);

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const formattedPortfolio = {
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
    };

    return NextResponse.json(formattedPortfolio);

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// PUT /api/portfolio/[slug] - Update portfolio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { 
      title, 
      newSlug,
      description, 
      content, 
      featuredImage, 
      images,
      clientName,
      projectUrl,
      githubUrl,
      featured,
      published,
      startDate,
      endDate,
      categoryId,
      tagIds = []
    } = body;

    // Check if portfolio exists via API bridge
    const checkResponse = await fetch(`${API_BASE_URL}?endpoint=portfolio`);
    if (!checkResponse.ok) {
      throw new Error(`HTTP error! status: ${checkResponse.status}`);
    }
    
    const portfolios = await checkResponse.json();
    const existingPortfolio = portfolios.find((p: any) => p.slug === slug);

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // If slug is changing, check if new slug already exists
    if (newSlug && newSlug !== slug) {
      const slugExists = portfolios.find((p: any) => p.slug === newSlug);

      if (slugExists) {
        return NextResponse.json(
          { error: 'Portfolio with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update portfolio via API bridge
    const portfolioData = {
      id: existingPortfolio.id,
      title,
      slug: newSlug || slug,
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
      tagIds: JSON.stringify(tagIds)
    };

    const updateResponse = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'portfolio',
        data: portfolioData
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`HTTP error! status: ${updateResponse.status}`);
    }

    const result = await updateResponse.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update portfolio');
    }

    // Return formatted response
    const updatedPortfolio = {
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

    return NextResponse.json(updatedPortfolio);

  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio/[slug] - Delete portfolio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check if portfolio exists via API bridge
    const checkResponse = await fetch(`${API_BASE_URL}?endpoint=portfolio`);
    if (!checkResponse.ok) {
      throw new Error(`HTTP error! status: ${checkResponse.status}`);
    }
    
    const portfolios = await checkResponse.json();
    const existingPortfolio = portfolios.find((p: any) => p.slug === slug);

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Delete portfolio via API bridge
    const deleteResponse = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'portfolio',
        id: existingPortfolio.id
      })
    });

    if (!deleteResponse.ok) {
      throw new Error(`HTTP error! status: ${deleteResponse.status}`);
    }

    const result = await deleteResponse.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete portfolio');
    }

    return NextResponse.json({ message: 'Portfolio deleted successfully' });

  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
} 