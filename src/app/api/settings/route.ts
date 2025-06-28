import { NextResponse } from 'next/server';
import { fetchWithFallback } from '@/utils/api-client';

// GET /api/settings - Get application settings
export async function GET() {
  try {
    const timestamp = Date.now();
    const response = await fetchWithFallback(`?endpoint=settings&_t=${timestamp}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// Disable static generation untuk endpoint ini
export const dynamic = 'force-dynamic';
export const revalidate = 0;
