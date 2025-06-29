import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

// GET /api/posts/category/[category] - Get posts by category
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ category: string }> }
) {
  try {
    const params = await context.params;
    const categorySlug = params.category;

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category slug is required' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // First, verify the category exists and get its details
    const categoryResponse = await fetch(`${API_BASE_URL}?endpoint=categories&slug=${categorySlug}`);
    
    if (!categoryResponse.ok) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const categoryData = await categoryResponse.json();
    const category = Array.isArray(categoryData) ? categoryData[0] : categoryData;

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get posts for this category
    const queryParams = new URLSearchParams({
      endpoint: 'posts',
      categoryId: category.id,
      categorySlug: categorySlug,
      page: page.toString(),
      limit: limit.toString(),
      published: 'true' // Only get published posts
    });

    const postsResponse = await fetch(`${API_BASE_URL}?${queryParams}`);
    
    if (!postsResponse.ok) {
      throw new Error(`HTTP error! status: ${postsResponse.status}`);
    }
    
    const postsData = await postsResponse.json();
    
    // Handle different response formats
    const posts = Array.isArray(postsData) ? postsData : postsData.posts || [];
    
    // Format posts to match expected structure
    const formattedPosts = posts.map((post: any) => ({
      ...post,
      published: post.published === "1" || post.published === 1 || post.published === true,
      featured: post.featured === "1" || post.featured === 1 || post.featured === true,
      tags: post.tags || [],
      author: post.author || { 
        id: post.authorId, 
        name: post.authorName || 'Unknown',
        avatar: post.authorAvatar || null
      },
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      },
      views: post.views || 0,
      readTime: post.readTime || Math.ceil((post.content?.length || 0) / 200) || 5
    }));

    // Sort by date (newest first) and featured status
    formattedPosts.sort((a: any, b: any) => {
      // Featured posts first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by date
      return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
    });

    const responseData = {
      posts: formattedPosts,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || null
      },
      pagination: {
        page,
        limit,
        total: formattedPosts.length,
        pages: Math.ceil(formattedPosts.length / limit)
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        posts: [],
        category: null,
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      },
      { status: 500 }
    );
  }
}
