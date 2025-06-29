import { NextResponse } from "next/server";

// Try multiple API endpoints
const API_ENDPOINTS = [
    'https://balimoonartandspeace.com',
    'https://www.bajramedia.com',
];

export async function GET() {
  try {
    // Try each endpoint until one works
    for (const baseUrl of API_ENDPOINTS) {
        try {
            const response = await fetch(`${baseUrl}/api.php/categories`, {
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
                    const formattedCategories = data.map((category: any) => ({
                        ...category,
                        postCount: category.postCount || 0
                    }));
                    return NextResponse.json(formattedCategories);
                }
            }
        } catch (endpointError) {
            console.error(`Categories failed with ${baseUrl}:`, endpointError);
            continue;
        }
    }

         // If all endpoints fail, return proper error
     return NextResponse.json(
         { 
             error: 'Failed to fetch categories from all endpoints',
             endpoints_tested: API_ENDPOINTS,
             message: 'Please check server status and API bridge configuration'
         },
         { status: 500 }
     );
    
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', fallback: true },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const categoryData = {
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description || ''
    };

    // Try each endpoint until one works
    for (const baseUrl of API_ENDPOINTS) {
        try {
            const response = await fetch(`${baseUrl}/api.php/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'BajramediaAdmin/1.0',
                },
                body: JSON.stringify(categoryData),
                signal: AbortSignal.timeout(10000),
            });

            if (response.ok) {
                const result = await response.json();
                if (!result.error) {
                    return NextResponse.json({ 
                        success: true, 
                        category: { 
                            id: result.id,
                            name: categoryData.name,
                            slug: categoryData.slug,
                            description: categoryData.description,
                            postCount: 0
                        }
                    }, { status: 201 });
                }
            }
        } catch (endpointError) {
            console.error(`POST categories failed with ${baseUrl}:`, endpointError);
            continue;
        }
    }

    return NextResponse.json(
        { error: 'Failed to create category - server unavailable' },
        { status: 503 }
    );

  } catch (error) {
    console.error('Categories API: Database creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create category in database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
