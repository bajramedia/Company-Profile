"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Navbar, WhatsAppChat, Footer } from '@/components';
import { useLanguage } from '@/context/LanguageContext';
import { Star, Eye, Rocket, Sparkles, Folder, Globe, Gamepad2, Palette } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface PortfolioItem {
    id: string;
    title: string;
    slug: string;
    description: string;
    featuredImage: string;
    category: {
        name: string;
        slug: string;
    };
}

export default function PortfolioPage() {
    const { t, language } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/portfolio?published=true');
                if (!response.ok) throw new Error('Failed to fetch portfolio data');
                const data = await response.json();
                setPortfolioItems(data.portfolios || data);
            } catch (err) {
                setError(err instanceof Error ? err.message : t('portfolio.error.fetch'));
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolioData();
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
        });
    }, [t]);

    const getCategories = () => {
        const categoriesMap = new Map();
        portfolioItems.forEach(item => {
            if (item.category) {
                categoriesMap.set(item.category.slug, {
                    name: item.category.name,
                    slug: item.category.slug,
                    count: (categoriesMap.get(item.category.slug)?.count || 0) + 1
                });
            }
        });
        return [
            { name: t('portfolio.categories.all'), slug: 'all', count: portfolioItems.length },
            ...Array.from(categoriesMap.values())
        ];
    };

    const categories = getCategories();
    const filteredItems = selectedCategory === 'all'
        ? portfolioItems
        : portfolioItems.filter(item => item.category?.slug === selectedCategory);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar variant="solid" activeTab="portfolio" />
            <main className="pt-24 pb-16">
                <section className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 mb-16" data-aos="fade-up">
                    <div className="text-center">
                        <Heading variant="h1" color="foreground" className="text-4xl md:text-5xl font-bold mb-4">
                            {t('portfolio.title') || 'Karya Terbaik Kami'}
                        </Heading>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            {t('portfolio.subtitle') || 'Jelajahi proyek-proyek yang telah kami kerjakan dengan bangga.'}
                        </p>
                    </div>
                </section>

                <section className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 mb-16">
                    <div className="flex flex-wrap justify-center gap-4 mb-10" data-aos="fade-up" data-aos-delay="100">
                        {categories.map(category => (
                            <button
                                key={category.slug}
                                onClick={() => setSelectedCategory(category.slug)}
                                className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.slug ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                {category.name}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.slug ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>{category.count}</span>
                            </button>
                        ))}
                    </div>

                    {loading && <p className="text-center">{t('common.loading') || 'Loading...'}</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, index) => (
                                    <Link key={item.id} href={`/portfolio/${item.slug}`}>
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer h-full" data-aos="fade-up" data-aos-delay={index * 50}>
                                            <div className="relative h-56 w-full overflow-hidden">
                                                <Image src={item.featuredImage} alt={item.title} layout="fill" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/80 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">{item.category.name}</span>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100">{item.title}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{item.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="col-span-full text-center py-10 text-gray-500">{t('portfolio.noResults') || 'Tidak ada proyek yang ditemukan dalam kategori ini.'}</p>
                            )}
                        </div>
                    )}
                </section>

                <section className="py-16 bg-white dark:bg-gray-800" data-aos="fade-up">
                    <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
                        <Heading variant="h2" color="foreground" className="mb-4">{t('portfolio.cta.title') || 'Punya Ide Proyek?'}</Heading>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">{t('portfolio.cta.subtitle') || 'Mari wujudkan bersama kami. Hubungi kami untuk konsultasi gratis!'}</p>
                        <Link href="/contact">
                            <Button variant="primary" size="lg">{t('common.contactUs') || 'Hubungi Kami'}</Button>
                        </Link>
                    </div>
                </section>
            </main>
            <WhatsAppChat phoneNumber="6285739402436" message={t('whatsapp.portfolioMessage') || 'Halo! Saya tertarik dengan portofolio Bajramedia.'} />
        </div>
    );
} 
