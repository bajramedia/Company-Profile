import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    console.log('📝 Public Posts API: Fetching from', API_BASE_URL);
    console.log('📊 Query params:', { page, limit, search });
    
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bajramedia-Website/1.0'
      }
    });
    
    console.log('📡 API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log('📄 Raw posts received:', Array.isArray(posts) ? posts.length : 'Not array');
    
    // Ensure posts is array
    const postsArray = Array.isArray(posts) ? posts : [];
    
    // Filter only published posts for public access
    const publishedPosts = postsArray.filter((post: any) => 
      post.published === "1" || post.published === 1 || post.published === true
    );
    
    console.log('✅ Published posts found:', publishedPosts.length);

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
      createdAt: post.createdAt || post.date,
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

    console.log('🎉 Formatted posts ready:', formattedPosts.length);
    return NextResponse.json(formattedPosts);
    
  } catch (error) {
    console.error("❌ Public Posts API Error:", error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts from database',
        message: 'API connection failed',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        apiUrl: API_BASE_URL
      },
      { status: 500 }
    );
  }
}
