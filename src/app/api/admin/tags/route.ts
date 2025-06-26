import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=tags`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tags = await response.json();
    
    // Add postCount (for now set to 0, can be enhanced later)
    const formattedTags = tags.map((tag: any) => ({
      ...tag,
      postCount: 0 // TODO: Get actual post count from API
    }));
    
    return NextResponse.json(formattedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Create tag via external API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('Failed to create tag');
    }

    return NextResponse.json({ 
      success: true, 
      tag: { 
        id: result.id,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
