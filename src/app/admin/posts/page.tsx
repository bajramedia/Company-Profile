"use client";

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { deletePost, togglePublishPost } from '@/actions/post-actions';
import { FiEdit, FiTrash2, FiEye, FiEyeOff, FiPlusCircle, FiSearch, FiImage } from 'react-icons/fi';
import { BlogPost } from '@/services/BlogService.api';

function AdminPostsContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize page from URL params
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    if (page) setCurrentPage(parseInt(page));
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Function to reload posts
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/posts?page=${currentPage}&limit=10${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  // Handle post deletion
  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(postId);
      const result = await deletePost(postId);
      if (result.success) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert(`Failed to delete: ${result.error}`);
      }
      setIsDeleting(null);
    }
  };

  // Handle toggling post publish status
  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    setIsUpdating(postId);
    const result = await togglePublishPost(postId);
    if (result.success) {
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, published: !currentStatus }
          : post
      ));
    } else {
      alert(`Failed to update: ${result.error}`);
    }
    setIsUpdating(null);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPosts();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
    router.push(`/admin/posts?page=${page}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  // Effect to reload posts when page changes
  useEffect(() => {
    loadPosts();
  }, [currentPage, loadPosts]);

  // Initial load
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (loading && posts.length === 0) {
    return (
      <div className="w-[95%] mx-auto px-4 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blog Posts</h1>
        <Link href="/admin/posts/new">
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center transition-colors">
            <FiPlusCircle className="mr-2" /> New Post
          </button>
        </Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <FiSearch />
          </button>
        </div>
      </form>

      {/* Posts table dengan kolom Image */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {loading ? 'Loading...' : 'No posts found'}
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{`/blog/${post.slug}`}</div>
                  </td>
                  {/* Kolom Image dengan thumbnail */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.featuredImage && post.featuredImage.trim() !== '' ? (
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.jpg';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                          <FiImage className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.published ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {typeof post.category === 'string' ? post.category : post.category?.name || 'No Category'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {typeof post.author === 'object' ? post.author.name : post.author || 'Unknown Author'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                        <FiEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(post.id, !!post.published)}
                      className={`${post.published ? 'text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300' : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'} ${isUpdating === post.id ? 'opacity-50 cursor-wait' : ''}`}
                      disabled={isUpdating === post.id}
                    >
                      {post.published ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className={`text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 ${isDeleting === post.id ? 'opacity-50 cursor-wait' : ''}`}
                      disabled={isDeleting === post.id}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                } relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-l-md`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={`${currentPage === index + 1
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                } relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-r-md`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default function AdminPosts() {
  return (
    <Suspense fallback={<div className="p-6">Loading posts...</div>}>
      <AdminPostsContent />
    </Suspense>
  );
}
