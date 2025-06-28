import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bajramedia.com/api_bridge.php";

export async function GET() {
  try {
    console.log('⭐ Featured Posts API: Fetching from', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&limit=50`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bajramedia-Website/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log('📊 Total posts from API:', Array.isArray(posts) ? posts.length : 'Not array');
    
    // Ensure posts is array
    const postsArray = Array.isArray(posts) ? posts : [];
    
    // Filter ONLY posts that have required fields - NO DUMMY DATA
    const validPosts = postsArray.filter((post: any) => {
      const isValid = post.id && 
                     post.title && 
                     post.slug && 
                     post.authorName && 
                     post.categoryName;
      if (!isValid) {
        console.log('❌ Invalid post filtered out:', { 
          id: post.id, 
          title: post.title?.substring(0, 30), 
          hasAuthor: !!post.authorName,
          hasCategory: !!post.categoryName 
        });
      }
      return isValid;
    });
    
    console.log('✅ Valid posts after filtering:', validPosts.length);
    
    // Sort by featured status first, then by date (newest first)
    const sortedPosts = validPosts.sort((a: any, b: any) => {
      // Featured posts first
      const aFeatured = a.featured === "1" || a.featured === 1 || a.featured === true;
      const bFeatured = b.featured === "1" || b.featured === 1 || b.featured === true;
      
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      
      // Then sort by date (newest first)
      const aDate = new Date(a.date || a.createdAt || 0).getTime();
      const bDate = new Date(b.date || b.createdAt || 0).getTime();
      return bDate - aDate;
    });
    
    // Take top 3 posts (featured will be prioritized)
    const featuredPosts = sortedPosts.slice(0, 3);
    console.log('🎯 Featured posts selected:', featuredPosts.length);
    
    // Format posts with PURE database data - NO FALLBACKS
    const formattedPosts = featuredPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      featuredImage: post.featuredImage || '',
      date: post.date || post.createdAt,
      createdAt: post.createdAt || post.date,
      readTime: parseInt(post.readTime) || null,
      published: post.published === "1" || post.published === 1 || post.published === true,
      featured: post.featured === "1" || post.featured === 1 || post.featured === true,
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
    }));

    console.log('🎉 Formatted featured posts ready:', formattedPosts.length);
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('❌ Featured Posts API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured posts' }, 
      { status: 500 }
    );
  }
}
