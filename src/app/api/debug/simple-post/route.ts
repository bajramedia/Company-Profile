import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bajramedia.com/api_bridge.php';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Simple Post Test API called');
    
    const body = await request.json();
    console.log('📝 Received data:', body);
    
    // Validate required fields
    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, excerpt, content'
      }, { status: 400 });
    }
    
    // Simple test data
    const testData = {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
      excerpt: body.excerpt,
      content: body.content,
      featuredImage: body.featuredImage || "",
      published: false, // Always save as draft for testing
      readTime: 3,
      authorId: "cmbf4aq8s0000tsa4kiz9m58q", // Valid author ID
      categoryId: "cmbf4aq900001tsa4kx7e1sgo", // Valid category ID
      tags: []
    };

    console.log('🔄 Sending to API bridge:', testData);

    // Test API bridge
    const response = await fetch(`${API_BASE_URL}?endpoint=posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📡 Response status:', response.status);
    
    const responseText = await response.text();
    console.log('📄 Response text:', responseText);

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `API Bridge error: ${response.status}`,
        details: responseText
      }, { status: 500 });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response from API bridge',
        raw: responseText
      }, { status: 500 });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Post created successfully via simple API!',
        id: result.id,
        data: testData
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'API bridge returned error',
        apiResponse: result
      }, { status: 500 });
    }

  } catch (error) {
    console.error('🚨 Simple post test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.toString() : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Simple Post Test API',
    usage: 'POST with { title, excerpt, content }'
  });
} 