import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Fetch all required data in parallel
    const [postsResponse, authorsResponse, categoriesResponse, tagsResponse, portfolioResponse] = await Promise.all([
      fetch(`${API_BASE_URL}?endpoint=posts&limit=1`).catch(() => null),
      fetch(`${API_BASE_URL}?endpoint=authors&limit=1`).catch(() => null),
      fetch(`${API_BASE_URL}?endpoint=categories&limit=1`).catch(() => null),
      fetch(`${API_BASE_URL}?endpoint=tags&limit=1`).catch(() => null),
      fetch(`${API_BASE_URL}?endpoint=portfolio&limit=1`).catch(() => null)
    ]);

    // Calculate stats with fallback values
    let postsCount = 0;
    let authorsCount = 0;
    let categoriesCount = 0;
    let tagsCount = 0;
    let portfolioCount = 0;

    // Parse responses safely
    if (postsResponse?.ok) {
      try {
        const posts = await postsResponse.json();
        postsCount = Array.isArray(posts) ? posts.length : 0;
      } catch (e) { /* ignore */ }
    }

    if (authorsResponse?.ok) {
      try {
        const authors = await authorsResponse.json();
        authorsCount = Array.isArray(authors) ? authors.length : 0;
      } catch (e) { /* ignore */ }
    }

    if (categoriesResponse?.ok) {
      try {
        const categories = await categoriesResponse.json();
        categoriesCount = Array.isArray(categories) ? categories.length : 0;
      } catch (e) { /* ignore */ }
    }

    if (tagsResponse?.ok) {
      try {
        const tags = await tagsResponse.json();
        tagsCount = Array.isArray(tags) ? tags.length : 0;
      } catch (e) { /* ignore */ }
    }

    if (portfolioResponse?.ok) {
      try {
        const portfolio = await portfolioResponse.json();
        portfolioCount = Array.isArray(portfolio) ? portfolio.length : 0;
      } catch (e) { /* ignore */ }
    }

    const stats = {
      posts: postsCount,
      authors: authorsCount,
      categories: categoriesCount,
      tags: tagsCount,
      portfolio: portfolioCount,
      // Additional computed stats
      totalContent: postsCount + portfolioCount,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    // Return fallback stats
    return NextResponse.json({
      posts: 0,
      authors: 0,
      categories: 0,
      tags: 0,
      portfolio: 0,
      totalContent: 0,
      lastUpdated: new Date().toISOString(),
      error: 'Unable to fetch live stats'
    });
  }
}
