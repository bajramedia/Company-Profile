import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

// GET /api/admin/posts/[id] - Get single post by ID for admin
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${postId}`);
    
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
    
    // Format the post to match admin panel expectations
    const formattedPost = {
      ...post,
      published: post.published === "1" || post.published === 1 || post.published === true,
      featured: post.featured === "1" || post.featured === 1 || post.featured === true,
      tags: post.tags || [],
      author: post.author || { 
        id: post.authorId, 
        name: post.authorName || 'Unknown',
        email: post.authorEmail || null,
        avatar: post.authorAvatar || null
      },
      category: post.category || { 
        id: post.categoryId, 
        name: post.categoryName || 'Uncategorized',
        slug: post.categorySlug || 'uncategorized'
      },
      views: post.views || 0,
      readTime: post.readTime || Math.ceil((post.content?.length || 0) / 200) || 5
    };

    return NextResponse.json({
      success: true,
      post: formattedPost
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts/[id] - Update post by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = params.id;
    const body = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      featuredImage, 
      published = false,
      featured = false,
      authorId,
      categoryId,
      tagIds = [],
      readTime
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists for another post
    const existingResponse = await fetch(`${API_BASE_URL}?endpoint=posts&slug=${slug}`);
    if (existingResponse.ok) {
      const existing = await existingResponse.json();
      const existingPost = Array.isArray(existing) ? existing[0] : existing;
      if (existingPost && existingPost.id !== postId) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const postData = {
      title,
      slug,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content,
      featuredImage: featuredImage || '',
      published: published ? 1 : 0,
      featured: featured ? 1 : 0,
      authorId: authorId || null,
      categoryId: categoryId || null,
      tags: tagIds || [],
      readTime: readTime || Math.ceil(content.length / 200),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update post');
    }

    return NextResponse.json({ 
      success: true, 
      post: { 
        id: postId,
        ...postData,
        published: postData.published === 1,
        featured: postData.featured === 1
      }
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts/[id] - Delete post by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=posts&id=${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete post');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
