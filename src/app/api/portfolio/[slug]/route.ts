import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/portfolio/[slug] - Get single portfolio by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            portfolioViews: true
          }
        }
      }
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const formattedPortfolio = {
      ...portfolio,
      images: portfolio.images ? JSON.parse(portfolio.images) : [],
      tags: portfolio.tags.map(pt => pt.tag),
      viewCount: portfolio._count.portfolioViews
    };

    return NextResponse.json(formattedPortfolio);

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// PUT /api/portfolio/[slug] - Update portfolio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { 
      title, 
      newSlug,
      description, 
      content, 
      featuredImage, 
      images,
      clientName,
      projectUrl,
      githubUrl,
      featured,
      published,
      startDate,
      endDate,
      categoryId,
      tagIds = []
    } = body;

    // Check if portfolio exists
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug }
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // If slug is changing, check if new slug already exists
    if (newSlug && newSlug !== slug) {
      const slugExists = await prisma.portfolio.findUnique({
        where: { slug: newSlug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Portfolio with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Delete existing portfolio tags
    await prisma.portfolioTags.deleteMany({
      where: { portfolioId: existingPortfolio.id }
    });

    const portfolio = await prisma.portfolio.update({
      where: { slug },
      data: {
        title,
        slug: newSlug || slug,
        description,
        content,
        featuredImage,
        images: images ? JSON.stringify(images) : null,
        clientName,
        projectUrl,
        githubUrl,
        featured,
        published,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        categoryId,
        tags: {
          create: tagIds.map((tagId: string) => ({
            tagId
          }))
        }
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(portfolio);

  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio/[slug] - Delete portfolio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check if portfolio exists
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug }
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    await prisma.portfolio.delete({
      where: { slug }
    });

    return NextResponse.json({ message: 'Portfolio deleted successfully' });

  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
} 