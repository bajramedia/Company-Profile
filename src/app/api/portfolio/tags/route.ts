import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// GET /api/portfolio/tags - Get all portfolio tags
export async function GET(request: NextRequest) {
  try {
    console.log('Portfolio Tags API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio-tags`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tags = await response.json();
    console.log('Portfolio Tags API: Database success');
    return NextResponse.json(tags);
    
  } catch (error) {
    console.error('Portfolio Tags API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch portfolio tags from database',
        message: 'Please check if portfoliotag table exists in bajx7634_bajra database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/portfolio/tags - Create new portfolio tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const tagData = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      color: color || '#6B7280'
    };

    console.log('Portfolio Tags API: Creating new entry in database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=portfolio-tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Portfolio Tags API: Database entry created successfully');
    return NextResponse.json({
      success: true,
      tag: {
        id: result.id,
        name: tagData.name,
        slug: tagData.slug,
        color: tagData.color
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Portfolio Tags API: Database creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio tag in database' },
      { status: 500 }
    );
  }
} 