"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Logo, LanguageSwitcher } from '@/components';
import { useLanguage } from '@/context/LanguageContext';
import { useViewTracker } from '@/hooks/useViewTracker';
import { Star, Check, Zap, Frown, Rocket, Sun, Moon, Calendar, Eye } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface PortfolioItem {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    featuredImage: string;
    images?: string[];
    clientName?: string;
    client?: string;
    projectUrl?: string;
    githubUrl?: string;
    category: {
        name: string;
        slug: string;
        icon?: string;
        color?: string;
    };
    tags: Array<{ id?: string; name: string; color?: string; slug?: string }>;
    technologies?: Array<{ id?: string; name: string; color?: string; slug?: string }>;
    featured: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    viewCount?: number;
    views?: number;
    projectStatus?: string;
    projectType?: string;
    teamSize?: number;
    duration?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    impact?: string;
}

interface PortfolioDetailClientProps {
    slug: string;
}

export default function PortfolioDetailClient({ slug }: PortfolioDetailClientProps) {
    const { t } = useLanguage();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null);
    const [relatedProjects, setRelatedProjects] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch portfolio item dari database
    useEffect(() => {
        const fetchPortfolioItem = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('🔄 Fetching portfolio item untuk slug:', slug);

                const response = await fetch(`/api/portfolio/${slug}`);
                console.log('📡 Portfolio API response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Portfolio API error:', response.status, errorText);
                    throw new Error(`Portfolio item not found (${response.status})`);
                }

                const data = await response.json();
                console.log('📄 Portfolio data received:', data);

                if (!data || !data.id) {
                    throw new Error('Portfolio data is invalid or empty');
                }

                // Calculate duration if not provided but startDate and endDate exist
                let calculatedDuration = data.duration;
                if (!calculatedDuration && data.startDate && data.endDate) {
                    try {
                        const start = new Date(data.startDate);
                        const end = new Date(data.endDate);
                        const diffTime = Math.abs(end.getTime() - start.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        calculatedDuration = `${diffDays} days`;
                    } catch (error) {
                        console.warn('Failed to calculate duration from dates:', error);
                    }
                }

                // Format data untuk komponen
                const formattedItem: PortfolioItem = {
                    id: data.id,
                    slug: data.slug,
                    title: data.title || 'Untitled Project',
                    description: data.description || 'No description available',
                    content: data.content || '',
                    featuredImage: data.featuredImage || data.featured_image || '/images/placeholder.jpg',
                    images: Array.isArray(data.images) ? data.images : (data.images ? JSON.parse(data.images) : []),
                    clientName: data.client || data.clientName || data.client_name,
                    client: data.client || data.clientName,
                    projectUrl: data.projectUrl || data.project_url,
                    githubUrl: data.githubUrl || data.github_url,
                    category: {
                        name: data.categoryName || data.category?.name || 'Uncategorized',
                        slug: data.categorySlug || data.category?.slug || 'uncategorized',
                        icon: data.categoryIcon || data.category?.icon || '🌐',
                        color: data.categoryColor || data.category?.color || '#3B82F6'
                    },
                    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? JSON.parse(data.tags) : []),
                    technologies: Array.isArray(data.technologies) ? data.technologies : (data.technologies ? JSON.parse(data.technologies) : []),
                    featured: data.featured === true || data.featured === 1 || data.featured === "1",
                    startDate: data.startDate || data.start_date,
                    endDate: data.endDate || data.end_date,
                    createdAt: data.createdAt || data.created_at || data.date || new Date().toISOString(),
                    viewCount: data.viewCount || data.view_count || data.views || 0,
                    views: data.views || data.viewCount || data.view_count || 0,
                    projectStatus: data.projectStatus || data.project_status || 'Completed',
                    projectType: data.projectType || data.project_type,
                    teamSize: data.teamSize || data.team_size,
                    duration: calculatedDuration
                };

                console.log('✅ Portfolio item berhasil diformat:', formattedItem);
                setPortfolioItem(formattedItem);

                // Fetch related projects after getting current item
                fetchRelatedProjects(formattedItem.category.slug, formattedItem.id);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load portfolio item';
                console.error('💥 Error loading portfolio:', errorMessage, err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioItem();
    }, [slug]);

    const fetchRelatedProjects = async (categorySlug: string, currentId: string) => {
        try {
            setRelatedLoading(true);
            const response = await fetch('/api/portfolio?published=true');
            
            if (response.ok) {
                const data = await response.json();
                const allProjects = data.portfolios || data || [];
                
                const otherProjects = allProjects.filter((project: any) =>
                    project.id !== currentId && project.id != currentId
                );

                let relatedByCategory = otherProjects.filter((project: any) => {
                    const projectCategory = project.categorySlug || project.category?.slug || project.categoryName?.toLowerCase().replace(/\s+/g, '-');
                    return projectCategory === categorySlug;
                });

                if (relatedByCategory.length === 0) {
                    relatedByCategory = otherProjects
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3);
                } else if (relatedByCategory.length < 3) {
                    const additionalProjects = otherProjects
                        .filter((project: any) => !relatedByCategory.some((related: any) => related.id === project.id))
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3 - relatedByCategory.length);

                    relatedByCategory = [...relatedByCategory, ...additionalProjects];
                }

                setRelatedProjects(relatedByCategory.slice(0, 3));
            }
        } catch (error) {
            console.error('Error fetching related projects:', error);
        } finally {
            setRelatedLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {error}
                        </h2>
                        <Link href="/portfolio">
                            <Button>
                                Back to Portfolio
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!portfolioItem) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Portfolio content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {portfolioItem.title}
                        </h1>
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-8" 
                            dangerouslySetInnerHTML={{ __html: portfolioItem.content }} 
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Project Details
                            </h3>
                            <dl className="space-y-4">
                                {portfolioItem.client && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</dt>
                                        <dd className="text-base text-gray-900 dark:text-white">{portfolioItem.client}</dd>
                                    </div>
                                )}
                                {portfolioItem.duration && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</dt>
                                        <dd className="text-base text-gray-900 dark:text-white">{portfolioItem.duration}</dd>
                                    </div>
                                )}
                                {portfolioItem.projectType && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Type</dt>
                                        <dd className="text-base text-gray-900 dark:text-white">{portfolioItem.projectType}</dd>
                                    </div>
                                )}
                                {portfolioItem.teamSize && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Size</dt>
                                        <dd className="text-base text-gray-900 dark:text-white">{portfolioItem.teamSize} members</dd>
                                    </div>
                                )}
                            </dl>
                            {(portfolioItem.projectUrl || portfolioItem.githubUrl) && (
                                <div className="mt-6 space-y-3">
                                    {portfolioItem.projectUrl && (
                                        <a
                                            href={portfolioItem.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            View Live Project
                                        </a>
                                    )}
                                    {portfolioItem.githubUrl && (
                                        <a
                                            href={portfolioItem.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            View on GitHub
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Projects */}
                {!relatedLoading && relatedProjects.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Related Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/portfolio/${project.slug}`}
                                    className="block group"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                        <div className="relative h-48">
                                            <Image
                                                src={project.featuredImage}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {project.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 