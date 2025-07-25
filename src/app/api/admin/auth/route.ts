import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Get admin credentials from environment variables (server-side only)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin.bajra@bajramedia.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '@bajra#admin';

    // Validate credentials - ONLY new credentials accepted
    if (username === adminEmail && password === adminPassword) {
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Authentication successful'
      });
    } else {
      // Return error response
      return NextResponse.json({
        success: false,
        message: 'Invalid username or password. Please use the new admin credentials.'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Authentication error'
    }, { status: 500 });
  }
} 
