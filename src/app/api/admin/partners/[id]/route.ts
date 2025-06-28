import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://bajramedia.com';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    const response = await fetch(`${API_BASE_URL}/api_bridge.php?endpoint=partners&id=${id}`, {
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api_bridge.php?endpoint=partners&id=${id}`, {
      method: 'PUT',
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const response = await fetch(`${API_BASE_URL}/api_bridge.php?endpoint=partners&id=${id}`, {
      method: 'DELETE',
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