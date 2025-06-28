import { NextRequest, NextResponse } from 'next/server';
import { fetchWithFallback } from '@/utils/api-client';

// GET /api/posts/search - Search posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build query parameters
    let queryParams = `endpoint=posts&page=${page}&limit=${limit}&search=${encodeURIComponent(query)}`;
    
    if (category) {
      queryParams += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetchWithFallback(`?${queryParams}`);
    
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
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}
