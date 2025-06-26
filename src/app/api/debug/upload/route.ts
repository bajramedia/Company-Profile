import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Debug upload endpoint called');
    
    // Test with a simple base64 image (1x1 pixel PNG)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    console.log('☁️ Testing Cloudinary upload with test image...');
    
    const result = await cloudinary.uploader.upload(testImageBase64, {
      folder: 'bajramedia/debug',
      resource_type: 'image',
      transformation: [
        { width: 100, height: 100, crop: 'limit' }
      ]
    });
    
    console.log('✅ Cloudinary test upload successful:', result.secure_url);
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary upload test successful',
      debug: {
        cloudinary_configured: !!(
          process.env.CLOUDINARY_CLOUD_NAME && 
          process.env.CLOUDINARY_API_KEY && 
          process.env.CLOUDINARY_API_SECRET
        ),
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        test_result: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        }
      }
    });
    
  } catch (error) {
    console.error('💥 Debug upload error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        cloudinary_configured: !!(
          process.env.CLOUDINARY_CLOUD_NAME && 
          process.env.CLOUDINARY_API_KEY && 
          process.env.CLOUDINARY_API_SECRET
        ),
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'NOT_SET',
        error_details: error
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug upload endpoint. Use POST method to test upload.',
    usage: 'POST request to test Cloudinary upload functionality'
  });
} 