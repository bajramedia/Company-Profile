'use client';

import { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
            className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100 transition-colors"
            title="Remove image"
          >
            <FiX className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center justify-center">
              <FiUpload className="mb-3 h-10 w-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF or WEBP (Max 5MB)</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}

      {isUploading && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading image...
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
