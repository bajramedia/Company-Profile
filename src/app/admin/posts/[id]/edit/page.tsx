"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/PostForm';

export default function EditPostPage() {
  const { id } = useParams() as { id: string };
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Could not load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-6">
        <p>{error || 'Could not find post'}</p>
      </div>
    );
  }
  
  return <PostForm postId={id} initialData={post} />;
}
