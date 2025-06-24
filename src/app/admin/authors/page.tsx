"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import { deleteAuthor } from '@/actions/author-actions';

interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/api/admin/authors');
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        setAuthors(data);
      } catch (err) {
        console.error('Error fetching authors:', err);
        setError('Failed to load authors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleDelete = async (authorId: string) => {
    if (confirm('Are you sure you want to delete this author?')) {
      setIsDeleting(authorId);
      
      try {
        const result = await deleteAuthor(authorId);
        
        if (result.success) {
          setAuthors(authors.filter(author => author.id !== authorId));
        } else {
          alert(`Failed to delete: ${result.error}`);
        }
      } catch (err) {
        console.error('Error deleting author:', err);
        alert('An error occurred while deleting the author');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Authors</h1>
        <Link href="/admin/authors/new">
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
            <FiPlusCircle className="mr-2" /> New Author
          </button>
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">            {authors.length === 0 ? (<tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No authors found</td></tr>
            ) : (
              authors.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {author.avatar ? (
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">
                            {author.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{author.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {author.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">
                      {author.bio || 'No bio available'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link href={`/admin/authors/${author.id}/edit`}>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <FiEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(author.id)}
                      className={`text-red-600 hover:text-red-900 ${isDeleting === author.id ? 'opacity-50 cursor-wait' : ''}`}
                      disabled={isDeleting === author.id}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
