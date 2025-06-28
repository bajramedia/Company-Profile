import { NextRequest, NextResponse } from "next/server";
import { fetchWithFallback } from '@/utils/api-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    console.log('Public Posts API: Fetching from production database...');
    const response = await fetchWithFallback(`?endpoint=posts&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    // Filter by search if provided
    let filteredPosts = posts;
    if (search) {
      filteredPosts = posts.filter((post: any) => 
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        post.content?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    console.log('Public Posts API: Database success');
    return NextResponse.json(filteredPosts);
    
  } catch (error) {
    console.error('Public Posts API: Database connection failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts from database' },
      { status: 500 }
    );
  }
}
