"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthor, updateAuthor } from '@/actions/author-actions';
import { ImageUpload } from '@/components';
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

  const handleAvatarChange = (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }));
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Author' : 'Create New Author'}
        </h1>
        <button
          type="button"
          onClick={() => router.push('/admin/authors')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <FiX className="mr-2" /> Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                placeholder="Enter author name..."
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                placeholder="Enter email address..."
              />
            </div>

            {/* Avatar Upload */}
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Profile Picture
              </label>
              <div className="space-y-4">
                <ImageUpload
                  value={formData.avatar}
                  onChange={handleAvatarChange}
                  folder="authors"
                />
                {formData.avatar && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.avatar}
                        alt="Avatar preview"
                        className="object-cover w-full h-full"
                        onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Picture</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Image uploaded successfully</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tell us about this author..."
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/authors')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? 'opacity-75 cursor-wait' : 'hover:bg-primary/90'
                } bg-primary text-white px-6 py-3 rounded-md flex items-center transition-colors`}
            >
              <FiSave className="mr-2" />
              {loading ? 'Saving...' : (isEditing ? 'Update Author' : 'Save Author')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
