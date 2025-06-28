import { NextRequest, NextResponse } from 'next/server';

// Try multiple API endpoints
const API_ENDPOINTS = [
    'https://bajramedia.com',
    'https://www.bajramedia.com',
];

// GET /api/portfolio/tags - Get all portfolio tags
export async function GET(request: NextRequest) {
    try {
        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                const response = await fetch(`${baseUrl}/api_bridge.php/portfolio-tags`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BajramediaAdmin/1.0',
                    },
                    cache: 'no-store',
                    signal: AbortSignal.timeout(10000),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (!data.error && Array.isArray(data)) {
                        return NextResponse.json(data);
                    }
                }
            } catch (endpointError) {
                console.error(`Portfolio tags failed with ${baseUrl}:`, endpointError);
                continue;
            }
        }

        // If all endpoints fail, return fallback data
        console.log('All portfolio tags API endpoints failed, returning fallback data');
        
        const fallbackTags = [
            {
                id: 1,
                name: 'Web Development',
                slug: 'web-development',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Mobile App',
                slug: 'mobile-app',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 3,
                name: 'UI/UX Design',
                slug: 'ui-ux-design',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Digital Marketing',
                slug: 'digital-marketing',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];

        return NextResponse.json(fallbackTags);

    } catch (error) {
        console.error('Error in portfolio tags API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch portfolio tags', fallback: true },
            { status: 200 }
        );
    }
}

// POST /api/portfolio/tags - Create new portfolio tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const tagData = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      color: color || '#6B7280'
    };

    // Try each endpoint until one works
    for (const baseUrl of API_ENDPOINTS) {
        try {
            const response = await fetch(`${baseUrl}/api_bridge.php/portfolio-tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'BajramediaAdmin/1.0',
                },
                body: JSON.stringify(tagData),
                signal: AbortSignal.timeout(10000),
            });

            if (response.ok) {
                const result = await response.json();
                if (!result.error) {
                    return NextResponse.json({
                        success: true,
                        tag: {
                            id: result.id,
                            name: tagData.name,
                            slug: tagData.slug,
                            color: tagData.color
                        }
                    }, { status: 201 });
                }
            }
        } catch (endpointError) {
            console.error(`POST portfolio tags failed with ${baseUrl}:`, endpointError);
            continue;
        }
    }

    return NextResponse.json(
        { error: 'Failed to create portfolio tag - server unavailable' },
        { status: 503 }
    );

  } catch (error) {
    console.error('Portfolio Tags API: Database creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio tag in database' },
      { status: 500 }
    );
  }
} 