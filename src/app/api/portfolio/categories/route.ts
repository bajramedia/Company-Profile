import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

// GET /api/portfolio/categories - Get all portfolio categories
export async function GET(request: NextRequest) {
  try {
    // Try to get categories from API bridge first
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=portfolio_categories`);
      
      if (response.ok) {
        const categories = await response.json();
        return NextResponse.json(categories);
      }
    } catch (apiError) {
      console.log('API bridge not available, using fallback data');
    }

    // Fallback to default categories if API bridge fails
    const defaultCategories = [
      {
        id: 'web-dev-001',
        name: 'Web Development',
        slug: 'web-development',
        color: '#3B82F6',
        icon: '🌐'
      },
      {
        id: 'mobile-001',
        name: 'Mobile Apps',
        slug: 'mobile-apps',
        color: '#10B981',
        icon: '📱'
      },
      {
        id: 'uiux-001',
        name: 'UI/UX Design',
        slug: 'uiux-design',
        color: '#8B5CF6',
        icon: '🎨'
      },
      {
        id: 'marketing-001',
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        color: '#F59E0B',
        icon: '📈'
      },
      {
        id: 'game-001',
        name: 'Game Development',
        slug: 'game-development',
        color: '#EF4444',
        icon: '🎮'
      }
    ];

    return NextResponse.json(defaultCategories);

  } catch (error) {
    console.error('Error fetching portfolio categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 