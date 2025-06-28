import { NextResponse } from 'next/server';
import { fetchWithFallback } from '@/utils/api-client';

// GET /api/partners - Get all partners for public display
export async function GET() {
  try {
    console.log('Public Partners API: Fetching from production database...');
    const response = await fetchWithFallback('?endpoint=partners');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const partners = await response.json();
    
    // Format partners for public display - match API bridge response structure
    const formattedPartners = partners.map((partner: any) => ({
      id: partner.id,
      name: partner.nameEn || partner.name_en || partner.name || "Partner",
      nameId: partner.nameId || partner.name_id || partner.nameEn || partner.name_en || partner.name || "Partner",
      description: partner.descriptionEn || partner.description_en || partner.description || "",
      descriptionId: partner.descriptionId || partner.description_id || partner.descriptionEn || partner.description_en || partner.description || "",
      logo: partner.logoUrl || partner.logo_url || partner.logo || "/images/logo.png", // Default logo
      website: partner.websiteUrl || partner.website_url || partner.website || "#",
      type: partner.partnerType || partner.partner_type || "Partner",
      order: partner.sort_order || partner.order || 0 // For sorting partners
    }));

    // Sort by order field
    formattedPartners.sort((a: any, b: any) => a.order - b.order);

    console.log('Public Partners API: Database success');
    return NextResponse.json(formattedPartners);
    
  } catch (error) {
    console.error('Public Partners API: Database connection failed:', error);
    
    // Return empty array instead of 500 error to prevent page crash
    const fallbackPartners: any[] = [];
    
    return NextResponse.json(fallbackPartners);
  }
} 
