import { NextRequest, NextResponse } from 'next/server';
import { fetchWithFallback } from '@/utils/api-client';

// GET /api/posts/category/[category] - Get posts by category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // First, get the category info
    const categorySlug = decodeURIComponent(category);
    const categoryResponse = await fetchWithFallback(`?endpoint=categories&slug=${categorySlug}`);
    
    let categoryInfo = null;
    if (categoryResponse.ok) {
      const categoryData = await categoryResponse.json();
      categoryInfo = Array.isArray(categoryData) ? categoryData[0] : categoryData;
    }

    if (!categoryInfo) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Then get posts for this category
    const queryParams = new URLSearchParams({
      endpoint: 'posts',
      page: page.toString(),
      limit: limit.toString(),
      category: categoryInfo.id.toString(),
      published: 'true'
    });

    const postsResponse = await fetchWithFallback(`?${queryParams}`);
    
    if (!postsResponse.ok) {
      throw new Error(`HTTP error! status: ${postsResponse.status}`);
    }
    
    const posts = await postsResponse.json();

    return NextResponse.json({
      category: categoryInfo,
      posts: posts || [],
      pagination: {
        page,
        limit,
        total: posts?.length || 0
      }
    });

  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts by category' },
      { status: 500 }
    );
  }
}
