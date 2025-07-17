import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'id';

  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=about-content&language=${language}`);
    
    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari CMS: ${response.statusText}`);
    }
    
    const data = await response.json();

    // Pastikan data yang diterima adalah array
    const content = Array.isArray(data) ? data : [];
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Kesalahan saat mengambil konten "Tentang":', error);
    return NextResponse.json(
      { error: 'Gagal mengambil konten dari server' },
      { status: 500 }
    );
  }
} 