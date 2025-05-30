'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiUpload, FiX } from 'react-icons/fi';
import { uploadImage } from '@/actions/image-actions';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label = 'Featured Image',
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadImage(formData);
      
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError(result.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('An error occurred while uploading the image');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemove = () => {
    onChange('');
  };
  
  return (
    <div className={className}>
      {label && <label className="block mb-2 text-sm font-medium">{label}</label>}
      
      {value ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-300">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
            title="Remove image"
          >
            <FiX className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center">
            <FiUpload className="mb-3 h-10 w-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF or WEBP (Max 5MB)</p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleUpload}
            className="absolute h-full w-full cursor-pointer opacity-0"
            disabled={isUploading}
          />
        </div>
      )}
      
      {isUploading && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Uploading...
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
