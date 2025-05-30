import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Prepare where clause with search if provided
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } }
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.post.count({ where: whereClause });

    // Get posts with related data
    const posts = await prisma.post.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { 
        date: 'desc' 
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
      published: post.published,
      author: {
        id: post.author.id,
        name: post.author.name,
        avatar: post.author.avatar,
        bio: post.author.bio
      },
      category: post.category,
      tags: post.tags.map(pt => pt.tag.name)
    }));

    return NextResponse.json({ 
      posts: formattedPosts, 
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' }, 
      { status: 500 }
    );
  }
}
