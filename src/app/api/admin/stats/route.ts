import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Count stats for dashboard widgets
    const [
      postsCount, 
      authorsCount, 
      categoriesCount, 
      tagsCount
    ] = await Promise.all([
      prisma.post.count(),
      prisma.author.count(),
      prisma.category.count(),
      prisma.tag.count()
    ]);
    
    return NextResponse.json({
      posts: postsCount,
      authors: authorsCount,
      categories: categoriesCount,
      tags: tagsCount
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' }, 
      { status: 500 }
    );
  }
}
