import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

interface AboutContent {
  id: number;
  section_key: string;
  title_en: string;
  title_id: string;
  content_en: string;
  content_id: string;
  is_active: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'id';

  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=about-content`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Pastikan data adalah array
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data);
      return NextResponse.json({}, { status: 200 }); // Return empty object if not array
    }

    // Filter active content dan transform sesuai bahasa
    const organizedContent = data
      .filter((item: AboutContent) => item.is_active)
      .reduce((acc: { [key: string]: any }, item: AboutContent) => {
        // Log untuk debugging
        console.log('Processing item:', item.section_key);
        
        acc[item.section_key] = {
          id: item.id,
          section: item.section_key,
          title: language === 'id' ? item.title_id : item.title_en,
          content: language === 'id' ? item.content_id : item.content_en
        };
        return acc;
      }, {});

    // Log hasil akhir untuk debugging
    console.log('Organized content:', organizedContent);
    
    return NextResponse.json(organizedContent);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
} 