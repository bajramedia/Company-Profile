import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/api";
import { getFallbackData, formatBlogForDisplay } from '@/utils/fallback-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "3");

    console.log('Featured Posts API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&featured=true&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    // Filter only published and featured posts
    const featuredPosts = posts.filter((post: any) => 
      (post.published === "1" || post.published === 1 || post.published === true) &&
      (post.featured === "1" || post.featured === 1 || post.featured === true)
    );

    // Format the posts to match public API expectations
    const formattedPosts = featuredPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      date: post.createdAt || post.date,
      readTime: post.readTime || 5,
      published: true, // Always true for public API
      featured: true, // Always true for featured API
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
    }));

    console.log('Featured Posts API: Database success');
    return NextResponse.json(formattedPosts.slice(0, limit));
    
  } catch (error) {
    console.error("Featured Posts API: Database connection failed:", error);
    console.log('🔄 API connection failed, loading fallback featured posts...');
    
    // Use fallback dummy data instead of returning error
    const fallbackData = getFallbackData();
    const formattedBlogPosts = formatBlogForDisplay(fallbackData.blogPosts);
    
    // Get featured posts from fallback data
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "3");
    
    const featuredPosts = formattedBlogPosts.filter(post => post.featured === true);
    
    if (featuredPosts.length === 0) {
      console.log('🔄 No featured posts in fallback data, returning recent posts');
      return NextResponse.json(formattedBlogPosts.slice(0, limit));
    }
    
    console.log('✅ Fallback featured posts loaded successfully:', featuredPosts.length, 'posts');
    
    return NextResponse.json(featuredPosts.slice(0, limit));
  }
}
