"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Logo, LanguageSwitcher } from '@/components';
import { useLanguage } from '@/context/LanguageContext';
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
    tags: Array<{ name: string; color: string }>;
    featured: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    viewCount?: number;
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

    // Fetch portfolio item dari database
    useEffect(() => {
        const fetchPortfolioItem = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/portfolio/${slug}`);

                if (!response.ok) {
                    throw new Error('Portfolio item not found');
                }

                const data = await response.json();

                // Format data untuk komponen
                const formattedItem: PortfolioItem = {
                    id: data.id,
                    slug: data.slug,
                    title: data.title,
                    description: data.description,
                    content: data.content,
                    featuredImage: data.featuredImage || '/images/placeholder.jpg',
                    images: data.images || [],
                    clientName: data.client || data.clientName,
                    client: data.client,
                    projectUrl: data.projectUrl,
                    githubUrl: data.githubUrl,
                    category: {
                        name: data.categoryName || 'Uncategorized',
                        slug: data.categorySlug || 'uncategorized',
                        icon: data.categoryIcon || '🌐',
                        color: data.categoryColor || '#3B82F6'
                    },
                    tags: data.tags || [],
                    featured: data.featured || false,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    createdAt: data.createdAt || data.date,
                    viewCount: data.viewCount || 0
                };

                setPortfolioItem(formattedItem);

                // Fetch related projects after getting current item
                fetchRelatedProjects(formattedItem.category.slug, formattedItem.id);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load portfolio item');
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
                                .filter(project => !relatedByCategory.some(related => related.id === project.id))
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
                    console.log('✅ Related projects:', related.map(p => ({ title: p.title, category: p.category.name })));
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
    if (error || !portfolioItem) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Portfolio Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || 'The portfolio item you are looking for does not exist.'}
                    </p>
                    <Link href="/portfolio">
                        <Button variant="primary">Back to Portfolio</Button>
                    </Link>
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

            <main className="py-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Project Info */}
                        <div data-aos="fade-right">
                            <div className="flex items-center space-x-4 mb-4">
                                <span
                                    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium"
                                    style={{ backgroundColor: `${portfolioItem.category.color}15`, color: portfolioItem.category.color }}
                                >
                                    <span>{portfolioItem.category.icon}</span>
                                    <span>{portfolioItem.category.name}</span>
                                </span>
                                {portfolioItem.featured && (
                                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        ⭐ {t('portfolio.detail.featured')}
                                    </span>
                                )}
                            </div>

                            <Heading
                                variant="h1"
                                color="foreground"
                                className="mb-6 text-[28px] md:text-[36px] lg:text-[44px] font-bold leading-tight"
                            >
                                {portfolioItem.title}
                            </Heading>

                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                                {portfolioItem.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 mb-8">
                                {portfolioItem.viewCount && (
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="text-sm">{portfolioItem.viewCount} views</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm">{new Date(portfolioItem.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t('portfolio.detail.projectInfo')}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {portfolioItem.clientName && (
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-900 dark:text-white mb-1">{t('portfolio.detail.client')}</h5>
                                                <p className="text-gray-600 dark:text-gray-400">{portfolioItem.clientName}</p>
                                            </div>
                                        </div>
                                    )}
                                    {portfolioItem.startDate && portfolioItem.endDate && (
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-900 dark:text-white mb-1">{t('portfolio.detail.duration')}</h5>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {new Date(portfolioItem.startDate).toLocaleDateString()} - {new Date(portfolioItem.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {portfolioItem.projectUrl && (
                                    <a
                                        href={portfolioItem.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="primary" size="lg" className="w-full sm:w-auto">
                                            <span>{t('portfolio.detail.viewWebsite')}</span>
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </Button>
                                    </a>
                                )}
                                {portfolioItem.githubUrl && (
                                    <a
                                        href={portfolioItem.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                            <span>{t('portfolio.detail.viewCode')}</span>
                                            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Project Images */}
                        <div data-aos="fade-left">
                            {/* Main Image */}
                            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-4 shadow-xl shadow-primary/10 border border-gray-100 dark:border-gray-700">
                                <Image
                                    src={allImages[selectedImageIndex]}
                                    alt={portfolioItem.title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                                />
                            </div>

                            {/* Image Thumbnails - hanya tampil jika ada lebih dari 1 gambar */}
                            {allImages.length > 1 && (
                                <div className="flex space-x-4 overflow-x-auto">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImageIndex === index
                                                ? 'border-primary shadow-lg shadow-primary/25'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
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
                </section>

                {/* Technologies Used */}
                {portfolioItem.tags && portfolioItem.tags.length > 0 && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8" data-aos="fade-up">
                            {t('portfolio.detail.technologies')}
                        </h2>
                        <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="200">
                            {portfolioItem.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105"
                                    style={{
                                        backgroundColor: `${tag.color || '#6B7280'}15`,
                                        color: tag.color || '#6B7280',
                                        borderColor: `${tag.color || '#6B7280'}30`
                                    }}
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Project Content */}
                {portfolioItem.content && (
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mb-16">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none"
                            data-aos="fade-up"
                            dangerouslySetInnerHTML={{ __html: portfolioItem.content }}
                        />
                    </section>
                )}

                {/* Related Projects */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8" data-aos="fade-up">
                        Portfolio Terkait
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