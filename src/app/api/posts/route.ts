import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/api";
import { getFallbackData, formatBlogForDisplay } from '@/utils/fallback-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    console.log('Public Posts API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    // Filter only published posts for public access
    const publishedPosts = posts.filter((post: any) => 
      post.published === "1" || post.published === 1 || post.published === true
    );

    // Filter posts based on search if provided
    let filteredPosts = publishedPosts;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = publishedPosts.filter((post: any) => 
        post.title?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower)
      );
    }

    // Format the posts to match public API expectations
    const formattedPosts = filteredPosts.map((post: any) => ({
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
    }));

    console.log('Public Posts API: Database success');
    return NextResponse.json(formattedPosts);
    
  } catch (error) {
    console.error("Public Posts API: Database connection failed:", error);
    console.log('🔄 API connection failed, loading fallback blog posts...');
    
    // Use fallback dummy data instead of returning error
    const fallbackData = getFallbackData();
    const formattedBlogPosts = formatBlogForDisplay(fallbackData.blogPosts);
    
    // Apply search filter if provided
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    
    let filteredPosts = formattedBlogPosts;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = formattedBlogPosts.filter((post: any) => 
        post.title?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower)
      );
    }
    
    console.log('✅ Fallback blog posts loaded successfully:', filteredPosts.length, 'posts');
    
    return NextResponse.json(filteredPosts);
  }
}
