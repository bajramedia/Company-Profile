import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    console.log('🧪 Testing Cloudinary with minimal image...');
    
    // Test with a simple 1x1 pixel PNG (super small)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    console.log('🔧 Cloudinary Config Check:');
    console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('- API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('- API Secret present:', !!process.env.CLOUDINARY_API_SECRET);
    console.log('- API Secret length:', process.env.CLOUDINARY_API_SECRET?.length);
    
    console.log('☁️ Attempting Cloudinary upload...');
    
    const result = await cloudinary.uploader.upload(testImageBase64, {
      folder: 'bajramedia/test',
      resource_type: 'image',
      public_id: \	est_\\,
      overwrite: true
    });
    
    console.log('✅ Cloudinary test upload successful!');
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary test upload successful! ✅',
      result: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
        created_at: result.created_at
      }
    });
    
  } catch (error) {
    console.error('💥 Cloudinary test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      error_details: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
