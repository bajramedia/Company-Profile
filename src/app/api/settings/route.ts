import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Ambil public settings (tanpa admin settings)
export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'siteName',
            'siteDescription', 
            'siteUrl',
            'contactEmail',
            'contactPhone',
            'contactAddress',
            'socialLinks',
            'footerText',
            'seoSettings',
            'enableComments',
            'enableSocialShare'
          ]
        }
      }
    });
      // Transform array ke object
    const settingsObject = settings.reduce((acc, setting) => {
      let value: any = setting.value;
      
      // Parse nilai berdasarkan tipe
      switch (setting.type) {
        case 'number':
          value = parseFloat(setting.value);
          break;
        case 'boolean':
          value = setting.value === 'true';
          break;
        case 'json':
          try {
            value = JSON.parse(setting.value);
          } catch {
            value = setting.value;
          }
          break;
        default:
          value = setting.value;
      }
      
      acc[setting.key] = value;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public settings' },
      { status: 500 }
    );
  }
}
