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
    const { name } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Tag name is required' }, 
        { status: 400 }
      );
    }
      // Check if tag with same name already exists
    const existing = await prisma.tag.findFirst({
      where: {
        name: name.trim()
      }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' }, 
        { status: 409 }
      );
    }
      const tag = await prisma.tag.create({
      data: { 
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
    });
    
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' }, 
      { status: 500 }
    );
  }
}
