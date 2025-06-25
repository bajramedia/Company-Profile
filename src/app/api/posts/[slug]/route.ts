import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{
    slug: string;
  }>
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Try to find the post
    const post = await prisma.post.findFirst({
      where: { 
        slug: slug,
        published: true
      },
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

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Format the post to match your frontend model
    const formattedPost = {
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
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' }, 
      { status: 500 }
    );
  }
}
