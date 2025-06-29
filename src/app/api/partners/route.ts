import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/config/api';

// GET /api/partners - Get all partners for public display
export async function GET() {
  try {
    console.log('Public Partners API: Fetching from production database...');
    const response = await fetch(`${API_BASE_URL}?endpoint=partners`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const partners = await response.json();
    return Response.json(partners);
  } catch (error) {
    console.error('Public Partners API: Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch partners from database',
        message: 'Please check if partners table exists in bajx7634_bajra database',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 
