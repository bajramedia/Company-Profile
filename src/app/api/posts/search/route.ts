import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Search posts by title, excerpt or content
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } }
        ]
      },
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    // Format the posts to match your frontend model
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      date: post.date.toISOString(),
      readTime: post.readTime,
      author: {
        id: post.author.id,
        name: post.author.name,
        avatar: post.author.avatar,
        bio: post.author.bio
      },
      category: post.category,
      tags: post.tags.map(pt => pt.tag.name)
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' }, 
      { status: 500 }
    );
  }
}
