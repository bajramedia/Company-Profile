import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    console.log('🧪 Testing Cloudinary configuration...');
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    console.log('🔧 Config values:');
    console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('- API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('- API Secret (first 5 chars):', process.env.CLOUDINARY_API_SECRET?.substring(0, 5));
    console.log('- API Secret length:', process.env.CLOUDINARY_API_SECRET?.length);
    
    // Test Cloudinary connection with search (no upload)
    console.log('🔍 Testing Cloudinary connection with search...');
    
    const searchResult = await cloudinary.search
      .expression('folder:bajramedia')
      .max_results(1)
      .execute();
      
    console.log('✅ Cloudinary connection test successful!');
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful! ✅',
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key_present: !!process.env.CLOUDINARY_API_KEY,
        api_secret_present: !!process.env.CLOUDINARY_API_SECRET,
        api_secret_length: process.env.CLOUDINARY_API_SECRET?.length,
        api_secret_first5: process.env.CLOUDINARY_API_SECRET?.substring(0, 5)
      },
      search_result: {
        total_count: searchResult.total_count,
        found_resources: searchResult.resources?.length || 0
      }
    });
    
  } catch (error) {
    console.error('💥 Cloudinary connection error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      error_type: error instanceof Error ? error.constructor.name : 'Unknown',
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key_present: !!process.env.CLOUDINARY_API_KEY,
        api_secret_present: !!process.env.CLOUDINARY_API_SECRET,
        api_secret_length: process.env.CLOUDINARY_API_SECRET?.length,
        api_secret_first5: process.env.CLOUDINARY_API_SECRET?.substring(0, 5)
      }
    }, { status: 500 });
  }
}
