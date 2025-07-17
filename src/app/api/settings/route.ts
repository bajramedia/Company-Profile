import { NextResponse } from 'next/server';
import { apiEndpoints, defaultFetchOptions } from '@/config/api';

// GET - Ambil public settings (tanpa admin settings)
export async function GET() {
  try {
    // Add timestamp to prevent cache
    const timestamp = Date.now();
    const response = await fetch(apiEndpoints.settings(), {
      ...defaultFetchOptions,
      headers: {
        ...defaultFetchOptions.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'User-Agent': 'BajraMedia-NextJS/1.0',
        'Origin': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const settings = await response.json();
    
    // Parse JSON strings if they exist in the raw response
    let socialLinksObj: any = {};
    let seoSettingsObj: any = {};
    
    try {
      if (settings.socialLinks && typeof settings.socialLinks === 'string') {
        socialLinksObj = JSON.parse(settings.socialLinks);
      } else if (settings.socialLinks && typeof settings.socialLinks === 'object') {
        socialLinksObj = settings.socialLinks;
      }
    } catch (e) {
      console.warn('Failed to parse socialLinks JSON:', e);
    }
    
    try {
      if (settings.seoSettings && typeof settings.seoSettings === 'string') {
        seoSettingsObj = JSON.parse(settings.seoSettings);
      } else if (settings.seoSettings && typeof settings.seoSettings === 'object') {
        seoSettingsObj = settings.seoSettings;
      }
    } catch (e) {
      console.warn('Failed to parse seoSettings JSON:', e);
    }

    // Format settings untuk public use
    const publicSettings = {
      siteName: settings.siteName || 'Bajramedia',
      siteDescription: settings.siteDescription || 'Creative Digital Agency & Blog Platform',
      siteUrl: settings.siteUrl || 'https://balimoonartandspeace.com',
      contactEmail: settings.contactEmail || 'contact@bajramedia.com',
      contactPhone: settings.contactPhone || '+6285739402436',
      contactAddress: settings.contactAddress || 'Bali, Indonesia',
      footerText: settings.footerText || '© 2025 Bajramedia. All rights reserved.',
      enableComments: settings.enableComments !== undefined ? settings.enableComments : true,
      enableSocialShare: settings.enableSocialShare !== undefined ? settings.enableSocialShare : true,
      socialLinks: {
        facebook: socialLinksObj.facebook || settings.social_facebook || '',
        twitter: socialLinksObj.twitter || settings.social_twitter || '',
        instagram: socialLinksObj.instagram || settings.social_instagram || '',
        linkedin: socialLinksObj.linkedin || settings.social_linkedin || '',
        youtube: socialLinksObj.youtube || settings.social_youtube || ''
      },
      seoSettings: {
        metaTitle: seoSettingsObj.metaTitle || settings.seo_metaTitle || 'Bajramedia - Creative Digital Agency',
        metaDescription: seoSettingsObj.metaDescription || settings.seo_metaDescription || 'Professional digital agency providing creative solutions for your business needs.',
        metaKeywords: seoSettingsObj.metaKeywords || settings.seo_metaKeywords || 'digital agency, creative, design, development, bali',
        ogImage: seoSettingsObj.ogImage || settings.seo_ogImage || ''
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
    // Return default settings jika ada error
    return NextResponse.json({
      siteName: 'Bajramedia',
      siteDescription: 'Creative Digital Agency & Blog Platform',
      siteUrl: 'https://balimoonartandspeace.com',
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
    }, { status: 200 });
  }
}

// Disable static generation untuk endpoint ini
export const dynamic = 'force-dynamic';
export const revalidate = 0;
