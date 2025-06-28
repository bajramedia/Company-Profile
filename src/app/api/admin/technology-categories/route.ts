import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${API_BASE_URL}/api_bridge.php/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const categories = await response.json();
        
        // Format categories untuk dropdown selection
        const formattedCategories = categories.map((category: any) => ({
            value: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || 'general',
            label: category.name || 'Unknown Category',
            color: '#6B7280', // Default color
            description: category.description || ''
        }));

        return NextResponse.json(formattedCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        
        // Fallback categories jika API error
        const fallbackCategories = [
            { value: 'web', label: 'Web Development', color: '#3B82F6' },
            { value: 'mobile', label: 'Mobile Development', color: '#10B981' },
            { value: 'uiux', label: 'UI/UX Design', color: '#F59E0B' },
            { value: 'general', label: 'General', color: '#6B7280' }
        ];
        
        return NextResponse.json(fallbackCategories);
    }
} 