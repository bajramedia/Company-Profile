"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthor, updateAuthor } from '@/actions/author-actions';
import { FiSave, FiX } from 'react-icons/fi';

interface AuthorFormProps {
  authorId?: string;
  initialData?: {
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
}

export default function AuthorForm({ authorId, initialData }: AuthorFormProps) {
  const router = useRouter();
  const isEditing = !!authorId;
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    avatar: initialData?.avatar || '',
    bio: initialData?.bio || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = isEditing 
        ? await updateAuthor(authorId!, formData)
        : await createAuthor(formData);
      
      if (result.success) {
        router.push('/admin/authors');
      } else {
        setError(result.error || 'Failed to save author');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Author' : 'Create New Author'}
        </h1>
        <button
          type="button"
          onClick={() => router.push('/admin/authors')}
          className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiX className="mr-2" /> Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          {/* Avatar URL */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formData.avatar && (
              <div className="mt-2 flex">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={formData.avatar} 
                    alt="Avatar preview" 
                    className="object-cover w-full h-full"
                    onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Bio */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? 'opacity-75 cursor-wait' : ''
            } bg-primary text-white px-6 py-3 rounded-md flex items-center`}
          >
            <FiSave className="mr-2" />
            {loading ? 'Saving...' : 'Save Author'}
          </button>
        </div>
      </form>
    </div>
  );
}
