import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET(request: Request) {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=about-content`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Pastikan data adalah array dan hanya ambil yang aktif
    const activeContent = Array.isArray(data) ? data.filter((item: any) => item.is_active) : [];
    
    return NextResponse.json(activeContent);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
} 