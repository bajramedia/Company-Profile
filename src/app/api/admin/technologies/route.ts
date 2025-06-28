import { NextRequest, NextResponse } from 'next/server';

// Try multiple API endpoints
const API_ENDPOINTS = [
    'https://bajramedia.com',
    'https://www.bajramedia.com',
    // Add your direct server IP if needed
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const include_inactive = searchParams.get('include_inactive');
        
        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                let url = `${baseUrl}/api_bridge.php/technologies`;
                const params = new URLSearchParams();
                
                if (category) {
                    params.append('category', category);
                }
                if (include_inactive) {
                    params.append('include_inactive', include_inactive);
                }
                
                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BajramediaAdmin/1.0',
                    },
                    cache: 'no-store',
                    signal: AbortSignal.timeout(10000), // 10 second timeout
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Check if we got actual data
                    if (!data.error) {
                        return NextResponse.json(data);
                    }
                }
            } catch (endpointError) {
                console.error(`Failed with ${baseUrl}:`, endpointError);
                continue;
            }
        }
        
        // If all endpoints fail, return fallback data
        console.log('All API endpoints failed, returning fallback data');
        
        // Fallback technologies data
        const fallbackTechnologies = [
            {
                id: 1,
                name: 'React',
                icon: '⚛️',
                description_en: 'Modern UI framework for building interactive user interfaces',
                description_id: 'Framework UI modern untuk membangun antarmuka pengguna interaktif',
                category: 'web',
                color: '#61DAFB',
                sort_order: 1,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Next.js',
                icon: '▲',
                description_en: 'Full-stack React framework with server-side rendering',
                description_id: 'Framework React full-stack dengan server-side rendering',
                category: 'web',
                color: '#000000',
                sort_order: 2,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 3,
                name: 'TypeScript',
                icon: '📘',
                description_en: 'Type-safe JavaScript for better development experience',
                description_id: 'JavaScript dengan type safety untuk pengembangan yang lebih baik',
                category: 'web',
                color: '#3178C6',
                sort_order: 3,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Tailwind CSS',
                icon: '🎨',
                description_en: 'Utility-first CSS framework for rapid UI development',
                description_id: 'Framework CSS utility-first untuk pengembangan UI yang cepat',
                category: 'web',
                color: '#06B6D4',
                sort_order: 4,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];

        return NextResponse.json(fallbackTechnologies);

    } catch (error) {
        console.error('Error in technologies API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch technologies', fallback: true },
            { status: 200 } // Return 200 with fallback data instead of 500
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.name || !body.icon) {
            return NextResponse.json(
                { error: 'Name and icon are required' },
                { status: 400 }
            );
        }

        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                const response = await fetch(`${baseUrl}/api_bridge.php/technologies`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BajramediaAdmin/1.0',
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(10000),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (!data.error) {
                        return NextResponse.json(data);
                    }
                }
            } catch (endpointError) {
                console.error(`POST failed with ${baseUrl}:`, endpointError);
                continue;
            }
        }

        // If all endpoints fail
        return NextResponse.json(
            { error: 'Failed to create technology - server unavailable' },
            { status: 503 }
        );

    } catch (error) {
        console.error('Error creating technology:', error);
        return NextResponse.json(
            { error: 'Failed to create technology' },
            { status: 500 }
        );
    }
} 