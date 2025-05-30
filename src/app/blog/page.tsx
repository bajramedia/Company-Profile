"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AnimatedText } from '@/components';
import { blogService, BlogPost } from '@/services/BlogService';
import { FiSearch, FiClock, FiEye, FiTrendingUp } from 'react-icons/fi';

// Enhanced BlogPostCard for better visual appeal
const EnhancedBlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const primaryColor = "rgb(3, 177, 80)";
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <article className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group h-full flex flex-col">
      {/* Enhanced Image with overlay effects */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category badge with improved styling */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg">
            {typeof post.category === 'string' ? post.category : post.category.name}
          </span>
        </div>
        
        {/* Reading time indicator */}
        {post.readTime && (
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary/90 text-white backdrop-blur-sm">
              <FiClock className="mr-1" size={12} />
              {post.readTime} min
            </span>
          </div>
        )}
      </div>
      
      {/* Enhanced Content */}
      <div className="px-6 pt-6 pb-8 flex flex-col flex-grow">
        {/* Date and metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="font-medium">{formatDate(post.date)}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <FiEye className="mr-1" size={12} />
              {Math.floor(Math.random() * 1000) + 100}
            </span>
            <span className="flex items-center">
              <FiTrendingUp className="mr-1" size={12} />
              Popular
            </span>
          </div>
        </div>
        
        {/* Title with better typography */}
        <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
          {post.title}
        </h3>
        
        {/* Excerpt with improved spacing */}
        <p className="text-gray-600 text-base mb-6 line-clamp-3 flex-grow leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* Enhanced Author section */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center">
            {post.author.avatar && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 ring-2 ring-gray-100">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <span className="text-sm font-semibold text-gray-900 block">{post.author.name}</span>
              <span className="text-xs text-gray-500">Author</span>
            </div>
          </div>
          
          {/* Improved read more button */}
          <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
            <span className="mr-2">Read More</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              →
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default function BlogPage() {
  const { t } = useLanguage();
  const primaryColor = "rgb(3, 177, 80)";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        if (searchQuery.trim()) {
          const searchResults = await blogService.searchPosts(searchQuery);
          setPosts(searchResults);
          setTotalPosts(searchResults.length);
        } else if (currentCategory) {
          const categoryPosts = await blogService.getPostsByCategory(currentCategory, 12);
          setPosts(categoryPosts);
          setTotalPosts(categoryPosts.length);
        } else {
          const result = await blogService.getAllPosts(1, 12);
          setPosts(result.posts);
          setTotalPosts(result.total);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [searchQuery, currentCategory]);
  
  return (    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Hero Section with enhanced gradient background */}
        <div className="relative text-center mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-3xl blur-3xl -z-10"></div>
          
          <AnimatedText as="h1">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary to-blue-600 bg-clip-text text-transparent">
              {t('blog.pageTitle') || 'Insights & Stories'}
            </h1>
          </AnimatedText>
          
          <AnimatedText as="p">
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              {t('blog.pageDescription') || 'Discover expert insights, industry trends, and actionable strategies to grow your business and stay ahead of the curve.'}
            </p>
          </AnimatedText>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <FiSearch className="absolute top-1/2 -translate-y-1/2 left-6 text-gray-400" size={22} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('blog.searchPlaceholder') || 'Search for articles, insights, and guides...'}
                className="w-full py-4 pl-16 pr-6 bg-white border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-lg"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium">
                  Search
                </div>
              </div>
            </div>
          </div>
          
          {/* Article count and stats */}
          <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              <span>{totalPosts} Articles</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Expert Insights</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>Weekly Updates</span>
            </div>
          </div>
        </div>        
        {/* Enhanced Blog Posts Grid with improved spacing and cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
          {loading ? (
            // Enhanced loading skeleton
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden h-full p-6 animate-pulse">
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-56 w-full rounded-2xl mb-6"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-3 py-20 text-center">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-700">
                {t('blog.noPosts') || 'No blog posts found'}
              </h3>
              <p className="text-lg text-gray-500 max-w-md mx-auto">
                {searchQuery 
                  ? (t('blog.noSearchResults') || 'Try using different keywords or browse all articles')
                  : (t('blog.noPostsDescription') || "We'll be adding new content soon. Please check back later!")}
              </p>
            </div>
          ) : (
            posts.map(post => (
              <AnimatedText key={post.id} as="div" className="h-full">
                <a href={`/blog/${post.slug}`} className="block h-full group">
                  <EnhancedBlogPostCard post={post} />
                </a>
              </AnimatedText>
            ))
          )}
        </div>
          {/* Enhanced Pagination with better design */}
        {!loading && posts.length > 0 && (
          <div className="flex flex-col items-center space-y-6">
            {/* Pagination controls */}
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
                disabled={true}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('blog.previous') || 'Previous'}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="px-4 py-3 bg-primary text-white rounded-xl font-semibold shadow-md">
                  1
                </div>
                <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                  2
                </div>
                <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                  3
                </div>
                <span className="px-2 text-gray-400">...</span>
                <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                  12
                </div>
              </div>
              
              <button
                className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
                disabled={true}
              >
                {t('blog.next') || 'Next'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Page info */}
            <div className="text-sm text-gray-500">
              Showing 1-12 of {totalPosts} articles
            </div>
          </div>
        )}
        
        {/* Newsletter signup section */}
        <div className="mt-20 bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with Our Latest Insights
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get weekly updates on digital marketing trends, design tips, and business growth strategies directly in your inbox.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-l-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-8 py-4 bg-white text-primary font-semibold rounded-r-xl hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
