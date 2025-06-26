import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=authors`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const authors = await response.json();
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' }, 
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

    // Create author via external API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        bio: bio || '',
        avatar: avatar || ''
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('Failed to create author');
    }

    return NextResponse.json({ 
      success: true, 
      author: { 
        id: result.id,
        name,
        email,
        bio: bio || '',
        avatar: avatar || ''
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}
