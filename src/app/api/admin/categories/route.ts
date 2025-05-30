import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch categories with post count
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    // Format response to include post count
    const formattedCategories = categories.map(category => ({
      ...category,
      postCount: category._count.posts
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
