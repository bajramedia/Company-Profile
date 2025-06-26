import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bajramedia.com/api_bridge.php";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get posts from external API
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      console.error(`API Bridge error: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    // Transform API response to match frontend expectations
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      date: post.date || post.createdAt,
      readTime: parseInt(post.readTime) || 5,
      published: post.published === "1" || post.published === 1 || post.published === true,
      author: {
        id: post.authorId || '1',
        name: post.authorName || 'Unknown Author',
        email: post.authorEmail || '',
        avatar: post.authorAvatar || '',
        bio: post.authorBio || ''
      },
      category: {
        id: post.categoryId || '1',
        name: post.categoryName || 'Uncategorized',
        slug: post.categorySlug || 'uncategorized'
      },
      tags: post.tags || []
    }));

    return NextResponse.json({ 
      posts: formattedPosts, 
      total: formattedPosts.length,
      page,
      limit,
      totalPages: Math.ceil(formattedPosts.length / limit)
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' }, 
      { status: 500 }
    );
  }
}
