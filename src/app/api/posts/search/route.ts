import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

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
    
    // Filter posts with complete data only - NO DUMMY DATA
    const validPosts = posts.filter((post: any) => {
      return post.id && post.title && post.authorName && post.categoryName;
    });
    
    console.log(`🔍 Search results: ${validPosts.length}/${posts.length} posts have complete data`);
    
    // Format posts to match expected structure
    const formattedPosts = validPosts.map((post: any) => ({
      ...post,
      published: post.published === "1" || post.published === 1 || post.published === true,
      featured: post.featured === "1" || post.featured === 1 || post.featured === true,
      tags: post.tags || [],
      author: { 
        id: post.authorId, 
        name: post.authorName,
        avatar: post.authorAvatar || ''
      },
      category: { 
        id: post.categoryId, 
        name: post.categoryName,
        slug: post.categorySlug
      },
      views: post.views || 0,
      readTime: parseInt(post.readTime) || null,
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
