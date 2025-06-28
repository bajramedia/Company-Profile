import { NextResponse } from 'next/server';
import { fetchWithFallback, apiPost } from '@/utils/api-client';

// GET /api/admin/authors - Get all authors
export async function GET() {
  try {
    const response = await fetchWithFallback('?endpoint=authors', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

// POST /api/admin/authors - Create new author
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, email, bio, avatar, social } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Prepare author data
    const authorData = {
      name,
      email,
      bio: bio || '',
      avatar: avatar || '',
      social: social || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response = await apiPost('?endpoint=authors', authorData);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      author: result.data || result 
    });

  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create author',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
