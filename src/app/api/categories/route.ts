import { NextResponse } from 'next/server';
import { getFallbackData } from '@/utils/fallback-data';

export async function GET() {
  try {
    // Di sini nanti kita bisa tambahkan koneksi ke database
    // Untuk sementara pakai fallback data dulu
    const fallbackData = getFallbackData();
    
    // Extract unique categories from fallback posts
    const categories = Array.from(new Set(fallbackData.blogPosts.map(post => post.category)))
      .map(category => ({
        id: String(Math.random()),
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, '-'),
        description: `Articles about ${category}`
      }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 