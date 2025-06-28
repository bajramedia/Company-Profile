import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

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

    console.log('📄 Single Post API: Fetching slug:', slug);
    
    // Query single post by slug using api_bridge.php structure
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${slug}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bajramedia-Website/1.0'
      }
    });
    
    console.log('📡 API Response status:', response.status);
    
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
    
    // Validate required fields exist - NO DUMMY DATA
    if (!post.id || !post.title || !post.authorName || !post.categoryName) {
      console.log('❌ Post missing required fields:', {
        id: !!post.id,
        title: !!post.title,
        authorName: !!post.authorName,
        categoryName: !!post.categoryName
      });
      return NextResponse.json(
        { error: 'Post data incomplete' },
        { status: 500 }
      );
    }
    
    // Format the post with PURE database data - NO FALLBACKS
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      featuredImage: post.featuredImage || '',
      date: post.date || post.createdAt,
      createdAt: post.createdAt || post.date,
      published: post.published === "1" || post.published === 1 || post.published === true,
      featured: post.featured === "1" || post.featured === 1 || post.featured === true,
      readTime: parseInt(post.readTime) || null,
      author: { 
        id: post.authorId, 
        name: post.authorName,
        email: post.authorEmail || '',
        avatar: post.authorAvatar || '',
        bio: post.authorBio || ''
      },
      category: { 
        id: post.categoryId, 
        name: post.categoryName,
        slug: post.categorySlug
      },
      tags: post.tags || [],
      views: post.views || 0
    };

    console.log('✅ Single post formatted successfully:', formattedPost.title);
    return NextResponse.json(formattedPost);

  } catch (error) {
    console.error('❌ Single Post API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
