"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components';

// Portfolio data - akan dimuat dari database
// Saat ini kosong untuk testing
const portfolioItems = [];

export default function AdminPortfolioPage() {
    const [portfolios, setPortfolios] = useState(portfolioItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const categories = [
        { value: 'all', label: 'Semua Kategori' },
        { value: 'web-development', label: 'Web Development' },
        { value: 'aset-game-development', label: 'Aset Game Development' },
        { value: 'uiux-design', label: 'UI/UX Design' },
        { value: 'sistem-development', label: 'Sistem Development' },
        { value: 'sosial-media-management', label: 'Social Media Management' }
    ];

    const statusOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' }
    ];

    const filteredPortfolios = portfolios.filter(portfolio => {
        const matchesSearch = portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            portfolio.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || portfolio.category.name.toLowerCase().includes(selectedCategory);
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'published' && portfolio.published) ||
            (selectedStatus === 'draft' && !portfolio.published);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleTogglePublished = (id: string) => {
        setPortfolios(prev => prev.map(portfolio =>
            portfolio.id === id
                ? { ...portfolio, published: !portfolio.published }
                : portfolio
        ));
    };

    const handleToggleFeatured = (id: string) => {
        setPortfolios(prev => prev.map(portfolio =>
            portfolio.id === id
                ? { ...portfolio, featured: !portfolio.featured }
                : portfolio
        ));
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus portfolio ini?')) {
            setPortfolios(prev => prev.filter(portfolio => portfolio.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Portfolio Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kelola semua portfolio dan showcase project kamu
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link href="/admin/portfolio/new">
                        <Button variant="primary" size="lg">
                            <span className="mr-2">➕</span>
                            Tambah Portfolio
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <span className="text-blue-600 dark:text-blue-400 text-xl">📁</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolios.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {portfolios.filter(p => p.published).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <span className="text-yellow-600 dark:text-yellow-400 text-xl">⭐</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {portfolios.filter(p => p.featured).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <span className="text-purple-600 dark:text-purple-400 text-xl">👁️</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {portfolios.reduce((sum, p) => sum + p.views, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Cari portfolio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Kategori
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                        >
                            {statusOptions.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                                setSelectedStatus('all');
                            }}
                        >
                            Reset Filter
                        </Button>
                    </div>
                </div>
            </div>

            {/* Portfolio List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Portfolio Items ({filteredPortfolios.length})
                    </h3>
                </div>

                {filteredPortfolios.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📁</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Tidak ada portfolio ditemukan
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Coba ubah filter atau tambahkan portfolio baru
                        </p>
                        <Link href="/admin/portfolio/new">
                            <Button variant="primary">
                                Tambah Portfolio Pertama
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Project
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredPortfolios.map((portfolio) => (
                                    <tr key={portfolio.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <Image
                                                        src={portfolio.featuredImage}
                                                        alt={portfolio.title}
                                                        width={48}
                                                        height={48}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">{portfolio.category.icon}</span>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {portfolio.title}
                                                        </div>
                                                        {portfolio.featured && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                                                                ⭐ Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                        {portfolio.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {portfolio.clientName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${portfolio.published
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                                                }`}>
                                                {portfolio.published ? '✅ Published' : '📝 Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <div className="flex items-center space-x-1">
                                                <span>👁️</span>
                                                <span>{portfolio.views}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {portfolio.createdAt.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={`/admin/portfolio/${portfolio.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <button
                                                    onClick={() => handleTogglePublished(portfolio.id)}
                                                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${portfolio.published
                                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                                                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                                                        }`}
                                                >
                                                    {portfolio.published ? 'Unpublish' : 'Publish'}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleFeatured(portfolio.id)}
                                                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${portfolio.featured
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {portfolio.featured ? 'Unfeature' : 'Feature'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(portfolio.id)}
                                                    className="px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
} 