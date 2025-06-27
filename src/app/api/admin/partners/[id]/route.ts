import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://company-profile-mu-nine.vercel.app';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const response = await fetch(`${API_BASE_URL}/api_bridge.php?endpoint=partners&method=GET&id=${id}`, {
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
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch partner' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api_bridge.php?endpoint=partners&method=PUT&id=${id}`, {
      method: 'POST', // api_bridge menggunakan POST untuk semua
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
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update partner' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const response = await fetch(`${API_BASE_URL}/api_bridge.php?endpoint=partners&method=DELETE&id=${id}`, {
      method: 'POST', // api_bridge menggunakan POST untuk semua
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete partner' },
      { status: 500 }
    );
  }
} 