import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/portfolio/tags - Get all portfolio tags
export async function GET() {
  try {
    const tags = await prisma.portfolioTag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            portfolios: true
          }
        }
      }
    });

    return NextResponse.json(tags);

  } catch (error) {
    console.error('Error fetching portfolio tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio tags' },
      { status: 500 }
    );
  }
}

// POST /api/portfolio/tags - Create new portfolio tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, color } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTag = await prisma.portfolioTag.findUnique({
      where: { slug }
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this slug already exists' },
        { status: 400 }
      );
    }

    const tag = await prisma.portfolioTag.create({
      data: {
        name,
        slug,
        color
      }
    });

    return NextResponse.json(tag, { status: 201 });

  } catch (error) {
    console.error('Error creating portfolio tag:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio tag' },
      { status: 500 }
    );
  }
} 