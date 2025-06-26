import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    
    // Add postCount (for now set to 0, can be enhanced later)
    const formattedCategories = categories.map((category: any) => ({
      ...category,
      postCount: 0 // TODO: Get actual post count from API
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Create category via external API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: description || ''
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('Failed to create category');
    }

    return NextResponse.json({ 
      success: true, 
      category: { 
        id: result.id,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: description || ''
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
