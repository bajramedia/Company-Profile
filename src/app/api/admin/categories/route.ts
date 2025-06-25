import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    
    // Add postCount (for now set to 0, can be enhanced later)
    const formattedCategories = categories.map((category: any) => ({
      ...category,
      postCount: 0 // TODO: Get actual post count from API
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;
    
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' }, 
        { status: 400 }
      );
    }
    
    // Check if category with same slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' }, 
        { status: 409 }
      );
    }
    
    const category = await prisma.category.create({
      data: { name, slug }
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' }, 
      { status: 500 }
    );
  }
}
