'use server';

import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';

export async function uploadImage(formData: FormData) {
  try {
    console.log('🔄 Image upload started...');
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return { success: false, error: 'File type not allowed. Please upload a JPEG, PNG, GIF, or WEBP image.' };
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('❌ File too large:', file.size);
      return { success: false, error: 'File is too large. Maximum size is 5MB.' };
    }
    
    // Create a unique filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.split('/')[1];
    const filename = `${uuidv4()}.${ext}`;
    
    console.log('📝 Generated filename:', filename);
    
    // Define upload directory and path
    const uploadsDir = path.join(process.cwd(), 'public/uploads/blog');
    console.log('📂 Upload directory:', uploadsDir);
    
    try {
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
      console.error('💥 Filesystem error:', fsError);
      
      // If we're in production (Vercel), filesystem writes will fail
      // For now, return a placeholder or suggest using external storage
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        console.log('🚧 Production environment detected - filesystem is read-only');
        return { 
          success: false, 
          error: 'Image upload not available in production. Please use an existing image URL or contact administrator.' 
        };
      }
      
      throw fsError;
    }
  } catch (error) {
    console.error('💥 Error uploading image:', error);
    return { 
      success: false, 
      error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}
