import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>
}

// Get a single category
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' }, 
        { status: 404 }
      );
    }
    
    // Format response to include post count
    const formattedCategory = {
      ...category,
      postCount: category._count.posts
    };
    
    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' }, 
      { status: 500 }
    );
  }
}

// Update a category
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug } = body;
    
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' }, 
        { status: 400 }
      );
    }
    
    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' }, 
        { status: 404 }
      );
    }
    
    // Check if another category with the same slug exists
    if (slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug }
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' }, 
          { status: 409 }
        );
      }
    }
      const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, slug }
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' }, 
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' }, 
        { status: 404 }
      );
    }
    
    // Don't allow deletion if posts are associated with this category
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated posts. Remove the posts first.' }, 
        { status: 400 }
      );
    }
    
    await prisma.category.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' }, 
      { status: 500 }
    );
  }
}
