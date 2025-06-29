"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Navbar, WhatsAppChat } from '@/components';
import { useLanguage } from '@/context/LanguageContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Portfolio interface
interface PortfolioItem {
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
    viewCount: number;
    category: {
        id: string;
        name: string;
        slug: string;
        icon: string;
        color?: string;
    };
    tags: Array<{
        name: string;
        color: string;
    }>;
}

export default function PortfolioPage() {
    const { t } = useLanguage();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch portfolio data from API
    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/portfolio?published=true');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform data to match interface - API returns portfolios array
            const portfolios = data.portfolios || data; // Handle both possible response structures
            const transformedPortfolios = portfolios.map((item: any) => ({
                id: item.id,
                title: item.title,
                slug: item.slug,
                description: item.description,
                content: item.content,
                featuredImage: item.featuredImage || '/images/placeholder.jpg',
                images: item.images || [],
                clientName: item.clientName || 'Unknown Client',
                projectUrl: item.projectUrl || '',
                githubUrl: item.githubUrl || '',
                featured: Boolean(item.featured),
                published: Boolean(item.published),
                viewCount: parseInt(item.viewCount) || 0,
                category: {
                    id: item.category?.id || 'uncategorized',
                    name: item.category?.name || 'Uncategorized',
                    slug: item.category?.slug || 'uncategorized',
                    icon: item.category?.icon || '📁',
                    color: item.category?.color || '#6B7280'
                },
                tags: item.tags || []
            }));

            setPortfolioItems(transformedPortfolios);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            setError('Gagal memuat portfolio. Silakan refresh halaman.');
        } finally {
            setLoading(false);
        }
    };

    // Update categories based on actual data
    const getCategoriesWithCounts = () => {
        const categoryCounts: { [key: string]: number } = {};

        portfolioItems.forEach(item => {
            const categorySlug = item.category.slug;
            categoryCounts[categorySlug] = (categoryCounts[categorySlug] || 0) + 1;
        });

        return [
            {
                name: t('portfolio.categories.all') || 'All',
                slug: 'all',
                icon: '📂',
                count: portfolioItems.length
            },
            {
                name: t('portfolio.categories.webDevelopment') || 'Web Development',
                slug: 'web-development',
                icon: '🌐',
                count: categoryCounts['web-development'] || 0
            },
            {
                name: t('portfolio.categories.gameAssets') || 'Game Development',
                slug: 'game-development',
                icon: '🎮',
                count: categoryCounts['game-development'] || 0
            },
            {
                name: t('portfolio.categories.uiuxDesign') || 'UI/UX Design',
                slug: 'uiux-design',
                icon: '🎨',
                count: categoryCounts['uiux-design'] || 0
            }
        ];
    };

    const categories = getCategoriesWithCounts();

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

    // Filter portfolio items
    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredItems(portfolioItems);
        } else {
            setFilteredItems(portfolioItems.filter(item => item.category.slug === selectedCategory));
        }
    }, [selectedCategory, portfolioItems]);

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
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Navbar variant="solid" activeTab="portfolio" />
                <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        </div>
                    </div>
                </div>
                <main className="py-16">
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                        <div className="text-center animate-pulse">
                            <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto mb-6"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    </section>
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
                                        <div className="h-48 bg-gray-300"></div>
                                        <div className="p-6">
                                            <div className="h-6 bg-gray-300 rounded mb-3"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    // Error state  
    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Navbar variant="solid" activeTab="portfolio" />
                <main className="py-16">
                    <div className="text-center py-20">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Error Loading Portfolio
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {error}
                        </p>
                        <Button
                            variant="primary"
                            onClick={fetchPortfolioData}
                        >
                            Coba Lagi
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <Navbar variant="solid" activeTab="portfolio" />

            {/* Breadcrumb */}
            <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                            {t('nav.home') || 'Home'}
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-primary font-medium">{t('nav.portfolio') || 'Portfolio'}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="py-16">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20">
                    <div className="text-center">
                        <Heading
                            variant="h1"
                            color="foreground"
                            className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold"
                            data-aos="fade-up"
                        >
                            {t('portfolio.page.title.main') || 'Our Amazing'} {' '}
                            <span className="text-primary relative">
                                <span className="relative z-10">{t('portfolio.page.title.highlight') || 'Portfolio'}</span>
                                <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-0"></span>
                            </span>
                        </Heading>

                        <p
                            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            {t('portfolio.page.subtitle') || 'Showcasing our best work and creative solutions'}
                        </p>
                    </div>
                </section>

                {/* Filter Categories */}
                <section className="py-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up">
                            {categories.map((category) => (
                                <button
                                    key={category.slug}
                                    onClick={() => setSelectedCategory(category.slug)}
                                    className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.slug
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="text-lg">{category.icon}</span>
                                    <span>{category.name}</span>
                                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portfolio Grid */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.map((item, index) => (
                                <article
                                    key={item.id}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    {/* Project Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={item.featuredImage}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {item.featured && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                    ⭐ Featured
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span
                                                className="inline-flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs backdrop-blur-sm"
                                            >
                                                <span style={{ color: item.category.color }}>{item.category.icon}</span>
                                                <span>{item.category.name}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Client & Views */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.clientName}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                                <span>👁️</span>
                                                <span>{item.viewCount}</span>
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
                                            {item.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.tags.slice(0, 3).map((tag: any, tagIndex: number) => (
                                                <span
                                                    key={tagIndex}
                                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                                    style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                            {item.tags.length > 3 && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    +{item.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/portfolio/${item.slug}`}
                                                className="inline-flex items-center text-primary font-medium text-sm hover:gap-2 transition-all duration-300"
                                            >
                                                <span>{t('portfolio.project.viewDetail')}</span>
                                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>

                                            <div className="flex items-center space-x-2">
                                                {item.projectUrl && (
                                                    <a
                                                        href={item.projectUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                                                        title="Visit Website"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {item.githubUrl && (
                                                    <a
                                                        href={item.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                                                        title="View Code"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Coming Soon State */}
                        {filteredItems.length === 0 && (
                            <div className="text-center py-20" data-aos="fade-up">
                                <div className="relative mb-8">
                                    <div className="text-8xl mb-4 animate-pulse">🚀</div>
                                    <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    {t('portfolio.comingSoon.title')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                                    {t('portfolio.comingSoon.subtitle')}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20">
                    <div
                        className="relative bg-gray-900 dark:bg-gray-800 rounded-3xl p-12 text-center text-white overflow-hidden"
                        data-aos="zoom-in"
                        data-aos-delay="400"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5 dark:opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '60px 60px'
                            }}></div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 bg-white/3 dark:bg-white/5 rounded-full blur-xl"></div>
                        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/2 dark:bg-white/3 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/4 dark:bg-white/8 rounded-full blur-lg"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                {t('portfolio.cta.title')}
                            </h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                                {t('portfolio.cta.subtitle')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="outline" size="lg" className="bg-white text-gray-900 border-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 px-8 py-4 font-semibold shadow-lg">
                                    {t('portfolio.cta.startProject')}
                                </Button>
                                <Button variant="outline" size="lg" className="border-white/60 text-white hover:bg-white/10 dark:hover:bg-white/15 hover:scale-105 transition-all duration-300 px-8 py-4 font-semibold backdrop-blur-sm">
                                    {t('portfolio.cta.viewServices')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Dark Mode Toggle */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={toggleDarkMode}
                    className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? (
                        <svg className="w-6 h-6 text-yellow-500 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-gray-700 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message="Halo! Saya tertarik dengan layanan Bajramedia. Bisa konsultasi gratis?"
            />
        </div>
    );
} 
