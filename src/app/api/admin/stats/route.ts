import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET() {
  try {
    console.log('Stats API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stats = await response.json();
    console.log('Stats API: Database success');
    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Stats API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats from database',
        message: 'Please check database connection and stats tables',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
