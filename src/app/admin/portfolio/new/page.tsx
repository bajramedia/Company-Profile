"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components';
import { PortfolioForm } from '@/components';

interface PortfolioCategory {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    color?: string;
}

interface PortfolioTag {
    id: string;
    name: string;
    slug: string;
    color?: string;
}

export default function NewPortfolioPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<PortfolioCategory[]>([]);
    const [tags, setTags] = useState<PortfolioTag[]>([]);

    // Fetch categories dan technologies dari database
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch categories dan technologies secara bersamaan
                const [categoriesResponse, technologiesResponse] = await Promise.all([
                    fetch('/api/portfolio/categories'),
                    fetch('/api/admin/technologies')
                ]);

                if (!categoriesResponse.ok || !technologiesResponse.ok) {
                    throw new Error('Failed to fetch categories or technologies');
                }

                const categoriesData = await categoriesResponse.json();
                const technologiesData = await technologiesResponse.json();

                // Transform technologies data to match tag interface
                const transformedTechnologies = Array.isArray(technologiesData) ? technologiesData.map((tech: any) => ({
                    id: tech.id,
                    name: tech.name,
                    slug: tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    color: tech.color || '#6B7280'
                })) : [];

                setCategories(categoriesData);
                setTags(transformedTechnologies);
            } catch (error) {
                console.error('❌ Error fetching data:', error);
                setError('Gagal memuat data kategori dan technologies. Silakan refresh halaman.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (portfolioData: any) => {
        setIsSubmitting(true);
        setError('');

        try {
            console.log('📝 Sending portfolio data:', portfolioData);

            // Real API call ke admin portfolio endpoint
            const response = await fetch('/api/admin/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(portfolioData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create portfolio');
            }

            console.log('✅ Portfolio created successfully:', result);

            // Redirect ke halaman admin portfolio setelah berhasil
            router.push('/admin/portfolio');
        } catch (error) {
            console.error('❌ Error saving portfolio:', error);
            setError(error instanceof Error ? error.message : 'Failed to save portfolio');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/portfolio');
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Tambah Portfolio Baru
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Memuat data...
                        </p>
                    </div>
                    <Link href="/admin/portfolio">
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
                            <span className="text-gray-600 dark:text-gray-400">Memuat data kategori dan technologies...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Tambah Portfolio Baru
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Buat portfolio baru untuk menampilkan project Anda
                    </p>
                </div>
                <Link href="/admin/portfolio">
                    <Button variant="outline" size="md">
                        <span className="mr-2">←</span>
                        Kembali
                    </Button>
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                        ❌ {error}
                    </p>
                </div>
            )}

            {/* Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <PortfolioForm
                    categories={categories}
                    tags={tags}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                    isEditing={false}
                />
            </div>
        </div>
    );
}