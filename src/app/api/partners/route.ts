import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=partners`);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data dari CMS: ${response.statusText}`);
    }

    const data = await response.json();

    // Pastikan data yang diterima adalah array
    const partners = Array.isArray(data) ? data : [];

    return NextResponse.json(partners);
  } catch (error) {
    console.error('Kesalahan saat mengambil data partner:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data partner dari server' },
      { status: 500 }
    );
  }
} 
