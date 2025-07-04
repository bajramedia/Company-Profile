"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedText from './AnimatedText';
import { FiCalendar, FiArrowRight, FiTag, FiEye } from 'react-icons/fi';
import { blogService, BlogPost } from '@/services/BlogService.api';

interface BlogProps {
  className?: string;
  posts?: BlogPost[];
  loading?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const primaryColor = "rgb(3, 177, 80)";

  // View tracking function
  const handlePostClick = async () => {
    try {
      await fetch(`/api/posts/${post.slug}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group h-full flex flex-col border border-gray-100 dark:border-gray-700">
      {/* Smaller Blog Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

        {/* Improved image handling with fallback */}
        {post.featuredImage && post.featuredImage.trim() !== '' ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-500/10 to-blue-500/10 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Blog Image</p>
            </div>
          </div>
        )}

        {/* Compact category badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-lg transition-colors duration-300">
            <FiTag className="mr-1 text-primary" size={10} />
            {typeof post.category === 'string' ? post.category : post.category.name}
          </span>
        </div>
        {/* Reading time indicator */}
        {post.readTime && (
          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-primary/90 text-white backdrop-blur-sm">
              <FiCalendar className="mr-1" size={10} />
              {post.readTime} min
            </span>
          </div>
        )}
      </div>

      {/* More Compact Content */}
      <div className="px-5 pt-5 pb-6 flex flex-col flex-grow">
        {/* Date and metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300">
          <span className="font-medium">{formatDate(post.date)}</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <FiEye size={12} />
              <span>{post.views || 0}</span>
            </div>
            {post.readTime && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs transition-colors duration-300">
                {post.readTime} min
              </span>
            )}
          </div>
        </div>

        {/* Compact title */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight text-gray-900 dark:text-gray-100">
          {post.title}
        </h3>

        {/* Compact excerpt */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed transition-colors duration-300">
          {post.excerpt}
        </p>

        {/* Compact Author and Read More */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center">
            {/* Smaller author avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 ring-2 ring-gray-100 dark:ring-gray-600 transition-colors duration-300">
              {post.author.avatar && post.author.avatar.trim() !== '' ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/team/default-avatar.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
                  {(post.author.name || 'A').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 block transition-colors duration-300">
                {post.author.name || 'Admin User'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Author</span>
            </div>
          </div>

          {/* Compact read more button */}
          <div className="flex items-center text-primary font-semibold text-xs group-hover:translate-x-1 transition-transform duration-300">
            <span className="mr-1">Read More</span>
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <FiArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const Blog: React.FC<BlogProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  const primaryColor = "rgb(3, 177, 80)";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Get featured blog posts from the service
        const featuredPosts = await blogService.getFeaturedPosts(3);
        setPosts(featuredPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className={`py-16 md:py-20 bg-white dark:bg-gray-900 transition-colors duration-300 ${className}`}>
      <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header - Consistent with Portfolio */}
        <div className="text-center mb-12">
          <AnimatedText as="div">
            <div className="inline-block mb-3">
              <span
                className="px-4 py-1.5 rounded-full text-sm font-semibold dark:bg-primary/20 dark:text-primary transition-colors duration-300"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                {t('blog.label') || 'Our Blog'}
              </span>
            </div>
          </AnimatedText>
          <AnimatedText as="div">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300">
              {t('blog.title') || 'Latest Insights & Articles'}
            </h2>
          </AnimatedText>
          <AnimatedText as="div">
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg transition-colors duration-300">
              {t('blog.description') || 'Stay updated with our latest thinking on digital strategy, design trends, technology innovations, and more.'}
            </p>
          </AnimatedText>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full p-4 animate-pulse transition-colors duration-300">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full rounded-lg mb-4 transition-colors duration-300"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3 transition-colors duration-300"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 transition-colors duration-300"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 transition-colors duration-300"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 transition-colors duration-300"></div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-3 py-10 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
              {t('blog.noPosts') || 'No blog posts available at the moment.'}
            </div>
          ) : (
            posts.map(post => (
              <AnimatedText key={post.id} as="div" className="h-full">
                <Link href={`/blog/${post.slug}`} className="block h-full cursor-pointer">
                  <BlogPostCard post={post} />
                </Link>
              </AnimatedText>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <AnimatedText as="div">
            <a href="/blog">
              <button
                className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                  boxShadow: `0 4px 14px ${primaryColor}30`
                }}
              >
                {t('blog.Button') || 'View All Articles'}
                <FiArrowRight className="ml-2" />
              </button>
            </a>
          </AnimatedText>
        </div>
      </div>
    </section>
  );
};

export default Blog;
