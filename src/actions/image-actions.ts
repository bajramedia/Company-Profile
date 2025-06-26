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
    console.log('🔄 Image upload started...');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('☁️ Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT_SET');
    console.log('🔑 Cloudinary API Key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT_SET');
    console.log('🔐 Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET');
    
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('❌ No file provided');
      return { success: false, error: 'No file uploaded' };
    }
    
    console.log('📁 File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return { success: false, error: `File type ${file.type} not allowed. Please upload a JPEG, PNG, GIF, or WEBP image.` };
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', file.size);
      return { success: false, error: 'File is too large. Maximum size is 10MB.' };
    }
    
    // Check if Cloudinary is configured
    const cloudinaryConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET
    );
    
    console.log('☁️ Cloudinary configured:', cloudinaryConfigured);
    
    // Try Cloudinary first if configured
    if (cloudinaryConfigured) {
      console.log('☁️ Attempting Cloudinary upload...');
      try {
        const result = await uploadImageToCloudinary(formData);
        console.log('☁️ Cloudinary result:', result);
        return result;
      } catch (cloudinaryError) {
        console.error('💥 Cloudinary upload failed:', cloudinaryError);
        return { 
          success: false, 
          error: `Cloudinary upload failed: ${cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown error'}` 
        };
      }
    }
    
    // Fallback to local upload for development
    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Development environment - attempting local upload...');
      
      try {
        // Create a unique filename
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.type.split('/')[1] || 'jpg';
        const filename = `${uuidv4()}.${ext}`;
        
        console.log('📝 Generated filename:', filename);
        
        // Define upload directory and path
        const uploadsDir = path.join(process.cwd(), 'public/uploads/blog');
        console.log('📂 Upload directory:', uploadsDir);
        
        // Ensure directory exists
        if (!fs.existsSync(uploadsDir)) {
          console.log('📁 Creating upload directory...');
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Create the complete file path
        const filepath = path.join(uploadsDir, filename);
        console.log('💾 Writing file to:', filepath);
        
        // Write the file
        await writeFile(filepath, buffer);
        console.log('✅ File written successfully');
        
        // Return the public URL
        const publicUrl = `/uploads/blog/${filename}`;
        console.log('🌐 Public URL:', publicUrl);
        
        return { 
          success: true, 
          url: publicUrl
        };
      } catch (fsError) {
        console.error('💥 Local upload failed:', fsError);
        return { 
          success: false, 
          error: `Local upload failed: ${fsError instanceof Error ? fsError.message : 'Unknown error'}` 
        };
      }
    }
    
    // For production or when local/Cloudinary upload fails
    console.log('🚧 No upload method available');
    return { 
      success: false, 
      error: 'Upload not available. Cloudinary not configured and not in development mode. Please use the URL input option.' 
    };
    
  } catch (error) {
    console.error('💥 Error uploading image:', error);
    return { 
      success: false, 
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please use the URL input option instead.` 
    };
  }
}
