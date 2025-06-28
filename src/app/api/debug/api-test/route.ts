import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  try {
    console.log('🔍 Testing API connection...');
    console.log('🌐 API Base URL:', API_BASE_URL);
    
    // Test basic connection
    const response = await fetch(API_BASE_URL, {
      method: 'GET'
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    console.log('📄 Response data (first 200 chars):', data.substring(0, 200));
    
    // Test posts endpoint
    const postsResponse = await fetch(`${API_BASE_URL}?endpoint=posts&limit=5`);
    const postsData = await postsResponse.json();
    
    // Test portfolio endpoint
    const portfolioResponse = await fetch(`${API_BASE_URL}?endpoint=portfolio&limit=5`);
    const portfolioData = await portfolioResponse.json();
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      apiUrl: API_BASE_URL,
      basicConnection: {
        status: response.status,
        ok: response.ok
      },
      posts: {
        status: postsResponse.status,
        count: Array.isArray(postsData) ? postsData.length : 0,
        data: Array.isArray(postsData) ? postsData.slice(0, 2) : postsData
      },
      portfolio: {
        status: portfolioResponse.status,
        count: Array.isArray(portfolioData) ? portfolioData.length : 0,
        data: Array.isArray(portfolioData) ? portfolioData.slice(0, 2) : portfolioData
      }
    });
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        apiUrl: API_BASE_URL,
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    );
  }
} 