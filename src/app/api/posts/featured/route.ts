import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get featured posts (posts with highest readTime or most recent)
    const posts = await prisma.post.findMany({
      where: { 
        published: true 
      },
      orderBy: [
        { readTime: 'desc' },
        { date: 'desc' }
      ],
      take: 3,
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
    console.error('Error fetching featured posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured posts' }, 
      { status: 500 }
    );
  }
}
