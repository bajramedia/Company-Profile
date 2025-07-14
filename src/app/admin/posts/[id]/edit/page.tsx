"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components';
import PostForm from '@/components/PostForm';

export default function EditPostPage() {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching post with ID:', id);

      const response = await fetch(`/api/admin/posts/${id}`);

      console.log('📊 API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 API Response data:', data);

      // Handle different response formats
      if (data.success && data.post) {
        // New format with success wrapper
        setPost(data.post);
        console.log('✅ Post data loaded (new format):', data.post);
      } else if (data && data.id) {
        // Direct post data
        setPost(data);
        console.log('✅ Post data loaded (direct format):', data);
      } else if (data === null) {
        // Explicitly null response
        throw new Error('Post not found');
      } else {
        console.warn('⚠️ Unexpected response format:', data);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Error fetching post:', err);
      setError(err instanceof Error ? err.message : 'Could not load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, fetchPost]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Post</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
            <Link href="/admin/posts">
              <Button variant="outline">
                Back to Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Post Not Found</h3>
          <p className="text-yellow-600 mb-4">The post you're looking for doesn't exist or has been deleted.</p>
          <Link href="/admin/posts">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600 mt-2">Edit post: {post.title}</p>
          </div>
          <Link href="/admin/posts">
            <Button variant="outline">
              ← Back to Posts
            </Button>
          </Link>
        </div>

        <PostForm postId={id} initialData={post} />
        <p className="text-sm text-gray-500">
          Don&apos;t forget to save your changes before leaving this page.
        </p>
      </div>
    </div>
  );
}
