import { NextResponse } from 'next/server';
import { fetchWithFallback, apiPost } from '@/utils/api-client';

// GET /api/admin/tags - Get all tags
export async function GET() {
  try {
    const response = await fetchWithFallback('?endpoint=tags');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST /api/admin/tags - Create new tag
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, slug, description } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Prepare tag data
    const tagData = {
      name,
      slug,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response = await apiPost('?endpoint=tags', tagData);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      tag: result.data || result 
    });

  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create tag',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
