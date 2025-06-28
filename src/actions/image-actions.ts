'use server';

import { uploadImageToCloudinary } from './image-actions-cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';

export async function uploadImage(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: `File type ${file.type} not allowed. Please upload a JPEG, PNG, GIF, or WEBP image.` };
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'File is too large. Maximum size is 10MB.' };
    }
    
    // Validate environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary configuration missing. Please check environment variables.');
      throw new Error('Cloudinary configuration missing');
    }
    
    // Check if Cloudinary is configured
    const cloudinaryConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET
    );
    
    // Try Cloudinary first if configured
    if (cloudinaryConfigured) {
      try {
        const result = await uploadImageToCloudinary(formData);
        return result;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed');
        return { 
          success: false, 
          error: `Cloudinary upload failed: ${cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown error'}` 
        };
      }
    }
    
    // Fallback to local upload for development
    if (process.env.NODE_ENV === 'development') {
      try {
        // Create a unique filename
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.type.split('/')[1] || 'jpg';
        const filename = `${uuidv4()}.${ext}`;
        
        // Define upload directory and path
        const uploadsDir = path.join(process.cwd(), 'public/uploads/blog');
        
        // Ensure directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Create the complete file path
        const filepath = path.join(uploadsDir, filename);
        
        // Write the file
        await writeFile(filepath, buffer);
        
        // Return the public URL
        const publicUrl = `/uploads/blog/${filename}`;
        
        return { 
          success: true, 
          url: publicUrl
        };
      } catch (fsError) {
        console.error('Local upload failed');
        return { 
          success: false, 
          error: `Local upload failed: ${fsError instanceof Error ? fsError.message : 'Unknown error'}` 
        };
      }
    }
    
    // For production or when local/Cloudinary upload fails
    return { 
      success: false, 
      error: 'Upload not available. Cloudinary not configured and not in development mode. Please use the URL input option.' 
    };
    
  } catch (error) {
    console.error('Error uploading image');
    return { 
      success: false, 
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please use the URL input option instead.` 
    };
  }
}
