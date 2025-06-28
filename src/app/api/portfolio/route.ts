import { NextRequest, NextResponse } from 'next/server';
import { fetchWithFallback, apiPost } from '@/utils/api-client';

// GET /api/portfolio - Get all portfolio items with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');

    let queryParams = `endpoint=portfolio&page=${page}&limit=${limit}`;
    
    if (category) {
      queryParams += `&category=${encodeURIComponent(category)}`;
    }
    
    if (tags) {
      queryParams += `&tags=${encodeURIComponent(tags)}`;
    }

    const response = await fetchWithFallback(`?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// POST /api/portfolio - Create new portfolio item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      slug,
      description,
      content,
      excerpt,
      image,
      gallery,
      categoryId,
      tags,
      technologies,
      projectUrl,
      githubUrl,
      published = false,
      featured = false,
      clientName,
      completedAt,
      duration
    } = body;

    // Validate required fields
    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: 'Title, slug, and description are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const checkResponse = await fetchWithFallback('?endpoint=portfolio');
    if (checkResponse.ok) {
      const existingPortfolio = await checkResponse.json();
      const slugExists = existingPortfolio.some((item: any) => 
        item.slug === slug && item.id !== body.id
      );
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'A portfolio item with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare portfolio data
    const portfolioData = {
      title,
      slug,
      description,
      content: content || '',
      excerpt: excerpt || description.substring(0, 200),
      image: image || '',
      gallery: Array.isArray(gallery) ? gallery : [],
      categoryId: categoryId || null,
      tags: Array.isArray(tags) ? tags : [],
      technologies: Array.isArray(technologies) ? technologies : [],
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      published: Boolean(published),
      featured: Boolean(featured),
      clientName: clientName || '',
      completedAt: completedAt || null,
      duration: duration || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createResponse = await apiPost('?endpoint=portfolio', portfolioData);
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${createResponse.status}`);
    }
    
    const result = await createResponse.json();
    
    return NextResponse.json({ 
      success: true, 
      portfolio: result.data || result 
    });

  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create portfolio item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
