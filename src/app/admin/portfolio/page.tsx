"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Heading } from '@/components';
import { logger } from '@/utils/logger';
import { Star, Eye } from 'lucide-react';

// Interface untuk portfolio item
interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    clientName: string;
    featuredImage: string;
    published: boolean;
    featured: boolean;
    views: number;
    createdAt: Date;
    category: {
        name: string;
        icon: string;
    };
}

export default function AdminPortfolioPage() {
    const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Fetch portfolio data dan categories dari API
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch portfolio dan categories secara parallel
            const [portfolioResponse, categoriesResponse] = await Promise.all([
                fetch('/api/admin/portfolio'),
                fetch('/api/portfolio/categories')
            ]);

            if (!portfolioResponse.ok) {
                throw new Error(`Portfolio API error! status: ${portfolioResponse.status}`);
            }

            if (!categoriesResponse.ok) {
                logger.warn('Categories API failed, using fallback categories');
            }

            const portfolioData = await portfolioResponse.json();
            const categoriesData = categoriesResponse.ok ? await categoriesResponse.json() : [];

            logger.info('📊 Portfolio Data:', portfolioData);
            logger.info('📊 Categories Data:', categoriesData);

            // Transform portfolio data untuk match interface
            const transformedPortfolios = portfolioData.portfolio.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                clientName: item.clientName || item.client || '',
                featuredImage: item.featuredImage || '/images/placeholder.jpg',
                published: item.published === true || item.published === 1 || item.published === "1",
                featured: item.featured === true || item.featured === 1 || item.featured === "1",
                views: parseInt(item.views) || 0,
                createdAt: new Date(item.createdAt || item.date),
                category: {
                    name: item.category?.name || 'Uncategorized',
                    icon: item.category?.icon || '📁'
                }
            }));

            // Transform categories data
            const transformedCategories = [
                { value: 'all', label: 'Semua Kategori' },
                ...categoriesData.map((cat: any) => ({
                    value: cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'uncategorized',
                    label: cat.name || 'Unknown Category'
                }))
            ];

            // No fallback categories - use only what's available from API

            setPortfolios(transformedPortfolios);
            setCategories(transformedCategories);

            logger.info('✅ Portfolio loaded:', transformedPortfolios.length, 'items');
            logger.info('✅ Categories loaded:', transformedCategories.length, 'categories');

        } catch (error) {
            logger.error('❌ Error fetching data:', error);
            setError('Gagal memuat data portfolio. Silakan refresh halaman.');
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' }
    ];

    const filteredPortfolios = portfolios.filter(portfolio => {
        const matchesSearch = portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            portfolio.clientName.toLowerCase().includes(searchTerm.toLowerCase());

        // Fix category matching logic
        const matchesCategory = selectedCategory === 'all' ||
            portfolio.category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedCategory ||
            portfolio.category.name.toLowerCase().includes(selectedCategory.replace(/-/g, ' ')) ||
            portfolio.category.name.toLowerCase().includes(selectedCategory.replace(/-/g, ''));

        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'published' && portfolio.published) ||
            (selectedStatus === 'draft' && !portfolio.published);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleTogglePublished = async (id: string) => {
        const portfolio = portfolios.find(p => p.id === id);
        if (!portfolio) return;

        try {
            const response = await fetch(`/api/admin/portfolio/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...portfolio,
                    published: !portfolio.published
                })
            });

            if (response.ok) {
                setPortfolios(prev => prev.map(p =>
                    p.id === id ? { ...p, published: !p.published } : p
                ));
            }
        } catch (error) {
            console.error('Error updating portfolio:', error);
        }
    };

    const handleToggleFeatured = async (id: string) => {
        const portfolio = portfolios.find(p => p.id === id);
        if (!portfolio) return;

        try {
            const response = await fetch(`/api/admin/portfolio/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...portfolio,
                    featured: !portfolio.featured
                })
            });

            if (response.ok) {
                setPortfolios(prev => prev.map(p =>
                    p.id === id ? { ...p, featured: !p.featured } : p
                ));
            }
        } catch (error) {
            console.error('Error updating portfolio:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus portfolio ini?')) return;

        try {
            const response = await fetch(`/api/admin/portfolio/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPortfolios(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting portfolio:', error);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                            <div className="h-16 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Error Loading Portfolio
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error}
                    </p>
                    <Button
                        variant="primary"
                        onClick={fetchData}
                    >
                        Coba Lagi
                    </Button>
                </div>
            </div>
        );
    }

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
                                                            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                                                <Star size={12} className="mr-1" /> Featured
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
                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                                <Eye size={16} />
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
