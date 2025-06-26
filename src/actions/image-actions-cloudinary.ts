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
    
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }
    
    console.log('📁 File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'File type not allowed. Please upload a JPEG, PNG, GIF, or WEBP image.' };
    }
    
    // Check file size (limit to 10MB for Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'File is too large. Maximum size is 10MB.' };
    }
    
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    console.log('📤 Uploading to Cloudinary...');
    
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
    
    console.log('✅ Cloudinary upload successful:', result.secure_url);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
    
  } catch (error) {
    console.error('💥 Cloudinary upload error:', error);
    return {
      success: false,
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
 