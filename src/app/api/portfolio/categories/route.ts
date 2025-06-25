import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/portfolio/categories - Get all portfolio categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        type: 'PORTFOLIO'
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching portfolio categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 