import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const debug = {
      cloudinaryConfigured: !!(
        process.env.CLOUDINARY_CLOUD_NAME && 
        process.env.CLOUDINARY_API_KEY && 
        process.env.CLOUDINARY_API_SECRET
      ),
      environment: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      cloudNameValue: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT_SET',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      status: 'success',
      debug
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 