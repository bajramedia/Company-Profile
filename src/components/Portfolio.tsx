"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedText from './AnimatedText';
import { getFallbackData, formatPortfolioForDisplay } from '@/utils/fallback-data';
import { ArrowUpRight, Eye, Calendar, User, Sparkles } from 'lucide-react';
import { colors } from './colors';

interface PortfolioItem {
  id: number;
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  featuredImage?: string;
  featured_image?: string;
  images?: string;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  categoryIcon?: string;
  published: boolean;
  featured: boolean;
  clientName?: string;
  client_name?: string;
  projectUrl?: string;
  project_url?: string;
  technologies?: string;
  createdAt?: string;
  date?: string;
  views?: number;
  viewCount?: number;
}

interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

const Portfolio: React.FC = () => {
  console.log('🎯 Portfolio component: Starting to render');

  const { t } = useLanguage();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  console.log('🎯 Portfolio component: Current state -', {
    portfolioItems: portfolioItems.length,
    categories: categories.length,
    loading,
    error,
    selectedCategory
  });

  // Fetch portfolio data dan categories
  useEffect(() => {
    console.log('🎯 Portfolio component: useEffect triggered');
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

        console.log('🎯 Portfolio component: Final state - portfolios:', portfolioItems.length, 'categories:', categoriesData.length || 0);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        console.log('🔄 API connection failed, loading fallback data...');
        
        // Use fallback dummy data instead of showing error
        const fallbackData = getFallbackData();
        const formattedPortfolioItems = formatPortfolioForDisplay(fallbackData.portfolioItems);
        
        setPortfolioItems(formattedPortfolioItems);
        setCategories(fallbackData.portfolioCategories);
        setError(null); // Clear error since we have fallback data
        
        console.log('✅ Fallback data loaded successfully:', formattedPortfolioItems.length, 'items');
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

  // Helper function to get the correct field value
  const getFieldValue = (item: PortfolioItem, field: 'image' | 'description' | 'client' | 'projectUrl' | 'date' | 'views') => {
    switch (field) {
      case 'image':
        return item.featuredImage || item.featured_image || '/images/placeholder.jpg';
      case 'description':
        return item.description || item.excerpt || '';
      case 'client':
        return item.clientName || item.client_name || '';
      case 'projectUrl':
        return item.projectUrl || item.project_url || '';
      case 'date':
        return item.createdAt || item.date || '';
      case 'views':
        return item.viewCount || item.views || 0;
      default:
        return '';
    }
  };

  const getImageSrc = (item: PortfolioItem): string => {
    return item.featuredImage || item.featured_image || '/images/placeholder.jpg';
  };

  if (loading) {
    console.log('🎯 Portfolio component: Rendering LOADING state');
    return (
      <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  console.log('🎯 Portfolio component: Rendering MAIN component with', displayedItems.length, 'items');

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <AnimatedText as="div">
            <span className="inline-block text-sm font-medium text-[#00D084] mb-2">
              {t('portfolio.subtitle') || 'Portfolio Kami'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('portfolio.title') || 'Proyek Terbaru'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('portfolio.description') || 'Lihat bagaimana kami mengubah ide menjadi kenyataan dengan teknologi terkini dan solusi kreatif.'}
            </p>
          </AnimatedText>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => handleCategoryFilter('all')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                ? 'bg-[#00D084] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#00D084] hover:text-white'
                }`}
              >
            {t('portfolio.filter.all') || 'All'}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.slug)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.slug
                  ? 'bg-[#00D084] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#00D084] hover:text-white'
                  }`}
                >
              {category.name}
                </button>
              ))}
            </div>

        {/* Portfolio Grid */}
        {displayedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedItems.map((item) => (
              <Link href={`/portfolio/${item.slug}`} key={item.id}>
                <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                      <Image
                      src={getImageSrc(item)}
                        alt={item.title}
                        fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-[#00D084] text-white text-xs font-medium rounded-full">
                        {item.categoryName}
                          </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#00D084] transition-colors">
                        {item.title}
                      </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {getFieldValue(item, 'description')}
                      </p>
                      
                      {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(getFieldValue(item, 'date')).toLocaleDateString()}
                            </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {getFieldValue(item, 'views')}
                        </span>
                        </div>
                      <ArrowUpRight className="w-5 h-5 text-[#00D084] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
            ))}
        </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-4 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {t('portfolio.comingSoon.title') || 'Coming Soon!'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {t('portfolio.comingSoon.description') || 'We are preparing new portfolios. Stay tuned!'}
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
            <Link href="/portfolio">
            <button className="inline-flex items-center px-8 py-3 rounded-full bg-[#00D084] text-white font-medium hover:bg-[#00B873] transition-colors duration-300">
              {t('portfolio.viewAll') || 'View All Projects'}
              <ArrowUpRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
