import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

// GET /api/portfolio/tags - Get all portfolio tags
export async function GET() {
  try {
    // Try to get tags from API bridge first
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=portfolio_tags`);
      
      if (response.ok) {
        const tags = await response.json();
        return NextResponse.json(tags);
      }
    } catch (apiError) {
      console.log('API bridge not available, using fallback data');
    }

    // Fallback to default tags if API bridge fails
    const defaultTags = [
      {
        id: 'react-001',
        name: 'React',
        slug: 'react',
        color: '#61DAFB'
      },
      {
        id: 'nextjs-001',
        name: 'Next.js',
        slug: 'nextjs',
        color: '#000000'
      },
      {
        id: 'typescript-001',
        name: 'TypeScript',
        slug: 'typescript',
        color: '#3178C6'
      },
      {
        id: 'tailwind-001',
        name: 'Tailwind CSS',
        slug: 'tailwindcss',
        color: '#06B6D4'
      },
      {
        id: 'nodejs-001',
        name: 'Node.js',
        slug: 'nodejs',
        color: '#339933'
      },
      {
        id: 'reactnative-001',
        name: 'React Native',
        slug: 'react-native',
        color: '#61DAFB'
      },
      {
        id: 'figma-001',
        name: 'Figma',
        slug: 'figma',
        color: '#F24E1E'
      },
      {
        id: 'adobexd-001',
        name: 'Adobe XD',
        slug: 'adobe-xd',
        color: '#FF61F6'
      },
      {
        id: 'mysql-001',
        name: 'MySQL',
        slug: 'mysql',
        color: '#4479A1'
      },
      {
        id: 'prisma-001',
        name: 'Prisma',
        slug: 'prisma',
        color: '#2D3748'
      }
    ];

    return NextResponse.json(defaultTags);

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

    // Try to create via API bridge
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=portfolio_tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, slug, color })
      });

      if (response.ok) {
        const result = await response.json();
        return NextResponse.json(result, { status: 201 });
      }
    } catch (apiError) {
      console.log('API bridge not available for tag creation');
    }

    // Fallback response for tag creation
    const newTag = {
      id: `tag-${Date.now()}`,
      name,
      slug,
      color: color || '#6B7280'
    };

    return NextResponse.json(newTag, { status: 201 });

  } catch (error) {
    console.error('Error creating portfolio tag:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio tag' },
      { status: 500 }
    );
  }
} 