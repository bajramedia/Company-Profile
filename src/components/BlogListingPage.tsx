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
import Image from 'next/image';

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
          <Image
            src={post.featuredImage || '/images/placeholder.jpg'}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={true}
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
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={24}
                  height={24}
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListingSchema) }}
        />
      </Head>

      <Navbar variant="solid" activeTab="blog" />

      {/* Hero Section */}
      <section className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
          <Breadcrumb />
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('blog.title') || 'Blog & Articles'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('blog.subtitle') || 'Latest Digital Insights'}
            </p>
          </div>
        </div>
      </section>

      <main className="py-12">
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder={t('blog.search.placeholder') || 'Search articles...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* View Mode and Category Filter */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? (t('all') || 'All Categories') : category}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <FiList size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            // No Results State
            <div className="text-center py-12">
              <FiSearch size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('blog.noResults') || 'No articles found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('blog.tryAgain') || 'Try adjusting your search or filter to find what you\'re looking for.'}
              </p>
            </div>
          ) : (
            // Blog Posts Grid/List
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-8'
            }>
              {filteredPosts.map((post) => (
                <ModernBlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* WhatsApp Chat */}
      <WhatsAppChat
        phoneNumber="6285739402436"
        message={t('whatsapp.message') || "Hi! I'm interested in discussing content collaboration with Bajramedia."}
      />
    </div>
  );
}
