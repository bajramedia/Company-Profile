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
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(`${baseUrl}/api_bridge.php/portfolio-tags`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BajramediaAdmin/1.0',
                    },
                    cache: 'no-store',
                    signal: controller.signal,
                });
                
                clearTimeout(timeoutId);

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

        // If all endpoints fail, return proper error
        return NextResponse.json(
            { 
                error: 'Failed to fetch portfolio tags from all endpoints',
                endpoints_tested: API_ENDPOINTS,
                message: 'Please check server status and API bridge configuration'
            },
            { status: 500 }
        );

    } catch (error) {
        console.error('Error in portfolio tags API:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch portfolio tags', 
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${baseUrl}/api_bridge.php/portfolio-tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'BajramediaAdmin/1.0',
                },
                body: JSON.stringify(tagData),
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);

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
