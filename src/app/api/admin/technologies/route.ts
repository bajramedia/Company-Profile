import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const include_inactive = searchParams.get('include_inactive');
        
        let url = `${API_BASE_URL}/api_bridge.php/technologies`;
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
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching technologies:', error);
        return NextResponse.json(
            { error: 'Failed to fetch technologies' },
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

        const response = await fetch(`${API_BASE_URL}/api_bridge.php/technologies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating technology:', error);
        return NextResponse.json(
            { error: 'Failed to create technology' },
            { status: 500 }
        );
    }
} 