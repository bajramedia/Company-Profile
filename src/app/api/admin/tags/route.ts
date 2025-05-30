import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch tags with post count
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    // Format response to include post count
    const formattedTags = tags.map(tag => ({
      ...tag,
      postCount: tag._count.posts
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
      data: { name: name.trim() }
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
