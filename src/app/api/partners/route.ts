import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=partners`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch partners: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data sesuai dengan struktur yang diharapkan
    const transformedPartners = data.map((partner: any) => ({
      id: partner.id,
      name: partner.name_en,
      nameId: partner.name_id,
      logo: partner.logo_url || '/images/partners/placeholder.jpg',
      website: partner.website_url || '#'
    }));
    
    return NextResponse.json(transformedPartners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
} 
