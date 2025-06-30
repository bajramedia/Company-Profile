"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Heading from './Heading';
import Text from './Text';
import Button from './Button';
import AnimatedText from './AnimatedText';

interface PortfolioItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  images?: string;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  categoryIcon?: string;
  published: boolean;
  featured: boolean;
  client_name?: string;
  project_url?: string;
  technologies?: string;
  date?: string;
}

interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

const Portfolio: React.FC = () => {
  const { t } = useLanguage();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch portfolio data dan categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch portfolio items
        const portfolioResponse = await fetch('/api/portfolio');
        if (!portfolioResponse.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const portfolioData = await portfolioResponse.json();

        // Handle both object response (from Next.js API) and direct array (from production)
        const portfolioItems = portfolioData.portfolios || portfolioData || [];
        console.log('Portfolio component: Received data:', portfolioItems);

        // Fetch portfolio categories
        const categoriesResponse = await fetch('/api/portfolio/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();

        setPortfolioItems(Array.isArray(portfolioItems) ? portfolioItems : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData.categories || []));
        setError(null);

        console.log('Portfolio component: Final state - portfolios:', portfolioItems.length, 'categories:', categoriesData.length || 0);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');

        // No fallback data - show real error to user
        setPortfolioItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter portfolio berdasarkan kategori
  const filteredPortfolio = selectedCategory === 'all'
    ? portfolioItems.filter(item => item.published)
    : portfolioItems.filter(item =>
      item.published &&
      (item.categorySlug === selectedCategory || item.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase()))
    );

  // Limit to 6 items for home page
  const displayedItems = filteredPortfolio.slice(0, 6);

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-14">
            <Heading variant="h1" className="text-2xl md:text-3xl font-bold mb-3">
              {t('portfolio.title.main')} <span className="text-primary">{t('portfolio.title.highlight')}</span>
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 aspect-[4/3] rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-14">
          <AnimatedText as="div">
            <Heading variant="h1" className="text-2xl md:text-3xl font-bold mb-3">
              {t('portfolio.title.main')} <span className="text-primary">{t('portfolio.title.highlight')}</span>
            </Heading>
          </AnimatedText>
          <AnimatedText as="div">
            <Text color="secondary" className="max-w-2xl mx-auto text-sm md:text-base">
              {t('portfolio.subtitle')}
            </Text>
          </AnimatedText>
        </div>

        {/* Category Filter */}
        <AnimatedText as="div">
          <div className="flex justify-center mb-8">
            <div className="inline-flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden transition-colors duration-300">
              <button
                onClick={() => handleCategoryFilter('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${selectedCategory === 'all'
                  ? 'bg-primary text-white dark:bg-green-600'
                  : 'text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                {t('portfolio.filter.all')}
              </button>
              {categories.slice(0, 3).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.slug)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${selectedCategory === category.slug
                    ? 'bg-primary text-white dark:bg-green-600'
                    : 'text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* Error Message */}
        {error && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-md">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Using demo data - {error}
            </div>
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedItems.map((item) => {
            // Parse images if it's a string
            let displayImage = item.featured_image || '/images/placeholder.jpg';
            if (item.images && typeof item.images === 'string') {
              try {
                const parsedImages = JSON.parse(item.images);
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  displayImage = parsedImages[0].url || parsedImages[0] || displayImage;
                }
              } catch (e) {
                // Keep default image if parsing fails
              }
            }

            return (
              <Link
                key={item.id}
                href={`/portfolio/${item.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 block"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={displayImage}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-white dark:text-gray-100 font-semibold text-lg mb-1 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-white/80 dark:text-gray-300 text-sm transition-colors duration-300">
                      {item.categoryName || 'Portfolio'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-secondary dark:text-gray-400 text-sm mb-3 transition-colors duration-300">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-primary dark:text-green-400 text-xs font-medium transition-colors duration-300">
                      {item.categoryName || 'Portfolio'}
                    </p>
                    {item.client_name && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.client_name}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Show message if no items */}
        {filteredPortfolio.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No portfolio items found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedCategory === 'all'
                ? 'No portfolio items are currently available.'
                : `No portfolio items found in ${selectedCategory} category.`}
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link href="/portfolio">
            <Button variant="outline" size="md" className="px-6 py-3 border-primary text-primary hover:bg-primary/5 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-600/10 transition-colors duration-300">
              {t('portfolio.viewAll')} {portfolioItems.length > 0 && `(${portfolioItems.filter(p => p.published).length})`}
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[15%] h-[25%] opacity-50 pointer-events-none">
        <div className="grid grid-cols-4 gap-1.5 h-full">
          {Array(20).fill(0).map((_, i) => (
            <div key={`portfolio-decor-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary opacity-30"></div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-[10%] h-[20%] opacity-50 pointer-events-none">
        <div className="grid grid-cols-3 gap-1.5 h-full">
          {Array(15).fill(0).map((_, i) => (
            <div key={`portfolio-decor-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary opacity-30"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
