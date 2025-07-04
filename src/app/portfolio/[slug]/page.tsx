"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Logo, LanguageSwitcher } from '@/components';
import { useLanguage } from '@/context/LanguageContext';
import { useViewTracker } from '@/hooks/useViewTracker';
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
    projectStatus?: string;
    projectType?: string;
    teamSize?: number;
    duration?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    impact?: string;
}

interface PortfolioDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
    const { slug } = await params;
    return <PortfolioDetailPageContent slug={slug} />;
}

function PortfolioDetailPageContent({ slug }: { slug: string }) {
    const { t } = useLanguage();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null);
    const [relatedProjects, setRelatedProjects] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Track views untuk portfolio ini
    const { viewCount: trackedViewCount, hasTracked } = useViewTracker({
        type: 'portfolio',
        slug,
        title: portfolioItem?.title
    });

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
                    projectStatus: data.projectStatus || data.project_status || 'Completed',
                    projectType: data.projectType || data.project_type,
                    teamSize: data.teamSize || data.team_size,
                    duration: data.duration
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

        const fetchRelatedProjects = async (categorySlug: string, currentId: string) => {
            try {
                setRelatedLoading(true);
                console.log('🔍 Mencari related projects untuk kategori:', categorySlug, 'current ID:', currentId);

                const response = await fetch('/api/portfolio?published=true');
                console.log('📡 API Response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('📄 Raw API data:', data);

                    const allProjects = data.portfolios || data || [];
                    console.log('📋 Total portfolio ditemukan:', allProjects.length);

                    if (allProjects.length > 0) {
                        console.log('📋 Sample project structure:', allProjects[0]);
                    }

                    // Filter portfolio yang bukan yang sedang dibuka
                    const otherProjects = allProjects.filter((project: any) =>
                        project.id !== currentId && project.id != currentId
                    );

                    console.log('📋 Portfolio lain (bukan current):', otherProjects.length);

                    // Cari portfolio dengan kategori yang sama dulu
                    let relatedByCategory = otherProjects.filter((project: any) => {
                        const projectCategory = project.categorySlug || project.category?.slug || project.categoryName?.toLowerCase().replace(/\s+/g, '-');
                        const matches = projectCategory === categorySlug;
                        console.log(`🔍 Project "${project.title}" - Category: ${projectCategory}, Target: ${categorySlug}, Match: ${matches}`);
                        return matches;
                    });

                    console.log('🎯 Portfolio dengan kategori sama:', relatedByCategory.length);

                    // Kalau ga ada yang sama kategorinya, ambil portfolio lain secara random
                    if (relatedByCategory.length === 0) {
                        console.log('⚠️ Tidak ada portfolio dengan kategori sama, mengambil portfolio lain secara random');
                        relatedByCategory = otherProjects
                            .sort(() => Math.random() - 0.5) // Random shuffle
                            .slice(0, 3);
                    } else {
                        // Kalau ada yang sama kategorinya tapi kurang dari 3, tambahkan portfolio lain
                        if (relatedByCategory.length < 3) {
                            console.log('⚠️ Portfolio kategori sama kurang dari 3, menambahkan portfolio lain');
                            const additionalProjects = otherProjects
                                .filter((project: any) => !relatedByCategory.some((related: any) => related.id === project.id))
                                .sort(() => Math.random() - 0.5)
                                .slice(0, 3 - relatedByCategory.length);

                            relatedByCategory = [...relatedByCategory, ...additionalProjects];
                        }
                    }

                    // Ambil maksimal 3 portfolio
                    const related = relatedByCategory
                        .slice(0, 3)
                        .map((project: any) => {
                            console.log('🎯 Mapping project:', project.title);
                            return {
                                id: project.id,
                                slug: project.slug,
                                title: project.title,
                                description: project.description || project.excerpt,
                                content: project.content,
                                featuredImage: project.featuredImage || project.featured_image || '/images/placeholder.jpg',
                                images: project.images || [],
                                clientName: project.clientName || project.client_name || project.client,
                                client: project.client || project.clientName,
                                projectUrl: project.projectUrl,
                                githubUrl: project.githubUrl,
                                category: project.category || {
                                    name: project.categoryName || 'Uncategorized',
                                    slug: project.categorySlug || 'uncategorized',
                                    icon: project.categoryIcon || '🌐',
                                    color: project.categoryColor || '#3B82F6'
                                },
                                tags: Array.isArray(project.tags) ? project.tags : [],
                                featured: project.featured || false,
                                startDate: project.startDate,
                                endDate: project.endDate,
                                createdAt: project.createdAt || project.date,
                                viewCount: project.viewCount || project.views || 0
                            };
                        });

                    console.log('✅ Related projects berhasil ditemukan:', related.length);
                    console.log('✅ Related projects:', related.map((p: any) => ({ title: p.title, category: p.category.name })));
                    setRelatedProjects(related);
                } else {
                    console.error('❌ API response tidak OK:', response.status, response.statusText);
                }
            } catch (err) {
                console.error('💥 Gagal fetch related projects:', err);
            } finally {
                setRelatedLoading(false);
            }
        };

        fetchPortfolioItem();
    }, [slug]);

    // Initialize dark mode
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const shouldEnableDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

            setIsDarkMode(shouldEnableDarkMode);

            if (shouldEnableDarkMode) {
                document.documentElement.classList.add('dark');
            }

            const handleStorageChange = (e: StorageEvent) => {
                if (e.key === 'darkMode') {
                    const newMode = e.newValue === 'true';
                    setIsDarkMode(newMode);

                    if (newMode) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            };

            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
        });
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('darkMode', newMode ? 'true' : 'false');
            return newMode;
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || (!loading && !portfolioItem)) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Portfolio Tidak Ditemukan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || 'Portfolio yang kamu cari tidak ditemukan atau belum tersedia.'}
                    </p>
                    <div className="space-y-3">
                        <Link href="/portfolio">
                            <Button variant="primary" className="w-full">
                                Kembali ke Portfolio
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Ke Halaman Utama
                            </Button>
                        </Link>
                    </div>
                    {process.env.NODE_ENV === 'development' && error && (
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                            <p className="text-xs text-red-600 dark:text-red-400 font-mono">
                                Debug: {error}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Null guard untuk portfolioItem
    if (!portfolioItem) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    const allImages = portfolioItem.images && portfolioItem.images.length > 0
        ? [portfolioItem.featuredImage, ...portfolioItem.images]
        : [portfolioItem.featuredImage];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 shadow-sm z-50 py-3 md:py-4 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
                    <Logo size="md" />
                    <div className="hidden md:flex items-center space-x-7">
                        <nav className="flex space-x-6">
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">{t('nav.home')}</Link>
                            <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">{t('nav.services')}</Link>
                            <Link href="/portfolio" className="text-primary transition-colors">{t('nav.portfolio')}</Link>
                            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">{t('nav.blog')}</Link>
                        </nav>
                        <LanguageSwitcher className="mr-4" />
                        <Button variant="primary" size="sm">{t('nav.contact')}</Button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400" data-aos="fade-right">
                        <Link href="/portfolio" className="hover:text-primary transition-colors">
                            {t('nav.portfolio')}
                        </Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 dark:text-white">{portfolioItem.title}</span>
                    </nav>
                </div>
            </div>

            <main className="pt-16">
                {/* Enhanced Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Background with gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 dark:from-gray-900/50 via-transparent to-transparent"></div>

                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Enhanced Project Info */}
                            <div data-aos="fade-right" className="space-y-8">
                                {/* Project Meta */}
                                <div className="flex items-center space-x-4">
                                    <span
                                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border"
                                        style={{
                                            backgroundColor: `${portfolioItem.category.color}20`,
                                            color: portfolioItem.category.color,
                                            borderColor: `${portfolioItem.category.color}30`
                                        }}
                                    >
                                        <span className="text-lg">{portfolioItem.category.icon}</span>
                                        <span>{portfolioItem.category.name}</span>
                                    </span>
                                    {portfolioItem.featured && (
                                        <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                            ⭐ Featured Project
                                        </span>
                                    )}
                                </div>

                                {/* Title with better typography */}
                                <div className="space-y-4">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                                        {portfolioItem.title}
                                    </h1>
                                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                                        {portfolioItem.description}
                                    </p>
                                </div>

                                {/* Project Stats Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                                        <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{portfolioItem.viewCount || 0}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Views</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                                        <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{portfolioItem.teamSize || 1}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Team</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                                        <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{portfolioItem.duration?.split(' ')[0] || 'N/A'}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Duration</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                                        <div className="text-2xl md:text-3xl font-bold text-green-500 mb-1">✓</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{portfolioItem.projectStatus || 'Done'}</div>
                                    </div>
                                </div>

                                {/* Enhanced Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {portfolioItem.projectUrl && (
                                        <a
                                            href={portfolioItem.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                        >
                                            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                                </svg>
                                                <span>Visit Live Site</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </button>
                                        </a>
                                    )}
                                    {portfolioItem.githubUrl && (
                                        <a
                                            href={portfolioItem.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                        >
                                            <button className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-semibold rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3">
                                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                <span>View Code</span>
                                            </button>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced Image Gallery */}
                            <div data-aos="fade-left" className="relative">
                                {/* Main Image with enhanced styling */}
                                <div className="relative group cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-105"></div>
                                    <div className="relative h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500 border border-white/20 dark:border-gray-700/50">
                                        <Image
                                            src={allImages[selectedImageIndex]}
                                            alt={portfolioItem.title}
                                            fill
                                            className="object-cover"
                                            onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Image overlay with zoom icon */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced thumbnails */}
                                {allImages.length > 1 && (
                                    <div className="flex space-x-4 mt-6 overflow-x-auto pb-2">
                                        {allImages.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${selectedImageIndex === index
                                                    ? 'border-primary shadow-lg shadow-primary/25 scale-110'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50'
                                                    }`}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${portfolioItem.title} ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technologies Used */}
                {((portfolioItem.technologies && portfolioItem.technologies.length > 0) || (portfolioItem.tags && portfolioItem.tags.length > 0)) && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8" data-aos="fade-up">
                            Teknologi yang Digunakan
                        </h2>
                        <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="200">
                            {/* Prioritas technologies dulu, kalau ga ada baru pake tags */}
                            {(portfolioItem.technologies && portfolioItem.technologies.length > 0 ? portfolioItem.technologies : portfolioItem.tags).map((tech, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105 hover:shadow-md"
                                    style={{
                                        backgroundColor: `${tech.color || '#6B7280'}15`,
                                        color: tech.color || '#6B7280',
                                        borderColor: `${tech.color || '#6B7280'}30`
                                    }}
                                >
                                    <span className="mr-2">⚡</span>
                                    {tech.name}
                                </span>
                            ))}
                        </div>

                        {/* Kalau ada kedua technologies dan tags, tampilkan tags sebagai skills tambahan */}
                        {portfolioItem.technologies && portfolioItem.technologies.length > 0 && portfolioItem.tags && portfolioItem.tags.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Skills & Tools Lainnya
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {portfolioItem.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Project Details Section */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Project Overview */}
                            <div data-aos="fade-up" className="lg:col-span-2">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                                    Project Overview
                                </h2>

                                {/* Enhanced Content */}
                                {portfolioItem.content && (
                                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                                        <div dangerouslySetInnerHTML={{ __html: portfolioItem.content }} />
                                    </div>
                                )}

                                {/* Challenge & Solution */}
                                {(portfolioItem.challenge || portfolioItem.solution) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                        {portfolioItem.challenge && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-red-100 dark:border-red-900/30">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Challenge</h3>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{portfolioItem.challenge}</p>
                                            </div>
                                        )}

                                        {portfolioItem.solution && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-900/30">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Solution</h3>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{portfolioItem.solution}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Results & Impact */}
                                {(portfolioItem.results || portfolioItem.impact) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {portfolioItem.results && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-900/30">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Results</h3>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{portfolioItem.results}</p>
                                            </div>
                                        )}

                                        {portfolioItem.impact && (
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900/30">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Impact</h3>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{portfolioItem.impact}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Project Details Sidebar */}
                            <div data-aos="fade-up" data-aos-delay="200" className="space-y-8">
                                {/* Project Information Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                        <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Project Details
                                    </h3>

                                    <div className="space-y-4">
                                        {portfolioItem.clientName && (
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Client</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{portfolioItem.clientName}</span>
                                            </div>
                                        )}

                                        {portfolioItem.projectType && (
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Type</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{portfolioItem.projectType}</span>
                                            </div>
                                        )}

                                        {portfolioItem.duration && (
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Duration</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{portfolioItem.duration}</span>
                                            </div>
                                        )}

                                        {portfolioItem.teamSize && (
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Team Size</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{portfolioItem.teamSize} people</span>
                                            </div>
                                        )}

                                        {portfolioItem.projectStatus && (
                                            <div className="flex items-center justify-between py-3">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Status</span>
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-semibold">
                                                    {portfolioItem.projectStatus}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Share Project */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                        Share Project
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => navigator.share?.({ url: window.location.href, title: portfolioItem.title }) || window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out this amazing project: ${portfolioItem.title}`)}`)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                            </svg>
                                            <span>Twitter</span>
                                        </button>
                                        <button
                                            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`)}
                                            className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                            <span>LinkedIn</span>
                                        </button>
                                        <button
                                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                            <span>Facebook</span>
                                        </button>
                                        <button
                                            onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span>Copy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Projects */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8" data-aos="fade-up">
                        {t('portfolio.detail.relatedProjects')}
                    </h2>

                    {relatedLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-xl mb-4"></div>
                                    <div className="bg-gray-300 dark:bg-gray-700 h-6 rounded mb-2"></div>
                                    <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : relatedProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up">
                            {relatedProjects.map((project, index) => (
                                <Link
                                    key={project.id}
                                    href={`/portfolio/${project.slug}`}
                                    className="group"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={project.featuredImage}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span
                                                    className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: `${project.category.color}15`,
                                                        color: project.category.color
                                                    }}
                                                >
                                                    <span>{project.category.icon}</span>
                                                    <span>{project.category.name}</span>
                                                </span>
                                                {project.featured && (
                                                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                        ⭐
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                                {project.description}
                                            </p>
                                            {project.tags && project.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                                                        <span
                                                            key={tagIndex}
                                                            className="inline-block px-2 py-1 rounded text-xs"
                                                            style={{
                                                                backgroundColor: `${tag.color || '#6B7280'}10`,
                                                                color: tag.color || '#6B7280'
                                                            }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                    {project.tags.length > 3 && (
                                                        <span className="inline-block px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                                            +{project.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16" data-aos="fade-up">
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Belum Ada Portfolio Terkait
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Kami sedang mengembangkan lebih banyak project keren di kategori ini!
                            </p>
                            <Link href="/portfolio">
                                <Button variant="primary">
                                    Lihat Semua Portfolio
                                </Button>
                            </Link>
                        </div>
                    )}
                </section>
            </main>

            {/* Dark Mode Toggle */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={toggleDarkMode}
                    className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300"
                >
                    {isDarkMode ? <span className="text-2xl">☀️</span> : <span className="text-2xl">🌙</span>}
                </button>
            </div>
        </div>
    );
} 