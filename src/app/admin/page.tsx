"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiEdit,
  FiFileText,
  FiUsers,
  FiTag,
  FiFolder,
  FiPlusCircle,
  FiEye,
  FiBriefcase
} from 'react-icons/fi';

interface DashboardStats {
  posts: number;
  authors: number;
  categories: number;
  tags: number;
  portfolio: number;
  partners: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    posts: 0,
    authors: 0,
    categories: 0,
    tags: 0,
    portfolio: 0,
    partners: 0
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const stats = await fetch('/api/admin/stats').then(res => res.json());
        const recentPosts = await fetch('/api/admin/posts?limit=5').then(res => res.json());

        setStats(stats);
        setRecentPosts(recentPosts.posts || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
              <FiFileText className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Blog Posts</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.posts}</p>
            </div>
          </div>
          <Link href="/admin/posts" className="block mt-4 text-sm text-blue-500 dark:text-blue-400 hover:underline">
            View all posts
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
              <FiUsers className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Authors</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.authors}</p>
            </div>
          </div>
          <Link href="/admin/authors" className="block mt-4 text-sm text-green-500 dark:text-green-400 hover:underline">
            Manage authors
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-4">
              <FiFolder className="h-8 w-8 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.categories}</p>
            </div>
          </div>
          <Link href="/admin/categories" className="block mt-4 text-sm text-amber-500 dark:text-amber-400 hover:underline">
            Manage categories
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-4">
              <FiTag className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.tags}</p>
            </div>
          </div>
          <Link href="/admin/tags" className="block mt-4 text-sm text-purple-500 dark:text-purple-400 hover:underline">
            Manage tags
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-4">
              <FiBriefcase className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.portfolio}</p>
            </div>
          </div>
          <Link href="/admin/portfolio" className="block mt-4 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
            Manage portfolio
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/30 mr-4">
              <FiUsers className="h-8 w-8 text-pink-500 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Partners</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.partners}</p>
            </div>
          </div>
          <Link href="/admin/partners" className="block mt-4 text-sm text-pink-500 dark:text-pink-400 hover:underline">
            Manage partners
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Link href="/admin/posts/new">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <FiPlusCircle className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium text-center text-gray-900 dark:text-white">New Post</span>
            </div>
          </Link>

          <Link href="/admin/authors/new">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <FiUsers className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium text-center text-gray-900 dark:text-white">New Author</span>
            </div>
          </Link>

          <Link href="/admin/categories/new">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <FiFolder className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium text-center text-gray-900 dark:text-white">New Category</span>
            </div>
          </Link>

          <Link href="/admin/tags/new">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <FiTag className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium text-center text-gray-900 dark:text-white">New Tag</span>
            </div>
          </Link>

          <Link href="/admin/portfolio/new">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <FiBriefcase className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium text-center text-gray-900 dark:text-white">New Portfolio</span>
            </div>
          </Link>

          <Link href="/admin/partners/new">
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <FiUsers className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium text-center text-gray-900 dark:text-white">New Partner</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h2>
          <Link href="/admin/posts" className="text-primary text-sm hover:underline">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {recentPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No posts found
                  </td>
                </tr>
              ) : (
                recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.author.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.date)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3">
                          <FiEdit />
                        </button>
                      </Link>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                          <FiEye />
                        </button>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}





