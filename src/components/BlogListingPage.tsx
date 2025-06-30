"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { blogService, BlogPost } from '@/services/BlogService.api';
import { FiSearch, FiClock, FiEye, FiTrendingUp, FiGrid, FiList, FiBookmark, FiShare2, FiHome, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { generateArticleSchema } from '@/lib/jsonld';
import { Navbar, WhatsAppChat } from '@/components';

// Utility function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Breadcrumb Component
const Breadcrumb: React.FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-8">
      <Link href="/" className="flex items-center hover:text-primary transition-colors">
        <FiHome className="mr-1" size={16} />
        <span>{t('nav.home') || 'Home'}</span>
      </Link>
      <FiChevronRight size={16} className="text-gray-400" />
      <span className="text-primary font-medium">{t('nav.blog') || 'Blog'}</span>
    </nav>
  );
};

// Modern BlogPostCard with Tokopedia-inspired design
const ModernBlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 group cursor-pointer h-full flex flex-col">
        {/* Modern Image with badges */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white dark:bg-gray-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
              {typeof post.category === 'string' ? post.category : post.category.name}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col text-gray-800 dark:text-gray-100 transition-colors duration-300">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center">
              <FiClock className="mr-1" size={12} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center">
              <FiEye className="mr-1" size={12} />
              {post.views || 0} views
            </span>
          </div>

          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto flex justify-between items-center">
            {/* Author info */}
            <div className="flex items-center">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full mr-2 border border-gray-200 dark:border-gray-600"
                />
              )}
              <span className="text-xs font-medium">{post.author.name}</span>
            </div>

            {/* Action icons */}
            <div className="flex space-x-2">
              <button onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }} className="text-gray-400 hover:text-primary transition-colors">
                <FiBookmark size={14} className={isBookmarked ? "fill-primary text-primary" : ""} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <FiShare2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

// Main Blog Listing Page Component
export default function BlogListingPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode based on user preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check localStorage
      const savedMode = localStorage.getItem('darkMode');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const shouldEnableDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

      setIsDarkMode(shouldEnableDarkMode);

      // Apply dark mode class if needed
      if (shouldEnableDarkMode) {
        document.documentElement.classList.add('dark');
      }

      // Listen for storage changes to sync dark mode across tabs/pages
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

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;

      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save preference to localStorage
      localStorage.setItem('darkMode', newMode ? 'true' : 'false');

      return newMode;
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await blogService.getAllPosts();
        setPosts(allPosts);
        setFilteredPosts(allPosts);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(allPosts.map(post =>
          typeof post.category === 'string' ? post.category : post.category.name
        )));

        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let results = [...posts];

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(post => {
        const postCategory = typeof post.category === 'string' ? post.category : post.category.name;
        return postCategory === selectedCategory;
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(results);
  }, [searchQuery, selectedCategory, posts]);

  // Generate JSON-LD for blog listing
  const blogListingSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "Bajramedia Blog - Insights & Articles",
    "description": "Latest articles, news, and insights about web development, mobile apps, UI/UX design, and digital marketing.",
    "url": "https://bajramedia.com/blog",
    "blogPost": filteredPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.featuredImage,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "url": `https://bajramedia.com/blog/${post.slug}`
    }))
  };

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListingSchema) }}
      />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Header/Navbar */}
        <Navbar variant="default" activeTab="blog" />

        {/* Main Content */}
        <div className="pt-24 pb-16">
          {/* Breadcrumb */}
          <div className="w-[95%] mx-auto px-4 pt-6">
            <Breadcrumb />
          </div>

          {/* Modern Blog Header */}
          <div className="w-[95%] mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-block bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full mb-4">
                <span className="text-sm font-medium text-primary">{t('blog.badge')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('blog.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('blog.subtitle')}
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-grow max-w-md">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={t('blog.searchPlaceholder')}
                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-4">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? t('blog.filter.all') : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-gray-800 transition-colors duration-300">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700 text-primary' : 'text-gray-400'} transition-colors duration-300`}
                    >
                      <FiGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-primary' : 'text-gray-400'} transition-colors duration-300`}
                    >
                      <FiList size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse transition-colors duration-300">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-5">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  <FiSearch size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('blog.noArticles')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('blog.adjustFilter')}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <div key={post.id} className="h-full">
                    <ModernBlogPostCard post={post} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group">
                    <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row h-full">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5 md:w-2/3 flex flex-col">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 transition-colors duration-300">
                            {typeof post.category === 'object' ? post.category.name : post.category}
                          </span>
                          <div className="flex items-center">
                            <FiClock className="mr-1" size={12} />
                            {formatDate(post.date)}
                          </div>
                        </div>

                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex items-center">
                            {post.author.avatar && (
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-8 h-8 rounded-full mr-3 border border-gray-200 dark:border-gray-600"
                              />
                            )}
                            <span className="text-sm font-medium">{post.author.name}</span>
                          </div>

                          <div className="text-primary font-medium text-sm flex items-center">
                            {t('blog.readMore')}
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Trending Articles */}
            {!loading && filteredPosts.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center mb-6">
                  <FiTrendingUp className="text-primary mr-2" size={20} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('blog.trending')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {posts.slice(0, 3).map(post => (
                    <Link href={`/blog/${post.slug}`} key={`trending-${post.id}`} className="group">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100">
                            {post.title}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <FiEye className="mr-1" size={12} />
                              {post.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Chat */}
        <WhatsAppChat
          phoneNumber="6285739402436"
          message="Halo! Saya tertarik dengan layanan Bajramedia. Bisa konsultasi gratis?"
        />
      </div>
    </>
  );
}
