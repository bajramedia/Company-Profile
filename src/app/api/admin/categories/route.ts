import { NextResponse } from "next/server";

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    console.log('Categories API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    const formattedCategories = categories.map((category: any) => ({
      ...category,
      postCount: category.postCount || 0
    }));
    
    console.log('Categories API: Database success');
    return NextResponse.json(formattedCategories);
    
  } catch (error) {
    console.error('Categories API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories from database',
        message: 'Please check if category table exists in bajx7634_bajra database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const categoryData = {
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description || ''
    };

    console.log('Categories API: Creating new entry in database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Categories API: Server error:', errorData);
      throw new Error(`Server error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    
    // Return the actual result from database without fallback
    return NextResponse.json({ 
      success: true, 
      category: { 
        id: result.id,
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        postCount: 0
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Categories API: Database creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create category in database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}