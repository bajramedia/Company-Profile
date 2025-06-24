import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Ambil semua settings
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    
    // Transform array ke object untuk kemudahan penggunaan
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
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Simpan atau update settings
export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    
    // Simpan setiap setting secara individual
    const updatePromises = Object.entries(settings).map(async ([key, value]) => {
      let stringValue = String(value);
      let type = 'string';
      
      // Tentukan tipe data
      if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (typeof value === 'object' && value !== null) {
        type = 'json';
        stringValue = JSON.stringify(value);
      }
      
      return prisma.setting.upsert({
        where: { key },
        update: { 
          value: stringValue,
          type 
        },
        create: { 
          key,
          value: stringValue,
          type 
        }
      });
    });
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus setting tertentu
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      );
    }
    
    await prisma.setting.delete({
      where: { key }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    );
  }
}
