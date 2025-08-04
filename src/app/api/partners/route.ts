import { NextResponse } from 'next/server';
import API_BASE_URL from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=partners`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch partners: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return raw data from API without transformation
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
} 
