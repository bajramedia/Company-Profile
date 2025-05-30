"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AuthorForm from '@/components/AuthorForm';

export default function EditAuthorPage() {
  const { id } = useParams() as { id: string };
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`/api/admin/authors/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch author');
        }
        
        const data = await response.json();
        setAuthor(data);
      } catch (err) {
        console.error('Error fetching author:', err);
        setError('Could not load author. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuthor();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !author) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-6">
        <p>{error || 'Could not find author'}</p>
      </div>
    );
  }
  
  return <AuthorForm authorId={id} initialData={author} />;
}
