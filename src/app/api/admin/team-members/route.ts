import { NextRequest, NextResponse } from "next/server";

// Try multiple API endpoints
const API_ENDPOINTS = [
    'https://bajramedia.com',
    'https://www.bajramedia.com',
];

export async function GET(request: NextRequest) {
  try {
    let lastError: string = '';

    // Try each endpoint until one works
    for (const baseUrl of API_ENDPOINTS) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${baseUrl}/api_bridge.php/team-members`, {
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
                } else {
                    lastError = `API Error: ${data.error || 'Invalid data format'}`;
                }
            } else {
                lastError = `HTTP ${response.status}: ${response.statusText}`;
            }
        } catch (endpointError) {
            lastError = `Network Error: ${endpointError}`;
            console.error(`Team members failed with ${baseUrl}:`, endpointError);
            continue;
        }
    }

    return NextResponse.json(
        { 
            error: 'Failed to fetch team members from all endpoints',
            details: lastError,
            endpoints_tested: API_ENDPOINTS
        },
        { status: 500 }
    );
    
  } catch (error) {
    console.error('Team Members API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch team members',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let lastError: string = '';
    
    // Try each endpoint until one works
    for (const baseUrl of API_ENDPOINTS) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${baseUrl}/api_bridge.php/team-members`, {
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
            console.error(`POST team member failed with ${baseUrl}:`, endpointError);
            continue;
        }
    }

    return NextResponse.json(
        { 
            error: 'Failed to create team member - all endpoints failed',
            details: lastError
        },
        { status: 500 }
    );
    
  } catch (error) {
    console.error('Team Members API creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
