"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedText from './AnimatedText';
import { getFallbackData, formatPortfolioForDisplay } from '@/utils/fallback-data';
import { ArrowUpRight, Eye, Calendar, User, Sparkles } from 'lucide-react';

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

  if (loading) {
    console.log('🎯 Portfolio component: Rendering LOADING state');
    return (
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 relative overflow-hidden transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-[80%] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          
          {/* Filter skeleton */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
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
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 relative overflow-hidden transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-gray-200/40 dark:border-gray-700/40 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-green-400/10 to-blue-600/10 rounded-lg rotate-45"></div>
      </div>
      
      <div className="w-[80%] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <AnimatedText as="div">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/20 dark:border-blue-700/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Our Portfolio</span>
            </div>
          </AnimatedText>
          
          <AnimatedText as="div">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              {t('portfolio.title.main') || 'Creative'} <span className="relative">
                {t('portfolio.title.highlight') || 'Works'}
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </span>
            </h2>
          </AnimatedText>
          
          <AnimatedText as="div">
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('portfolio.subtitle') || 'Explore our latest projects and see how we turn innovative ideas into stunning digital experiences that make a difference.'}
            </p>
          </AnimatedText>
        </div>

        {/* Modern Category Filter */}
        <AnimatedText as="div">
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-3 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <button
                onClick={() => handleCategoryFilter('all')}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('portfolio.filter.all') || 'All Projects'}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.slug)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.slug
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* Modern Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedItems.map((item, index) => {
            // Parse images if it's a string
            let displayImage = getFieldValue(item, 'image');
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
              <AnimatedText key={item.id} as="div" className="h-full">
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="group block h-full"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 h-full transform hover:-translate-y-2">
                    {/* Image Container with Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={displayImage}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.jpg';
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200/20 dark:border-gray-700/20">
                          <span>{item.categoryIcon || '📁'}</span>
                          {item.categoryName || 'Portfolio'}
                        </span>
                      </div>
                      
                      {/* Featured Badge */}
                      {item.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        </div>
                      )}
                      
                      {/* Hover Action */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                          <ArrowUpRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {getFieldValue(item, 'description')}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-4">
                          {getFieldValue(item, 'client') && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{getFieldValue(item, 'client')}</span>
                            </div>
                          )}
                          {getFieldValue(item, 'date') && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(getFieldValue(item, 'date') as string).getFullYear()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{getFieldValue(item, 'views')}</span>
                        </div>
                      </div>
                      
                      {/* Technologies */}
                      {item.technologies && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.technologies.split(',').slice(0, 3).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md text-gray-600 dark:text-gray-400"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                          View Project
                        </span>
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedText>
            );
          })}
        </div>

        {/* Show message if no items */}
        {filteredPortfolio.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedCategory === 'all'
                ? 'No portfolio items are currently available.'
                : `No projects found in ${selectedCategory} category.`}
            </p>
          </div>
        )}

        {/* Modern View All Button */}
        <div className="text-center mt-12">
          <AnimatedText as="div">
            <Link href="/portfolio">
              <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25">
                <span>Explore All Projects</span>
                {portfolioItems.length > 0 && (
                  <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
                    {portfolioItems.filter(p => p.published).length}
                  </span>
                )}
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </AnimatedText>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
