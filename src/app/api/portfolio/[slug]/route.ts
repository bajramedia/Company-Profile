import { NextRequest, NextResponse } from 'next/server';
import { fetchWithFallback, apiPut, apiDelete } from '@/utils/api-client';

// GET /api/portfolio/[slug] - Get single portfolio by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Portfolio slug is required' },
        { status: 400 }
      );
    }

    const response = await fetchWithFallback('?endpoint=portfolio');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const portfolioItems = await response.json();
    
    // Find the portfolio item by slug
    const portfolioItem = portfolioItems.find((item: any) => 
      item.slug === slug || item.id === slug
    );
    
    if (!portfolioItem) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(portfolioItem);

  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio item' },
      { status: 500 }
    );
  }
}

// PUT /api/portfolio/[slug] - Update portfolio by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Portfolio slug is required' },
        { status: 400 }
      );
    }

    // Get current portfolio items to find the one to update
    const checkResponse = await fetchWithFallback('?endpoint=portfolio');
    if (!checkResponse.ok) {
      throw new Error(`Failed to fetch portfolio items: ${checkResponse.status}`);
    }
    
    const portfolioItems = await checkResponse.json();
    const existingItem = portfolioItems.find((item: any) => 
      item.slug === slug || item.id === slug
    );
    
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    // Update the portfolio item
    const updateResponse = await apiPut(`?endpoint=portfolio&id=${existingItem.id}`, {
      ...body,
      updatedAt: new Date().toISOString()
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${updateResponse.status}`);
    }
    
    const result = await updateResponse.json();
    
    return NextResponse.json({ 
      success: true, 
      portfolio: result.data || result 
    });

  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update portfolio item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio/[slug] - Delete portfolio by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Portfolio slug is required' },
        { status: 400 }
      );
    }

    // Get current portfolio items to find the one to delete
    const checkResponse = await fetchWithFallback('?endpoint=portfolio');
    if (!checkResponse.ok) {
      throw new Error(`Failed to fetch portfolio items: ${checkResponse.status}`);
    }
    
    const portfolioItems = await checkResponse.json();
    const existingItem = portfolioItems.find((item: any) => 
      item.slug === slug || item.id === slug
    );
    
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    const deleteResponse = await apiDelete(`?endpoint=portfolio&id=${existingItem.id}`);
    
    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${deleteResponse.status}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio item deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete portfolio item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 