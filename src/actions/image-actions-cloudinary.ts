'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    console.log('☁️ Starting Cloudinary upload...');
    console.log('☁️ Config - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('☁️ Config - API Key present:', !!process.env.CLOUDINARY_API_KEY);
    console.log('☁️ Config - API Secret present:', !!process.env.CLOUDINARY_API_SECRET);
    
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('❌ No file provided to Cloudinary');
      return { success: false, error: 'No file uploaded' };
    }
    
    console.log('📁 Cloudinary - File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Cloudinary - Invalid file type:', file.type);
      return { success: false, error: `File type ${file.type} not allowed. Please upload a JPEG, PNG, GIF, or WEBP image.` };
    }
    
    // Check file size (limit to 10MB for Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ Cloudinary - File too large:', file.size);
      return { success: false, error: 'File is too large. Maximum size is 10MB.' };
    }
    
    // Convert file to base64
    console.log('🔄 Converting file to base64...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    console.log('📤 Uploading to Cloudinary...', {
      dataURILength: dataURI.length,
      fileType: file.type
    });
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'bajramedia/blog',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },
        { quality: 'auto' },
        { format: 'webp' }
      ]
    });
    
    console.log('✅ Cloudinary upload successful:', {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    });
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
    
  } catch (error) {
    console.error('💥 Cloudinary upload error:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
      console.error('💥 Error stack:', error.stack);
    }
    
    // Return consistent error format
    return {
      success: false,
      error: `Cloudinary upload failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or use URL input option.`
    };
  }
}
 