import { NextResponse } from "next/server";

export async function GET() {
  const debugInfo = {
    environment: 'vercel',
    timestamp: new Date().toISOString(),
    env_vars: {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
    api_tests: {}
  };

  // Test API bridge connection
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';
  
  try {
    // Test categories endpoint
    const categoriesResponse = await fetch(`${API_BASE_URL}?endpoint=categories`, {
      headers: {
        'User-Agent': 'Vercel-Debug-Client',
      }
    });
    
    debugInfo.api_tests.categories = {
      url: `${API_BASE_URL}?endpoint=categories`,
      status: categoriesResponse.status,
      ok: categoriesResponse.ok,
      headers: Object.fromEntries(categoriesResponse.headers.entries()),
    };

    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json();
      debugInfo.api_tests.categories.data_count = Array.isArray(data) ? data.length : 'not_array';
      debugInfo.api_tests.categories.sample_data = Array.isArray(data) && data.length > 0 ? data[0] : null;
    } else {
      debugInfo.api_tests.categories.error = await categoriesResponse.text();
    }
  } catch (error) {
    debugInfo.api_tests.categories = {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  try {
    // Test posts endpoint
    const postsResponse = await fetch(`${API_BASE_URL}?endpoint=posts&limit=1`, {
      headers: {
        'User-Agent': 'Vercel-Debug-Client',
      }
    });
    
    debugInfo.api_tests.posts = {
      url: `${API_BASE_URL}?endpoint=posts&limit=1`,
      status: postsResponse.status,
      ok: postsResponse.ok,
    };

    if (postsResponse.ok) {
      const data = await postsResponse.json();
      debugInfo.api_tests.posts.data_count = Array.isArray(data) ? data.length : 'not_array';
    }
  } catch (error) {
    debugInfo.api_tests.posts = {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return NextResponse.json(debugInfo, { status: 200 });
} 