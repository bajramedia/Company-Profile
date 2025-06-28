import { NextResponse } from "next/server";

const API_BASE_URL = 'https://www.bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    console.log('Tags API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=tags`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tags = await response.json();
    const formattedTags = tags.map((tag: any) => ({
      ...tag,
      postCount: tag.postCount || 0
    }));
    
    console.log('Tags API: Database success');
    return NextResponse.json(formattedTags);
    
  } catch (error) {
    console.error('Tags API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch tags from database',
        message: 'Please check if tag table exists in bajx7634_bajra database',
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

    const tagData = {
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description || ''
    };

    console.log('Tags API: Creating new entry in database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Tags API: Server error:', errorData);
      throw new Error(`Server error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    
    // Return the actual result from database without fallback
    return NextResponse.json({ 
      success: true, 
      tag: { 
        id: result.id,
        name: tagData.name,
        slug: tagData.slug,
        description: tagData.description,
        postCount: 0
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Tags API: Database creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create tag in database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
