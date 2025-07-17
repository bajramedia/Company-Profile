import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=team-members`);
    
    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari CMS: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Pastikan data yang diterima adalah array
    const team = Array.isArray(data) ? data : [];
    
    return NextResponse.json(team);
  } catch (error) {
    console.error('Kesalahan saat mengambil data tim:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tim dari server' },
      { status: 500 }
    );
  }
} 