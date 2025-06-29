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
        
        console.log('🔄 Admin Technologies API: Fetching technologies...', { category, include_inactive });
        
        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                let url = `${baseUrl}/api_bridge.php?endpoint=technologies`;
                const params = new URLSearchParams();
                
                if (category) {
                    params.append('category', category);
                }
                if (include_inactive) {
                    params.append('include_inactive', include_inactive);
                }
                
                if (params.toString()) {
                    url += `&${params.toString()}`;
                }

                console.log(`🌐 Trying: ${url}`);

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

                console.log(`📊 Response status: ${response.status} from ${baseUrl}`);
                
                if (response.ok) {
                    const responseText = await response.text();
                    console.log(`📄 Response preview:`, responseText.substring(0, 200));
                    
                    try {
                        const data = JSON.parse(responseText);
                        
                        // Check if we got actual data or error
                        if (data.error) {
                            lastError = `API Error from ${baseUrl}: ${data.error}`;
                            console.error('❌', lastError);
                            continue;
                        }
                        
                        console.log('✅ Technologies loaded:', data.length, 'items');
                        return NextResponse.json(data);
                    } catch (parseError) {
                        lastError = `JSON Parse Error from ${baseUrl}: ${parseError}`;
                        console.error('❌', lastError);
                        continue;
                    }
                } else {
                    lastError = `HTTP ${response.status} from ${baseUrl}: ${response.statusText}`;
                    console.error('❌', lastError);
                }
            } catch (endpointError) {
                lastError = `Network Error from ${baseUrl}: ${endpointError}`;
                console.error('❌', lastError);
                continue;
            }
        }
        
        // If all endpoints failed, return detailed error
        console.error('❌ All endpoints failed:', lastError);
        return NextResponse.json(
            { 
                error: 'Failed to fetch technologies from all endpoints',
                details: lastError,
                endpoints_tested: API_ENDPOINTS
            },
            { status: 500 }
        );

    } catch (error) {
        console.error('❌ Error in technologies API:', error);
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
        
        console.log('🔄 Creating technology:', body);
        
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
                
                const response = await fetch(`${baseUrl}/api_bridge.php?endpoint=technologies`, {
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
                        console.log('✅ Technology created successfully:', data);
                        return NextResponse.json(data);
                    } else {
                        lastError = `API Error: ${data.error}`;
                    }
                } else {
                    lastError = `HTTP ${response.status}: ${response.statusText}`;
                }
            } catch (endpointError) {
                lastError = `Network Error: ${endpointError}`;
                console.error(`❌ POST failed with ${baseUrl}:`, endpointError);
                continue;
            }
        }

        console.error('❌ Failed to create technology:', lastError);
        return NextResponse.json(
            { 
                error: 'Failed to create technology - all endpoints failed',
                details: lastError
            },
            { status: 500 }
        );

    } catch (error) {
        console.error('❌ Error creating technology:', error);
        return NextResponse.json(
            { error: 'Failed to create technology' },
            { status: 500 }
        );
    }
} 
