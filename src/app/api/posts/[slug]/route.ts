import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.bajramedia.com/api_bridge.php';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=posts&slug=${slug}&published=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const post = Array.isArray(data) ? data[0] : data;
    
    // Format the post to match expected structure
    const formattedPost = {
      ...post,
      published: post.published === "1" || post.published === 1 || post.published === true,
      featured: post.featured === "1" || post.featured === 1 || post.featured === true,
      tags: post.tags || [],
      author: post.author || { 
        id: post.authorId, 
        name: post.authorName || 'Unknown',
        avatar: post.authorAvatar || null,
        bio: post.authorBio || null
      },
      category: post.category || { 
        id: post.categoryId, 
        name: post.categoryName || 'Uncategorized',
        slug: post.categorySlug || 'uncategorized'
      },
      views: post.views || 0,
      readTime: post.readTime || 5
    };

    return NextResponse.json(formattedPost);

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
