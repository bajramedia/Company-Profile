import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from "@/config/api";
import { getFallbackData, formatBlogForDisplay } from '@/utils/fallback-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    console.log('Post API: Fetching post by slug:', slug);
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle both array and single object response
    const post = Array.isArray(data) ? data[0] : data;
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Only return published posts for public access
    if (!(post.published === "1" || post.published === 1 || post.published === true)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Format the post to match public API expectations
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      date: post.createdAt || post.date,
      readTime: post.readTime || 5,
      published: true, // Always true for public API
      featured: post.featured === "1" || post.featured === 1 || post.featured === true,
      author: {
        id: post.authorId || "cmbf4aq8s0000tsa4kiz9m58q",
        name: post.authorName || "Admin User",
        avatar: post.authorAvatar || "",
        bio: post.authorBio || ""
      },
      category: {
        id: post.categoryId || "cmbf4aq900001tsa4kx7e1sgo",
        name: post.categoryName || "Uncategorized",
        slug: post.categorySlug || "uncategorized"
      },
      tags: post.tags || [],
      views: post.views || 0
    };
    
    console.log('Post API: Database success for slug:', slug);
    return NextResponse.json(formattedPost);
    
  } catch (error) {
    console.error("Post API: Database connection failed:", error);
    
    // Try to find the post in fallback data
    const { slug } = await params;
    console.log('🔄 API connection failed, searching fallback data for slug:', slug);
    
    const fallbackData = getFallbackData();
    const formattedBlogPosts = formatBlogForDisplay(fallbackData.blogPosts);
    const fallbackPost = formattedBlogPosts.find(p => p.slug === slug);
    
    if (fallbackPost) {
      console.log('✅ Found fallback post:', fallbackPost.title);
      return NextResponse.json(fallbackPost);
    }
    
    console.log('❌ Post not found in fallback data');
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }
}
