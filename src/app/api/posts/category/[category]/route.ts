import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{
    category: string;
  }>
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { category } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Find the category by slug
    const categoryEntity = await prisma.category.findUnique({
      where: { slug: category }
    });

    if (!categoryEntity) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get posts for this category
    const posts = await prisma.post.findMany({
      where: { 
        categoryId: categoryEntity.id,
        published: true 
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
    console.error('Error fetching posts by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts by category' }, 
      { status: 500 }
    );
  }
}
