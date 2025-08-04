import { NextResponse } from 'next/server';
import API_BASE_URL from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=partners`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch partners: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data to match frontend expectations
    const transformedData = Array.isArray(data) ? data.map(partner => ({
      id: partner.id,
      name_en: partner.name_en || partner.nameEn || partner.name || '',
      name_id: partner.name_id || partner.nameId || partner.name || '',
      description_en: partner.description_en || partner.descriptionEn || partner.description || '',
      description_id: partner.description_id || partner.descriptionId || partner.description || '',
      logo_url: partner.logo_url || partner.logoUrl || partner.logo || '',
      website_url: partner.website_url || partner.websiteUrl || partner.website || '',
      is_active: partner.is_active || partner.isActive || 1
    })) : [];
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
} 
