import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Debug: Testing post creation...');
    
    // Test data
    const testData = {
      title: "Debug Test Post",
      slug: "debug-test-post",
      excerpt: "This is a debug test post",
      content: "This is the content of debug test post",
      featuredImage: "https://res.cloudinary.com/dsv1rsopo/image/upload/v1750920863/bajramedia/debug/tbpkqh0yo3gmozyhgluv.png",
      published: true,
      readTime: 5,
      authorId: "1",
      categoryId: "1",
      tags: []
    };

    console.log('📝 Test data:', testData);

    // Test API bridge
    console.log('🌉 Testing API bridge at:', `${API_BASE_URL}?endpoint=posts`);
    
    const response = await fetch(`${API_BASE_URL}?endpoint=posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📡 API Bridge response status:', response.status);
    console.log('📡 API Bridge response ok:', response.ok);

    const responseText = await response.text();
    console.log('📄 API Bridge raw response:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ API Bridge parsed result:', result);
    } catch (e) {
      console.error('❌ Failed to parse API Bridge response as JSON');
      result = { error: 'Invalid JSON response', raw: responseText };
    }

    return NextResponse.json({
      success: true,
      debug: {
        apiUrl: `${API_BASE_URL}?endpoint=posts`,
        requestData: testData,
        response: {
          status: response.status,
          ok: response.ok,
          raw: responseText,
          parsed: result
        }
      }
    });

  } catch (error) {
    console.error('🚨 Debug create post error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      debug: {
        apiUrl: `${API_BASE_URL}?endpoint=posts`,
        errorDetails: error instanceof Error ? error.toString() : String(error)
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to debug create post functionality',
    usage: 'POST /api/debug/create-post'
  });
}
