"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components';
import PostForm from '@/components/PostForm';

export default function EditPostPage() {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/posts/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`);
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Could not load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Memuat data...
            </p>
          </div>
          <Link href="/admin/posts">
            <Button variant="outline" size="md">
              <span className="mr-2">←</span>
              Kembali
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-400">Memuat data post...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Edit post: {post?.title}
          </p>
        </div>
        <Link href="/admin/posts">
          <Button variant="outline" size="md">
            <span className="mr-2">←</span>
            Kembali
          </Button>
        </Link>
      </div>

      {/* Error/Warning Message */}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm">
            {error}
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <PostForm postId={id} initialData={post} />
      </div>
    </div>
  );
}
