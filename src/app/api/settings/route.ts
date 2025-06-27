import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com/api_bridge.php';

// GET - Ambil public settings (tanpa admin settings)
export async function GET() {
  try {
    // Add timestamp to prevent cache
    const timestamp = Date.now();
    const response = await fetch(`${API_BASE_URL}?endpoint=settings&_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const settings = await response.json();
    
    // Format settings untuk public use
    const publicSettings = {
      siteName: settings.siteName || 'Bajramedia',
      siteDescription: settings.siteDescription || 'Creative Digital Agency & Blog Platform',
      siteUrl: settings.siteUrl || 'https://bajramedia.com',
      contactEmail: settings.contactEmail || 'contact@bajramedia.com',
      contactPhone: settings.contactPhone || '+6285739402436',
      contactAddress: settings.contactAddress || 'Bali, Indonesia',
      footerText: settings.footerText || '© 2025 Bajramedia. All rights reserved.',
      enableComments: settings.enableComments !== undefined ? settings.enableComments : true,
      enableSocialShare: settings.enableSocialShare !== undefined ? settings.enableSocialShare : true,
      socialLinks: {
        facebook: settings.social_facebook || '',
        twitter: settings.social_twitter || '',
        instagram: settings.social_instagram || '',
        linkedin: settings.social_linkedin || '',
        youtube: settings.social_youtube || ''
      },
      seoSettings: {
        metaTitle: settings.seo_metaTitle || 'Bajramedia - Creative Digital Agency',
        metaDescription: settings.seo_metaDescription || 'Professional digital agency providing creative solutions for your business needs.',
        metaKeywords: settings.seo_metaKeywords || 'digital agency, creative, design, development, bali',
        ogImage: settings.seo_ogImage || ''
      }
    };

    // Return dengan headers no-cache yang aggressive
    return NextResponse.json(publicSettings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${timestamp}"`,
        'Vary': 'Origin',
        'X-Fresh-Data': 'true'
      }
    });

  } catch (error) {
    console.error('Error fetching public settings:', error);
    
    // Return default settings sebagai fallback
    return NextResponse.json({
      siteName: 'Bajramedia',
      siteDescription: 'Creative Digital Agency & Blog Platform',
      siteUrl: 'https://bajramedia.com',
      contactEmail: 'contact@bajramedia.com',
      contactPhone: '+6285739402436',
      contactAddress: 'Bali, Indonesia',
      footerText: '© 2025 Bajramedia. All rights reserved.',
      enableComments: true,
      enableSocialShare: true,
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      },
      seoSettings: {
        metaTitle: 'Bajramedia - Creative Digital Agency',
        metaDescription: 'Professional digital agency providing creative solutions for your business needs.',
        metaKeywords: 'digital agency, creative, design, development, bali',
        ogImage: ''
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

// Disable static generation untuk endpoint ini
export const dynamic = 'force-dynamic';
export const revalidate = 0;
