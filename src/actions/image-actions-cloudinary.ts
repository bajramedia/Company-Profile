'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary - Must be done before any operations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Force HTTPS URLs
});

export async function uploadImageToCloudinary(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    console.log('☁️ Starting Cloudinary upload...');
    
    // Validate Cloudinary configuration first
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary credentials missing!');
      return { 
        success: false, 
        error: 'Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.' 
      };
    }
    
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
    
    // Check file type - be more specific about allowed types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Cloudinary - Invalid file type:', file.type);
      return { 
        success: false, 
        error: `File type ${file.type} not allowed. Please upload JPEG, PNG, GIF, or WEBP images only.` 
      };
    }
    
    // Check file size (Cloudinary free tier limit is 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ Cloudinary - File too large:', file.size);
      return { 
        success: false, 
        error: `File is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size is 10MB.` 
      };
    }
    
    // Convert file to base64
    console.log('🔄 Converting file to base64...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    console.log('📤 Uploading to Cloudinary...', {
      dataURILength: dataURI.length,
      fileType: file.type,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
    
    // Upload to Cloudinary with proper options
    const uploadOptions = {
      folder: 'bajramedia/blog', // Organize uploads in folders
      resource_type: 'image' as const,
      transformation: [
        { width: 1200, height: 630, crop: 'limit' }, // Limit size but maintain aspect ratio
        { quality: 'auto' }, // Auto quality optimization
        { format: 'webp' } // Convert to WebP for better compression
      ],
      public_id: `blog_${Date.now()}_${Math.random().toString(36).substring(2)}`, // Unique public ID
      overwrite: false, // Don't overwrite existing files
      invalidate: true, // Invalidate CDN cache
      use_filename: false, // Don't use original filename
      unique_filename: true // Generate unique filename
    };
    
    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
    
    console.log('✅ Cloudinary upload successful:', {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    });
    
    return {
      success: true,
      url: result.secure_url, // Always use secure HTTPS URL
      publicId: result.public_id
    };
    
  } catch (error) {
    console.error('💥 Cloudinary upload error:', error);
    
    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
      console.error('💥 Error stack:', error.stack);
    }
    
    // Parse Cloudinary-specific errors
    let errorMessage = 'Unknown error occurred during upload';
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid API Key')) {
        errorMessage = 'Invalid Cloudinary API key. Please check your CLOUDINARY_API_KEY environment variable.';
      } else if (error.message.includes('Invalid API Secret')) {
        errorMessage = 'Invalid Cloudinary API secret. Please check your CLOUDINARY_API_SECRET environment variable.';
      } else if (error.message.includes('Invalid cloud name')) {
        errorMessage = 'Invalid Cloudinary cloud name. Please check your CLOUDINARY_CLOUD_NAME environment variable.';
      } else if (error.message.includes('File size too large')) {
        errorMessage = 'File is too large for Cloudinary upload. Please compress your image or use a smaller file.';
      } else if (error.message.includes('Unsupported file format')) {
        errorMessage = 'Unsupported file format. Please upload JPEG, PNG, GIF, or WEBP images only.';
      } else {
        errorMessage = `Cloudinary upload failed: ${error.message}`;
      }
    }
    
    // Return consistent error format
    return {
      success: false,
      error: `${errorMessage} Please try again or use the URL input option.`
    };
  }
}
 