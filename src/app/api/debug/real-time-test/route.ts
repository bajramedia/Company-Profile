import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    apiUrl: API_BASE_URL,
    tests: [] as any[]
  };

  // Test 1: Basic API Connection
  try {
    console.log('🔍 Testing basic API connection...');
    const basicResponse = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bajramedia-Website/1.0'
      }
    });
    
    results.tests.push({
      name: 'Basic Connection',
      success: basicResponse.ok,
      status: basicResponse.status,
      statusText: basicResponse.statusText,
      headers: Object.fromEntries(basicResponse.headers.entries())
    });
  } catch (error) {
    results.tests.push({
      name: 'Basic Connection',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Posts Endpoint
  try {
    console.log('📝 Testing posts endpoint...');
    const postsResponse = await fetch(`${API_BASE_URL}?endpoint=posts&limit=3`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bajramedia-Website/1.0'
      }
    });
    
    const postsData = await postsResponse.json();
    
    results.tests.push({
      name: 'Posts Endpoint',
      success: postsResponse.ok,
      status: postsResponse.status,
      dataType: Array.isArray(postsData) ? 'array' : typeof postsData,
      itemCount: Array.isArray(postsData) ? postsData.length : 0,
      firstItem: Array.isArray(postsData) && postsData.length > 0 ? {
        id: postsData[0].id,
        title: postsData[0].title?.substring(0, 50) + '...',
        published: postsData[0].published,
        author: postsData[0].authorName
      } : null
    });
  } catch (error) {
    results.tests.push({
      name: 'Posts Endpoint',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Portfolio Endpoint
  try {
    console.log('💼 Testing portfolio endpoint...');
    const portfolioResponse = await fetch(`${API_BASE_URL}?endpoint=portfolio&limit=3`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Bajramedia-Website/1.0'
      }
    });
    
    const portfolioData = await portfolioResponse.json();
    
    results.tests.push({
      name: 'Portfolio Endpoint',
      success: portfolioResponse.ok,
      status: portfolioResponse.status,
      dataType: Array.isArray(portfolioData) ? 'array' : typeof portfolioData,
      itemCount: Array.isArray(portfolioData) ? portfolioData.length : 0,
      firstItem: Array.isArray(portfolioData) && portfolioData.length > 0 ? {
        id: portfolioData[0].id,
        title: portfolioData[0].title?.substring(0, 50) + '...',
        published: portfolioData[0].published,
        client: portfolioData[0].clientName
      } : null
    });
  } catch (error) {
    results.tests.push({
      name: 'Portfolio Endpoint',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 4: Featured Posts (Internal API)
  try {
    console.log('⭐ Testing featured posts internal API...');
    const featuredResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/posts/featured`, {
      method: 'GET'
    });
    
    const featuredData = await featuredResponse.json();
    
    results.tests.push({
      name: 'Featured Posts Internal',
      success: featuredResponse.ok,
      status: featuredResponse.status,
      dataType: Array.isArray(featuredData) ? 'array' : typeof featuredData,
      itemCount: Array.isArray(featuredData) ? featuredData.length : 0
    });
  } catch (error) {
    results.tests.push({
      name: 'Featured Posts Internal',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Summary
  const successCount = results.tests.filter(test => test.success).length;
  const totalTests = results.tests.length;
  
  return NextResponse.json({
    ...results,
    summary: {
      total: totalTests,
      passed: successCount,
      failed: totalTests - successCount,
      successRate: `${Math.round((successCount / totalTests) * 100)}%`
    }
  });
} 