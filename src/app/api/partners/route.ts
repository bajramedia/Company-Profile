import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// Fallback partners data in case database is empty
const fallbackPartners = [
  {
    id: 1,
    name: "Inbis Primakara",
    nameId: "Inbis Primakara", 
    description: "Strategic partner in education and technology",
    descriptionId: "Partner strategis dalam bidang pendidikan dan teknologi",
    logo: "/images/inbis-primakara-logo.svg",
    website: "https://inbis.primakara.ac.id",
    type: "Education Partner",
    order: 1
  }
];

// GET /api/partners - Get all partners for public display
export async function GET() {
  try {
    console.log('[BAJRA API] 🤝 Fetching partners from production database...');
    
    const response = await fetch(`${API_BASE_URL}?endpoint=partners`, {
      method: 'GET',
      headers: {
        'User-Agent': 'BajramediaApp/1.0',
        'Accept': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    console.log('[BAJRA API] 📡 Partners API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const partners = await response.json();
    console.log('[BAJRA API] 📊 Raw partners data received:', typeof partners, Array.isArray(partners) ? partners.length : 'not array');
    
    // Handle different response formats
    let partnersArray = [];
    
    if (Array.isArray(partners)) {
      partnersArray = partners;
    } else if (partners && typeof partners === 'object' && partners.data) {
      partnersArray = Array.isArray(partners.data) ? partners.data : [];
    } else if (partners && typeof partners === 'object') {
      // Single object, wrap in array
      partnersArray = [partners];
    }
    
    // If no data from API, use fallback
    if (!partnersArray || partnersArray.length === 0) {
      console.log('[BAJRA API] ⚠️ No partners data from API, using fallback data');
      const formattedPartners = fallbackPartners.map(partner => ({
        ...partner,
        id: String(partner.id)
      }));
      return NextResponse.json(formattedPartners);
    }
    
    // Format partners for public display - match API bridge response structure
    const formattedPartners = partnersArray.map((partner: any, index: number) => ({
      id: partner.id || String(index + 1),
      name: partner.nameEn || partner.name_en || partner.name || `Partner ${index + 1}`,
      nameId: partner.nameId || partner.name_id || partner.nameEn || partner.name_en || partner.name || `Partner ${index + 1}`,
      description: partner.descriptionEn || partner.description_en || partner.description || "",
      descriptionId: partner.descriptionId || partner.description_id || partner.descriptionEn || partner.description_en || partner.description || "",
      logo: partner.logoUrl || partner.logo_url || partner.logo || "/images/logo.png", // Default logo
      website: partner.websiteUrl || partner.website_url || partner.website || "#",
      type: partner.partnerType || partner.partner_type || "Partner",
      order: partner.sort_order || partner.order || index // For sorting partners
    }));

    // Sort by order field
    formattedPartners.sort((a: any, b: any) => a.order - b.order);

    console.log('[BAJRA API] ✅ Partners processed successfully:', formattedPartners.length);
    return NextResponse.json(formattedPartners);
    
  } catch (error) {
    console.error('[BAJRA API] ❌ Partners API error:', error);
    
    // Return fallback data instead of error
    console.log('[BAJRA API] 🛡️ Using fallback partners data due to error');
    const formattedPartners = fallbackPartners.map(partner => ({
      ...partner,
      id: String(partner.id)
    }));
    
    return NextResponse.json(formattedPartners);
  }
} 