import { NextRequest, NextResponse } from 'next/server';

// Try multiple API endpoints
const API_ENDPOINTS = [
    'https://balimoonartandspeace.com',
    'https://www.bajramedia.com',
];

export async function GET(request: NextRequest) {
    try {
        // Try each endpoint until one works
        for (const baseUrl of API_ENDPOINTS) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(`${baseUrl}/api_bridge.php?endpoint=categories`, {
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
                    const categories = await response.json();
                    
                    if (!categories.error && Array.isArray(categories)) {
        
                        // Format categories untuk dropdown selection
                        const formattedCategories = categories.map((category: any) => ({
                            value: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || 'general',
                            label: category.name || 'Unknown Category',
                            color: '#6B7280', // Default color
                            description: category.description || ''
                        }));

                        return NextResponse.json(formattedCategories);
                    }
                }
            } catch (endpointError) {
                console.error(`Technology categories failed with ${baseUrl}:`, endpointError);
                continue;
            }
        }

        // If all endpoints fail, return proper error
        return NextResponse.json(
            { 
                error: 'Failed to fetch technology categories from all endpoints',
                endpoints_tested: API_ENDPOINTS,
                message: 'Please check server status and API bridge configuration'
            },
            { status: 500 }
        );
        
    } catch (error) {
        console.error('Error in technology categories API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch technology categories from database' },
            { status: 500 }
        );
    }
} 
