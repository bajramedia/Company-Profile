import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bajramedia.com/api_bridge.php";

// GET - Ambil public settings (tanpa admin settings)
export async function GET() {
  try {
    // Get settings from external API
    const response = await fetch(`${API_BASE_URL}?endpoint=settings`);
    
    if (!response.ok) {
      console.error(`API Bridge settings error: ${response.status}`);
      // Return default settings if API fails
      return NextResponse.json({
        siteName: 'Bajramedia',
        siteDescription: 'Professional Web Development & Digital Solutions',
        siteUrl: 'https://bajramedia.com',
        contactEmail: 'info@bajramedia.com',
        contactPhone: '+62 123 456 789',
        contactAddress: 'Bali, Indonesia',
        socialLinks: {},
        footerText: '© 2024 Bajramedia. All rights reserved.',
        seoSettings: {},
        enableComments: false,
        enableSocialShare: true
      });
    }
    
    const settings = await response.json();
    
    // If API returns empty object, use defaults
    if (!settings || Object.keys(settings).length === 0) {
      return NextResponse.json({
        siteName: 'Bajramedia',
        siteDescription: 'Professional Web Development & Digital Solutions',
        siteUrl: 'https://bajramedia.com',
        contactEmail: 'info@bajramedia.com',
        contactPhone: '+62 123 456 789',
        contactAddress: 'Bali, Indonesia',
        socialLinks: {},
        footerText: '© 2024 Bajramedia. All rights reserved.',
        seoSettings: {},
        enableComments: false,
        enableSocialShare: true
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    
    // Return default settings as fallback
    return NextResponse.json({
      siteName: 'Bajramedia',
      siteDescription: 'Professional Web Development & Digital Solutions',
      siteUrl: 'https://bajramedia.com',
      contactEmail: 'info@bajramedia.com',
      contactPhone: '+62 123 456 789',
      contactAddress: 'Bali, Indonesia',
      socialLinks: {},
      footerText: '© 2024 Bajramedia. All rights reserved.',
      seoSettings: {},
      enableComments: false,
      enableSocialShare: true
    });
  }
}
