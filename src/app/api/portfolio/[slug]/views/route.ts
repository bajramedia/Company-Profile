import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Implementasi view tracking yang benar
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api_bridge.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'incrementPortfolioView',
        slug: slug
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'View counted successfully',
        viewCount: result.viewCount,
        slug
      });
    } else {
      throw new Error(result.error || 'Failed to increment view count');
    }
  } catch (error) {
    console.error('Error tracking portfolio view:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track view' },
      { status: 500 }
    );
  }
} 