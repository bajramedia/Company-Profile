"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

interface PortfolioData {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    featuredImage: string;
    images: string[];
    clientName: string;
    projectUrl: string;
    githubUrl: string;
    featured: boolean;
    published: boolean;
    startDate: string;
    endDate: string;
    categoryId: string;
    tagIds: string[];
}

export default function EditPortfolioPage() {
    const router = useRouter();
    const params = useParams();
    const portfolioId = params?.id as string;

    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [categories, setCategories] = useState<PortfolioCategory[]>([]);
    const [tags, setTags] = useState<PortfolioTag[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoadingData(true);
                setError('');

                // Fetch portfolio data, categories, dan tags secara bersamaan
                const [portfolioResponse, categoriesResponse, tagsResponse] = await Promise.all([
                    fetch(`/api/admin/portfolio/${portfolioId}`),
                    fetch('/api/portfolio/categories'),
                    fetch('/api/portfolio/tags')
                ]);

                // Check responses
                if (!portfolioResponse.ok) {
                    throw new Error(`Failed to fetch portfolio: ${portfolioResponse.status}`);
                }
                if (!categoriesResponse.ok) {
                    throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
                }
                if (!tagsResponse.ok) {
                    throw new Error(`Failed to fetch tags: ${tagsResponse.status}`);
                }

                const [portfolioResult, categoriesData, tagsData] = await Promise.all([
                    portfolioResponse.json(),
                    categoriesResponse.json(),
                    tagsResponse.json()
                ]);

                // Process portfolio data
                if (portfolioResult.portfolio) {
                    const portfolio = portfolioResult.portfolio;
                    setPortfolioData({
                        id: portfolio.id,
                        title: portfolio.title || '',
                        slug: portfolio.slug || '',
                        description: portfolio.description || '',
                        content: portfolio.content || '',
                        featuredImage: portfolio.featuredImage || '',
                        images: portfolio.images || [],
                        clientName: portfolio.clientName || '',
                        projectUrl: portfolio.projectUrl || '',
                        githubUrl: portfolio.githubUrl || '',
                        featured: portfolio.featured || false,
                        published: portfolio.published || false,
                        startDate: portfolio.startDate ? portfolio.startDate.split('T')[0] : '',
                        endDate: portfolio.endDate ? portfolio.endDate.split('T')[0] : '',
                        categoryId: portfolio.categoryId || portfolio.category?.id || '',
                        tagIds: portfolio.tags?.map((tag: any) => tag.id) || []
                    });
                } else {
                    throw new Error('Portfolio not found');
                }

                setCategories(categoriesData);
                setTags(tagsData);

            } catch (error) {
                console.error('❌ Error loading data:', error);
                setError(error instanceof Error ? error.message : 'Failed to load data');
            } finally {
                setIsLoadingData(false);
            }
        };

        if (portfolioId) {
            loadData();
        }
    }, [portfolioId]);

    const handleSubmit = async (updatedData: any) => {
        setIsSubmitting(true);
        setError('');

        try {
            console.log('📝 Updating portfolio:', { id: portfolioId, ...updatedData });

            const response = await fetch(`/api/admin/portfolio/${portfolioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update portfolio');
            }

            console.log('✅ Portfolio updated successfully:', result);
            router.push('/admin/portfolio');
        } catch (error) {
            console.error('❌ Error updating portfolio:', error);
            setError(error instanceof Error ? error.message : 'Failed to update portfolio');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/portfolio');
    };

    // Loading state
    if (isLoadingData) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Portfolio
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
                            <span className="text-gray-600 dark:text-gray-400">Memuat data portfolio...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !portfolioData) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Edit Portfolio
                        </h1>
                    </div>
                    <Link href="/admin/portfolio">
                        <Button variant="outline" size="md">
                            <span className="mr-2">←</span>
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <div className="text-center">
                        <p className="text-red-600 dark:text-red-400 text-lg mb-4">
                            ❌ {error}
                        </p>
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => window.location.reload()}
                        >
                            🔄 Coba Lagi
                        </Button>
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
                        Edit Portfolio
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Edit portfolio: {portfolioData?.title}
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

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <PortfolioForm
                    initialData={portfolioData || undefined}
                    categories={categories}
                    tags={tags}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                    isEditing={true}
                />
            </div>
        </div>
    );
}