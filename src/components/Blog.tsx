"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  return (

    <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group h-full flex flex-col border border-gray-100 dark:border-gray-700">
      {/* Enhanced Blog Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Enhanced category badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-lg transition-colors duration-300">
            <FiTag className="mr-2 text-primary" size={12} />
            {typeof post.category === 'string' ? post.category : post.category.name}
          </span>
        </div>
        {/* Reading time indicator */}
        {post.readTime && (
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary/90 text-white backdrop-blur-sm">
              <FiCalendar className="mr-1" size={12} />
              {post.readTime} min
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Content */}
      <div className="px-6 pt-6 pb-8 flex flex-col flex-grow">        {/* Date and metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
          <span className="font-medium">{formatDate(post.date)}</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <FiEye size={14} />
              <span>{post.views || 0}</span>
            </div>            {post.readTime && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs transition-colors duration-300">
                {post.readTime} min
              </span>
            )}
          </div>
        </div>

        {/* Enhanced title */}
        <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight text-gray-900 dark:text-gray-100">
          {post.title}
        </h3>

        {/* Enhanced excerpt */}
        <p className="text-gray-600 dark:text-gray-300 text-base mb-6 line-clamp-3 flex-grow leading-relaxed transition-colors duration-300">
          {post.excerpt}
        </p>

        {/* Enhanced Author and Read More */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">          <div className="flex items-center">
          {post.author.avatar && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 ring-2 ring-gray-100 dark:ring-gray-600 transition-colors duration-300">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 block transition-colors duration-300">{post.author.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Author</span>
          </div>
        </div>

          {/* Enhanced read more button */}
          <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
            <span className="mr-2">Read More</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <FiArrowRight size={14} />
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

        // If API fails, use fallback static content
        if (featuredPosts.length === 0) {
          console.log('📝 Using fallback blog content...');
          setPosts([
            {
              id: '1',
              title: 'Digital Transformation for Modern Business',
              slug: 'digital-transformation-modern-business',
              excerpt: 'Discover how digital transformation can revolutionize your business operations and drive growth in the modern marketplace.',
              content: '',
              featuredImage: '/images/team-meeting.jpg',
              date: '2024-01-15',
              createdAt: '2024-01-15',
              readTime: 5,
              published: true,
              featured: true,
              author: {
                id: '1',
                name: 'Bajra Team',
                email: 'team@bajramedia.com',
                avatar: '/images/team/admin-avatar.jpg',
                bio: 'Expert digital solutions team'
              },
              category: {
                id: '1',
                name: 'Technology',
                slug: 'technology'
              },
              tags: [],
              views: 120
            },
            {
              id: '2',
              title: 'UI/UX Design Trends 2024',
              slug: 'uiux-design-trends-2024',
              excerpt: 'Explore the latest UI/UX design trends that will shape digital experiences in 2024 and beyond.',
              content: '',
              featuredImage: '/images/team-meeting-2.jpg',
              date: '2024-01-10',
              createdAt: '2024-01-10',
              readTime: 7,
              published: true,
              featured: true,
              author: {
                id: '1',
                name: 'Bajra Team',
                email: 'team@bajramedia.com',
                avatar: '/images/team/admin-avatar.jpg',
                bio: 'Expert digital solutions team'
              },
              category: {
                id: '2',
                name: 'Design',
                slug: 'design'
              },
              tags: [],
              views: 95
            },
            {
              id: '3',
              title: 'Custom Software Development Guide',
              slug: 'custom-software-development-guide',
              excerpt: 'A comprehensive guide to custom software development for businesses looking to scale and optimize their operations.',
              content: '',
              featuredImage: '/images/team-meeting-alt.jpg',
              date: '2024-01-05',
              createdAt: '2024-01-05',
              readTime: 6,
              published: true,
              featured: true,
              author: {
                id: '1',
                name: 'Bajra Team',
                email: 'team@bajramedia.com',
                avatar: '/images/team/admin-avatar.jpg',
                bio: 'Expert digital solutions team'
              },
              category: {
                id: '3',
                name: 'Development',
                slug: 'development'
              },
              tags: [],
              views: 150
            }
          ]);
        } else {
          setPosts(featuredPosts);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        // Use fallback content on error
        console.log('📝 Using fallback blog content due to error...');
        setPosts([
          {
            id: '1',
            title: 'Digital Transformation for Modern Business',
            slug: 'digital-transformation-modern-business',
            excerpt: 'Discover how digital transformation can revolutionize your business operations and drive growth in the modern marketplace.',
            content: '',
            featuredImage: '/images/team-meeting.jpg',
            date: '2024-01-15',
            createdAt: '2024-01-15',
            readTime: 5,
            published: true,
            featured: true,
            author: {
              id: '1',
              name: 'Bajra Team',
              email: 'team@bajramedia.com',
              avatar: '/images/team/admin-avatar.jpg',
              bio: 'Expert digital solutions team'
            },
            category: {
              id: '1',
              name: 'Technology',
              slug: 'technology'
            },
            tags: [],
            views: 120
          },
          {
            id: '2',
            title: 'UI/UX Design Trends 2024',
            slug: 'uiux-design-trends-2024',
            excerpt: 'Explore the latest UI/UX design trends that will shape digital experiences in 2024 and beyond.',
            content: '',
            featuredImage: '/images/team-meeting-2.jpg',
            date: '2024-01-10',
            createdAt: '2024-01-10',
            readTime: 7,
            published: true,
            featured: true,
            author: {
              id: '1',
              name: 'Bajra Team',
              email: 'team@bajramedia.com',
              avatar: '/images/team/admin-avatar.jpg',
              bio: 'Expert digital solutions team'
            },
            category: {
              id: '2',
              name: 'Design',
              slug: 'design'
            },
            tags: [],
            views: 95
          },
          {
            id: '3',
            title: 'Custom Software Development Guide',
            slug: 'custom-software-development-guide',
            excerpt: 'A comprehensive guide to custom software development for businesses looking to scale and optimize their operations.',
            content: '',
            featuredImage: '/images/team-meeting-alt.jpg',
            date: '2024-01-05',
            createdAt: '2024-01-05',
            readTime: 6,
            published: true,
            featured: true,
            author: {
              id: '1',
              name: 'Bajra Team',
              email: 'team@bajramedia.com',
              avatar: '/images/team/admin-avatar.jpg',
              bio: 'Expert digital solutions team'
            },
            category: {
              id: '3',
              name: 'Development',
              slug: 'development'
            },
            tags: [],
            views: 150
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  return (
    <section className={`py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <AnimatedText as="div">
            <div className="inline-block mb-3">
              <span
                className="px-4 py-1.5 rounded-full text-base font-semibold dark:bg-primary/20 dark:text-primary transition-colors duration-300"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                {t('blog.label') || 'Our Blog'}
              </span>
            </div>
          </AnimatedText>
          <AnimatedText as="div">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
              {t('blog.title') || 'Latest Insights & Articles'}
            </h2>
          </AnimatedText>
          <AnimatedText as="div">
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              {t('blog.description') || 'Stay updated with our latest thinking on digital strategy, design trends, technology innovations, and more.'}
            </p>
          </AnimatedText>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">          {loading ? (
          // Loading skeleton
          [...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden h-full p-4 animate-pulse transition-colors duration-300">
              <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full rounded-lg mb-4 transition-colors duration-300"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3 transition-colors duration-300"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 transition-colors duration-300"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 transition-colors duration-300"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 transition-colors duration-300"></div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="col-span-3 py-10 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
            {t('blog.noPosts') || 'No blog posts available at the moment.'}
          </div>) : (
          posts.map(post => (
            <AnimatedText key={post.id} as="div" className="h-full">
              <a href={`/blog/${post.slug}`} className="block h-full">
                <BlogPostCard post={post} />
              </a>
            </AnimatedText>
          ))
        )}
        </div>
        {/* View All Button */}
        <div className="mt-12 text-center">
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
