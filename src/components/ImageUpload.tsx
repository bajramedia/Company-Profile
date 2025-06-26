'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiLink, FiImage } from 'react-icons/fi';
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
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
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
        setShowUrlInput(false);
      } else {
        setError(result.error || 'Failed to upload image');
        setShowUrlInput(true);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('An error occurred while uploading the image');
      setShowUrlInput(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    setShowUrlInput(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
      setError(null);
    }
  };

  const suggestedImages = [
    '/images/team-meeting.jpg',
    '/images/team-meeting-2.jpg',
    '/images/team-meeting-alt.jpg',
    '/images/team.jpg'
  ];

  const handleSuggestedImage = (imageUrl: string) => {
    onChange(imageUrl);
    setShowUrlInput(false);
    setError(null);
  };

  return (
    <div className={className}>
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}

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
        <div className="space-y-4">
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

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1"
            >
              <FiLink size={14} />
              <span>Or paste image URL</span>
            </button>
          </div>

          {showUrlInput && (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use URL
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-2">Or choose from available images:</p>
                <div className="grid grid-cols-4 gap-2">
                  {suggestedImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestedImage(imageUrl)}
                      className="relative aspect-video overflow-hidden rounded border-2 border-transparent hover:border-blue-500 transition-colors"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Suggested image ${index + 1}`}
                        fill
                        sizes="100px"
                        style={{ objectFit: 'cover' }}
                        className="rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
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
        <div className="mt-2 p-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <FiImage className="mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="font-medium">Upload not available</p>
              <p className="text-xs mt-1">{error}</p>
              <p className="text-xs mt-1">Please use the "paste image URL" option above or select from available images.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
