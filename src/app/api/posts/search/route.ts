import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL } from '@/config/api';

// GET /api/posts/search - Search posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build search parameters
    const queryParams = new URLSearchParams({
      endpoint: 'posts',
      search: query.trim(),
      page: page.toString(),
      limit: limit.toString(),
      published: 'true' // Only search published posts
    });

    const response = await fetch(`${API_BASE_URL}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    const posts = Array.isArray(data) ? data : data.posts || [];
    
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
      category: post.category || { 
        id: post.categoryId, 
        name: post.categoryName || 'Uncategorized',
        slug: post.categorySlug || 'uncategorized'
      },
      views: post.views || 0,
      readTime: post.readTime || Math.ceil((post.content?.length || 0) / 200) || 5,
      // Add search relevance score if available
      relevance: post.relevance || 1
    }));

    // Sort by relevance if search scores are available
    formattedPosts.sort((a: any, b: any) => (b.relevance || 0) - (a.relevance || 0));

    const response_data = {
      posts: formattedPosts,
      query: query,
      pagination: {
        page,
        limit,
        total: formattedPosts.length,
        pages: Math.ceil(formattedPosts.length / limit)
      },
      meta: {
        searchTime: new Date().toISOString(),
        totalResults: formattedPosts.length
      }
    };

    return NextResponse.json(response_data);

  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search posts',
        posts: [],
        query: request.nextUrl.searchParams.get('q') || '',
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      },
      { status: 500 }
    );
  }
}
