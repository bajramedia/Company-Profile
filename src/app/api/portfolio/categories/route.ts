import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// GET /api/portfolio/categories - Get all portfolio categories
export async function GET(request: NextRequest) {
  try {
    console.log('Portfolio Categories API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio-categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    console.log('Portfolio Categories API: Database success');
    return NextResponse.json(categories);
    
  } catch (error) {
    console.error('Portfolio Categories API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch portfolio categories from database',
        message: 'Please check if portfoliocategory table exists in bajx7634_bajra database',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 