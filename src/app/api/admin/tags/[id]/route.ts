import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>
}

// Get a single tag
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' }, 
        { status: 404 }
      );
    }
    
    // Format response to include post count
    const formattedTag = {
      ...tag,
      postCount: tag._count.posts
    };
    
    return NextResponse.json(formattedTag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' }, 
      { status: 500 }
    );
  }
}

// Update a tag
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Tag name is required' }, 
        { status: 400 }
      );
    }
    
    // Check if the tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });
    
    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' }, 
        { status: 404 }
      );
    }
      // Check if another tag with the same name exists (case insensitive)
    if (name.trim().toLowerCase() !== existingTag.name.toLowerCase()) {
      const nameExists = await prisma.tag.findFirst({
        where: {
          name: name.trim(),
          NOT: {
            id
          }
        }
      });
      
      if (nameExists) {
        return NextResponse.json(
          { error: 'A tag with this name already exists' }, 
          { status: 409 }
        );
      }    }
    
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name: name.trim() }
    });
    
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' }, 
      { status: 500 }
    );
  }
}

// Delete a tag
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    // Check if the tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' }, 
        { status: 404 }
      );
    }
    
    // Don't allow deletion if posts are associated with this tag
    if (existingTag._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tag with associated posts. Remove the tag from posts first.' }, 
        { status: 400 }
      );    }
    
    await prisma.tag.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' }, 
      { status: 500 }
    );
  }
}
