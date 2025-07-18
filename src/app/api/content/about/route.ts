import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'id';

  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=about-content`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Pastikan data adalah array dan hanya ambil yang aktif
    const activeContent = Array.isArray(data) ? data.filter((item: any) => item.is_active) : [];

    // Transform data sesuai dengan bahasa yang dipilih
    const transformedContent = activeContent.map((item: any) => ({
      id: item.id,
      section: item.section_key,
      title: language === 'id' ? item.title_id : item.title_en,
      content: language === 'id' ? item.content_id : item.content_en
    }));

    // Organize content by section
    const organizedContent = transformedContent.reduce((acc: any, item: any) => {
      acc[item.section] = item;
      return acc;
    }, {});
    
    return NextResponse.json(organizedContent);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
} 