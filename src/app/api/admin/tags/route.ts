import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=tags`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tags = await response.json();
    
    // Add postCount (for now set to 0, can be enhanced later)
    const formattedTags = tags.map((tag: any) => ({
      ...tag,
      postCount: 0 // TODO: Get actual post count from API
    }));
    
    return NextResponse.json(formattedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // TODO: Implement tag creation via external API bridge
  // For now, return not implemented
  return NextResponse.json(
    { error: 'Tag creation not yet implemented with external API bridge' }, 
    { status: 501 }
  );
}
