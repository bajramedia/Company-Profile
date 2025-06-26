import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

// GET /api/admin/tags/[id] - Get single tag by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const tagId = params.id;

    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=tags&id=${tagId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    const tag = Array.isArray(data) ? data[0] : data;
    
    return NextResponse.json({
      success: true,
      tag
    });

  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tags/[id] - Update tag by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const tagId = params.id;
    const body = await request.json();

    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    const { name, slug } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if tag with new slug already exists (if slug changed)
    const existingResponse = await fetch(`${API_BASE_URL}?endpoint=tags&slug=${slug}`);
    if (existingResponse.ok) {
      const existing = await existingResponse.json();
      if (Array.isArray(existing) && existing.length > 0 && existing[0].id !== tagId) {
        return NextResponse.json(
          { error: 'A tag with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=tags&id=${tagId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, slug })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update tag');
    }

    return NextResponse.json({ 
      success: true, 
      tag: result.data || { id: tagId, name, slug }
    });

  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tags/[id] - Delete tag by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const tagId = params.id;

    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=tags&id=${tagId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete tag');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tag deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
