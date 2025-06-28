import { NextRequest, NextResponse } from 'next/server';

// Try multiple API endpoints
const API_ENDPOINTS = [
    'https://bajramedia.com',
    'https://www.bajramedia.com',
];

// GET /api/portfolio/categories - Get all portfolio categories
export async function GET(request: NextRequest) {
  try {
    let lastError: string = '';
    
    // Try each endpoint until one works
    for (const baseUrl of API_ENDPOINTS) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${baseUrl}/api_bridge.php/portfolio-categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'BajramediaAdmin/1.0',
                },
                cache: 'no-store',
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);

            console.log(`Testing portfolio-categories ${baseUrl}: Status ${response.status}`);
            
            if (response.ok) {
                const responseText = await response.text();
                console.log(`Portfolio categories response from ${baseUrl}:`, responseText.substring(0, 200));
                
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
            error: 'Failed to fetch portfolio categories from all endpoints',
            details: lastError,
            endpoints_tested: API_ENDPOINTS
        },
        { status: 500 }
    );
    
  } catch (error) {
    console.error('Portfolio Categories API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch portfolio categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 