import { NextResponse } from 'next/server';
import { fetchWithFallback } from '@/utils/api-client';

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    const response = await fetchWithFallback('?endpoint=stats');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
