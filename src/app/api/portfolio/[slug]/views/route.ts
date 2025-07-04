import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Debug logging for production
    console.log('📊 Portfolio View Tracking:', {
      slug,
      apiBaseUrl: API_BASE_URL,
      timestamp: new Date().toISOString()
    });
    
    // Use configured API base URL for production compatibility
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'incrementPortfolioView',
        slug: slug
      })
    });

    console.log('📊 API Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Portfolio API Error:', {
        status: response.status,
        statusText: response.statusText,
        responseBody: errorText,
        url: API_BASE_URL
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Portfolio API Success:', result);
    
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
    console.error('💥 Error tracking portfolio view:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track view', details: error.message },
      { status: 500 }
    );
  }
} 