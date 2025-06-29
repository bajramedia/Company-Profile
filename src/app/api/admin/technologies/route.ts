import { NextRequest, NextResponse } from 'next/server';

// Try multiple API endpoints
const API_ENDPOINTS = [
    'https://balimoonartandspeace.com',
    'https://www.bajramedia.com',
    // Add your direct server IP if needed
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const include_inactive = searchParams.get('include_inactive');
        
        let lastError: string = '';
        
        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                let url = `${baseUrl}/api.php/technologies`;
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

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BajramediaAdmin/1.0',
                    },
                    cache: 'no-store',
                    signal: controller.signal,
                });
                
                clearTimeout(timeoutId);

                console.log(`Testing ${baseUrl}: Status ${response.status}`);
                
                if (response.ok) {
                    const responseText = await response.text();
                    console.log(`Response from ${baseUrl}:`, responseText.substring(0, 200));
                    
                    try {
                        const data = JSON.parse(responseText);
                        
                        // Check if we got actual data or error
                        if (data.error) {
                            lastError = `API Error from ${baseUrl}: ${data.error}`;
                            console.error(lastError);
                            continue;
                        }
                        
                        return NextResponse.json(data);
                    } catch (parseError) {
                        lastError = `JSON Parse Error from ${baseUrl}: ${parseError}`;
                        console.error(lastError);
                        continue;
                    }
                } else {
                    lastError = `HTTP ${response.status} from ${baseUrl}: ${response.statusText}`;
                    console.error(lastError);
                }
            } catch (endpointError) {
                lastError = `Network Error from ${baseUrl}: ${endpointError}`;
                console.error(lastError);
                continue;
            }
        }
        
        // If all endpoints failed, return detailed error
        return NextResponse.json(
            { 
                error: 'Failed to fetch technologies from all endpoints',
                details: lastError,
                endpoints_tested: API_ENDPOINTS
            },
            { status: 500 }
        );

    } catch (error) {
        console.error('Error in technologies API:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch technologies', 
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
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

        let lastError: string = '';

        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(`${baseUrl}/api.php/technologies`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BajramediaAdmin/1.0',
                    },
                    body: JSON.stringify(body),
                    signal: controller.signal,
                });
                
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    if (!data.error) {
                        return NextResponse.json(data);
                    } else {
                        lastError = `API Error: ${data.error}`;
                    }
                } else {
                    lastError = `HTTP ${response.status}: ${response.statusText}`;
                }
            } catch (endpointError) {
                lastError = `Network Error: ${endpointError}`;
                console.error(`POST failed with ${baseUrl}:`, endpointError);
                continue;
            }
        }

        return NextResponse.json(
            { 
                error: 'Failed to create technology - all endpoints failed',
                details: lastError
            },
            { status: 500 }
        );

    } catch (error) {
        console.error('Error creating technology:', error);
        return NextResponse.json(
            { error: 'Failed to create technology' },
            { status: 500 }
        );
    }
} 
