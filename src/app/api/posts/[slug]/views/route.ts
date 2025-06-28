import { NextRequest, NextResponse } from 'next/server';
import { fetchWithFallback, apiPost, apiPut } from '@/utils/api-client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug is required' },
        { status: 400 }
      );
    }

    // Get visitor's IP address for tracking
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Get the post first
    const postResponse = await fetchWithFallback(`?endpoint=posts&slug=${slug}`);
    
    if (!postResponse.ok) {
      throw new Error(`Failed to fetch post: ${postResponse.status}`);
    }
    
    const postData = await postResponse.json();
    const post = Array.isArray(postData) ? postData[0] : postData;
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if this IP has viewed this post in the last hour (to prevent spam)
    const recentViewResponse = await fetchWithFallback(
      `?endpoint=post_views&postId=${post.id}&ipAddress=${ip}&since=${new Date(Date.now() - 60 * 60 * 1000).toISOString()}`
    );
    
    if (recentViewResponse.ok) {
      const recentViews = await recentViewResponse.json();
      if (Array.isArray(recentViews) && recentViews.length > 0) {
        // View already counted recently, return current count without incrementing
        return NextResponse.json({
          success: true,
          views: post.views || 0,
          message: 'View already counted recently'
        });
      }
    }

    // Track the view
    const trackResponse = await apiPost('?endpoint=post_views', {
      postId: post.id,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date().toISOString()
    });

    // Update post view count
    const updateResponse = await apiPut(`?endpoint=posts&id=${post.id}`, {
      views: (post.views || 0) + 1
    });

    return NextResponse.json({
      success: true,
      views: (post.views || 0) + 1
    });

  } catch (error) {
    console.error('Error tracking post view:', error);
    return NextResponse.json(
      { error: 'Failed to track post view' },
      { status: 500 }
    );
  }
}
