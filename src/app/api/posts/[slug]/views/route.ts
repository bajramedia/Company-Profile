import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function POST(
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

    // Get IP address and user agent for tracking
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // First, get the post to verify it exists and get the ID
    const postResponse = await fetch(`${API_BASE_URL}?endpoint=posts&slug=${slug}`);
    
    if (!postResponse.ok) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const postData = await postResponse.json();
    const post = Array.isArray(postData) ? postData[0] : postData;
    
    if (!post || !post.id) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if this IP already viewed this post recently (within last hour)
    const recentViewResponse = await fetch(
      `${API_BASE_URL}?endpoint=post_views&postId=${post.id}&ipAddress=${ip}&since=${new Date(Date.now() - 60 * 60 * 1000).toISOString()}`
    );

    if (recentViewResponse.ok) {
      const recentViews = await recentViewResponse.json();
      if (Array.isArray(recentViews) && recentViews.length > 0) {
        // User already viewed this post recently, don't count it again
        return NextResponse.json({ 
          success: true, 
          message: 'View already counted recently',
          views: post.views || 0
        });
      }
    }

    // Track the view
    const viewData = {
      postId: post.id,
      ipAddress: ip,
      userAgent: userAgent,
      viewedAt: new Date().toISOString()
    };

    const trackResponse = await fetch(`${API_BASE_URL}?endpoint=post_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(viewData)
    });

    // Update post view count
    let updatedViews = (post.views || 0) + 1;
    
    const updateResponse = await fetch(`${API_BASE_URL}?endpoint=posts&id=${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ views: updatedViews })
    });

    if (updateResponse.ok) {
      const updateResult = await updateResponse.json();
      if (updateResult.success) {
        updatedViews = updateResult.data?.views || updatedViews;
      }
    }

    return NextResponse.json({ 
      success: true, 
      views: updatedViews,
      message: 'View tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking post view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}
