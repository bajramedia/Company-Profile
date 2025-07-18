import { NextResponse } from 'next/server';
import { getFallbackData } from '@/utils/fallback-data';

export async function GET() {
  try {
    // Di sini nanti kita bisa tambahkan koneksi ke database
    // Untuk sementara pakai fallback data dulu
    const fallbackData = getFallbackData();
    
    // Extract unique categories from fallback posts
    const uniqueCategories = new Set();
    fallbackData.blogPosts.forEach(post => {
      if (typeof post.category === 'string') {
        uniqueCategories.add(post.category);
      } else if (post.category && post.category.name) {
        uniqueCategories.add(post.category.name);
      }
    });

    // Format categories
    const categories = Array.from(uniqueCategories).map(categoryName => {
      const name = String(categoryName);
      return {
        id: String(Math.random()),
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `Articles about ${name}`
      };
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 