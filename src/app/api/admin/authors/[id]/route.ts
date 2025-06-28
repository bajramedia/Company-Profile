import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.bajramedia.com/api_bridge.php';

// GET /api/admin/authors/[id] - Get single author by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const authorId = params.id;

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=authors&id=${authorId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    const author = Array.isArray(data) ? data[0] : data;
    
    return NextResponse.json({
      success: true,
      author
    });

  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/authors/[id] - Update author by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const authorId = params.id;
    const body = await request.json();

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    const { name, email, avatar, bio } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists for another author
    const existingResponse = await fetch(`${API_BASE_URL}?endpoint=authors&email=${email}`);
    if (existingResponse.ok) {
      const existing = await existingResponse.json();
      if (Array.isArray(existing) && existing.length > 0 && existing[0].id !== authorId) {
        return NextResponse.json(
          { error: 'An author with this email already exists' },
          { status: 400 }
        );
      }
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=authors&id=${authorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, avatar, bio })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to update author');
    }

    return NextResponse.json({ 
      success: true, 
      author: result.data || { id: authorId, name, email, avatar, bio }
    });

  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      { error: 'Failed to update author' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/authors/[id] - Delete author by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const authorId = params.id;

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    // Check if author has posts
    const postsResponse = await fetch(`${API_BASE_URL}?endpoint=posts&authorId=${authorId}&limit=1`);
    if (postsResponse.ok) {
      const posts = await postsResponse.json();
      if (Array.isArray(posts) && posts.length > 0) {
        return NextResponse.json(
          { error: 'Cannot delete author who has posts. Please reassign or delete the posts first.' },
          { status: 400 }
        );
      }
    }

    const response = await fetch(`${API_BASE_URL}?endpoint=authors&id=${authorId}`, {
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
      throw new Error(result.message || 'Failed to delete author');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Author deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { error: 'Failed to delete author' },
      { status: 500 }
    );
  }
}
