import { NextRequest, NextResponse } from 'next/server';

import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api.php?endpoint=partners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi field yang required
    const { name_en, name_id, partner_type } = body;
    if (!name_en || !name_id || !partner_type) {
      return NextResponse.json(
        { error: 'Name (EN), Name (ID), and Partner Type are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api.php?endpoint=partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create partner' },
      { status: 500 }
    );
  }
} 
