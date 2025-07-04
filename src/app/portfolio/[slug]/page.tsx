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
                    <div className="text-6xl mb-4 text-gray-400">
                        <Frown size={64} className="mx-auto" />
                    </div>
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
                {/* Clean Hero Section - No Gradients */}
                <section className="bg-white dark:bg-gray-900 py-16 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Project Info */}
                            <div data-aos="fade-right" className="space-y-8">
                                {/* Project Meta */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span
                                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium border-2"
                                        style={{
                                            backgroundColor: `${portfolioItem.category.color}15`,
                                            color: portfolioItem.category.color,
                                            borderColor: `${portfolioItem.category.color}30`
                                        }}
                                    >
                                        <span className="text-lg">{portfolioItem.category.icon}</span>
                                        <span>{portfolioItem.category.name}</span>
                                    </span>
                                    {portfolioItem.featured && (
                                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-2 border-yellow-200 dark:border-yellow-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1">
                                            <Star size={16} className="fill-current" />
                                            <span>Featured Project</span>
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="space-y-4">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                        {portfolioItem.title}
                                    </h1>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {portfolioItem.description}
                                    </p>
                                </div>

                                {/* Client & Project Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="text-2xl font-bold text-primary mb-1">{trackedViewCount || portfolioItem.viewCount || 0}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Views</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="text-2xl font-bold text-primary mb-1">{portfolioItem.teamSize || 1}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Team</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="text-2xl font-bold text-primary mb-1">
                                            {portfolioItem.duration
                                                ? portfolioItem.duration.includes(' ')
                                                    ? portfolioItem.duration.split(' ')[0]
                                                    : portfolioItem.duration
                                                : 'N/A'
                                            }
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Duration</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="text-2xl font-bold text-green-500 mb-1 flex justify-center">
                                            <Check size={24} />
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{portfolioItem.projectStatus || 'Done'}</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {portfolioItem.projectUrl && (
                                        <a
                                            href={portfolioItem.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                        >
                                            <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-xl border-2 border-primary hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3">
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
                                            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-semibold rounded-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                <span>View Source Code</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </button>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Project Image */}
                            <div data-aos="fade-left" className="lg:order-last">
                                <div className="relative">
                                    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                                        <Image
                                            src={allImages[selectedImageIndex]}
                                            alt={portfolioItem.title}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>

                                    {/* Image Navigation */}
                                    {allImages.length > 1 && (
                                        <div className="flex justify-center mt-4 space-x-2">
                                            {allImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedImageIndex === index
                                                        ? 'bg-primary scale-125'
                                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Project Details Section */}
                <section className="py-16 bg-gray-50 dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-12">
                                {/* Project Overview */}
                                <div data-aos="fade-up">
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Project Overview</h2>
                                    <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
                                        {portfolioItem.content ? (
                                            <div dangerouslySetInnerHTML={{ __html: portfolioItem.content }} />
                                        ) : (
                                            <p>{portfolioItem.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Challenge & Solution */}
                                {(portfolioItem.challenge || portfolioItem.solution) && (
                                    <div data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {portfolioItem.challenge && (
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                    <Zap size={20} className="text-orange-500 mr-2" />
                                                    Challenge
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">{portfolioItem.challenge}</p>
                                            </div>
                                        )}
                                        {portfolioItem.solution && (
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                    <Check size={20} className="text-green-500 mr-2" />
                                                    Solution
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">{portfolioItem.solution}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Results & Impact */}
                                {(portfolioItem.results || portfolioItem.impact) && (
                                    <div data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {portfolioItem.results && (
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                    <Star size={20} className="text-blue-500 mr-2" />
                                                    Results
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">{portfolioItem.results}</p>
                                            </div>
                                        )}
                                        {portfolioItem.impact && (
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                                    <Rocket size={20} className="text-purple-500 mr-2" />
                                                    Impact
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">{portfolioItem.impact}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Project Info Card */}
                                <div data-aos="fade-up" className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Project Info</h3>
                                    <div className="space-y-4">
                                        {portfolioItem.clientName && (
                                            <div>
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Client</div>
                                                <div className="text-gray-900 dark:text-white font-medium">{portfolioItem.clientName}</div>
                                            </div>
                                        )}
                                        {portfolioItem.projectType && (
                                            <div>
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Project Type</div>
                                                <div className="text-gray-900 dark:text-white font-medium">{portfolioItem.projectType}</div>
                                            </div>
                                        )}
                                        {portfolioItem.duration && (
                                            <div>
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                                                <div className="text-gray-900 dark:text-white font-medium">{portfolioItem.duration}</div>
                                            </div>
                                        )}
                                        {(portfolioItem.startDate || portfolioItem.endDate) && (
                                            <div>
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Timeline</div>
                                                <div className="text-gray-900 dark:text-white font-medium flex items-center">
                                                    <Calendar size={16} className="mr-2" />
                                                    {portfolioItem.startDate && new Date(portfolioItem.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    {portfolioItem.startDate && portfolioItem.endDate && ' - '}
                                                    {portfolioItem.endDate && new Date(portfolioItem.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Technologies Used */}
                                {(portfolioItem.technologies && portfolioItem.technologies.length > 0) ? (
                                    <div data-aos="fade-up" className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                            <Zap size={20} className="text-blue-500 mr-2" />
                                            Technologies Used
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {portfolioItem.technologies.map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border"
                                                    style={{
                                                        backgroundColor: tech.color ? `${tech.color}15` : '#f3f4f6',
                                                        color: tech.color || '#374151',
                                                        borderColor: tech.color ? `${tech.color}30` : '#d1d5db'
                                                    }}
                                                >
                                                    {tech.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : portfolioItem.tags && portfolioItem.tags.length > 0 ? (
                                    <div data-aos="fade-up" className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                            <Zap size={20} className="text-blue-500 mr-2" />
                                            Technologies Used
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {portfolioItem.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border"
                                                    style={{
                                                        backgroundColor: tag.color ? `${tag.color}15` : '#f3f4f6',
                                                        color: tag.color || '#374151',
                                                        borderColor: tag.color ? `${tag.color}30` : '#d1d5db'
                                                    }}
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                {/* Project Stats */}
                                <div data-aos="fade-up" className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Project Stats</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Eye size={16} className="text-blue-500 mr-2" />
                                                <span className="text-gray-600 dark:text-gray-400">Views</span>
                                            </div>
                                            <span className="text-gray-900 dark:text-white font-semibold">{trackedViewCount || portfolioItem.viewCount || 0}</span>
                                        </div>
                                        {portfolioItem.teamSize && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span className="text-gray-600 dark:text-gray-400">Team Size</span>
                                                </div>
                                                <span className="text-gray-900 dark:text-white font-semibold">{portfolioItem.teamSize} people</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Check size={16} className="text-green-500 mr-2" />
                                                <span className="text-gray-600 dark:text-gray-400">Status</span>
                                            </div>
                                            <span className="text-green-600 dark:text-green-400 font-semibold">{portfolioItem.projectStatus || 'Completed'}</span>
                                        </div>
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
                                                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                                        <Star size={12} className="fill-current" />
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
                            <div className="text-6xl mb-4 text-primary flex justify-center">
                                <Rocket size={64} />
                            </div>
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
                    className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                    {isDarkMode ? (
                        <Sun size={24} className="text-yellow-500" />
                    ) : (
                        <Moon size={24} className="text-blue-500" />
                    )}
                </button>
            </div>
        </div>
    );
} 