import { NextResponse } from "next/server";
import { fetchWithFallback } from '@/utils/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.bajramedia.com/api_bridge.php";

export async function GET() {
  try {
    const response = await fetchWithFallback('?endpoint=posts&limit=10');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured posts' },
      { status: 500 }
    );
  }
}
