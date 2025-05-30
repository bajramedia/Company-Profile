'use server';

import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import * as fs from 'fs';

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'File type not allowed. Please upload a JPEG, PNG, GIF, or WEBP image.' };
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File is too large. Maximum size is 5MB.' };
    }
    
    // Create a unique filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.split('/')[1];
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
    return { 
      success: true, 
      url: `/uploads/blog/${filename}`
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}
