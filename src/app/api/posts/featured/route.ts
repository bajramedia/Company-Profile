import { NextResponse } from "next/server";

import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=posts&limit=10`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    const sortedPosts = posts
      .filter((post: any) => post.id && post.id !== '')
      .sort((a: any, b: any) => {
        const readTimeA = parseInt(a.readTime) || 0;
        const readTimeB = parseInt(b.readTime) || 0;
        if (readTimeA !== readTimeB) {
          return readTimeB - readTimeA;
        }
        return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
      })
      .slice(0, 3);
    
    const formattedPosts = sortedPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      date: post.date || post.createdAt,
      readTime: parseInt(post.readTime) || 5,
      published: post.published === "1" || post.published === 1 || post.published === true,
      author: {
        id: post.authorId || '1',
        name: post.authorName || 'Unknown Author',
        email: post.authorEmail || '',
        avatar: post.authorAvatar || '',
        bio: post.authorBio || ''
      },
      category: {
        id: post.categoryId || '1',
        name: post.categoryName || 'Uncategorized',
        slug: post.categorySlug || 'uncategorized'
      },
      tags: post.tags || []
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
