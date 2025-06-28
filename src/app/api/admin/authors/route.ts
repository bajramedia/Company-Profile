import { NextResponse } from "next/server";

const API_BASE_URL = 'https://www.bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    console.log('Authors API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=authors`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const authors = await response.json();
    
    // Format for frontend compatibility
    const formattedAuthors = authors.map((author: any) => ({
      ...author,
      postCount: author.postCount || 0,
      avatar: author.avatar || '/images/team/admin-avatar.jpg'
    }));
    
    console.log('Authors API: Database success');
    return NextResponse.json(formattedAuthors);
  } catch (error) {
    console.error('Authors API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch authors from database',
        message: 'Please check if author table exists in bajx7634_bajra database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, bio, avatar } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    console.log('Authors API: Creating new entry in database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, bio, avatar }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Authors API: Server error:', errorData);
      throw new Error(`Server error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    console.log('Authors API: Database entry created successfully');

    // Return proper response with database ID
    return NextResponse.json({ 
      success: true, 
      author: { 
        id: result.id,
        name: name,
        email: email,
        bio: bio || '',
        avatar: avatar || '/images/team/admin-avatar.jpg',
        postCount: 0
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Authors API: Database creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create author in database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
