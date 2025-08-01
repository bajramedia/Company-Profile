import { NextResponse } from 'next/server';
import API_BASE_URL from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=about-content`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Bridge Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error('Failed to fetch about content from API bridge');
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in API route /api/content/about:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 