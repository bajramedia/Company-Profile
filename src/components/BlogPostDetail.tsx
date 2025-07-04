"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { BlogPostCard } from '@/components/Blog';
import SocialShare from '@/components/SocialShare';
import { BlogPost } from '@/services/BlogService.api';
import { useViewTracker, useViewCounter } from '@/hooks/useViewTracker';
import { SocialShareService } from '@/services/SocialShareService';
import { FiCalendar, FiClock, FiTag, FiArrowLeft, FiEye, FiTwitter, FiLinkedin, FiFacebook, FiCopy, FiShare2 } from 'react-icons/fi';
import Script from 'next/script';
import { generateArticleSchema, generateFAQSchema, FAQ } from '@/lib/jsonld';

interface BlogPostDetailProps {
  post: BlogPost;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  const { t } = useLanguage();
  const primaryColor = "rgb(3, 177, 80)";
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isShowingMobileToc, setIsShowingMobileToc] = useState(false);

  // Initialize view tracking
  const { viewCount: trackedViewCount, hasTracked } = useViewTracker({
    type: 'blog',
    slug: post?.slug || '',
    title: post?.title,
    initialViews: post?.views || 0
  });
  const [shareMessage, setShareMessage] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Table of contents state
  const [showToc, setShowToc] = useState(false);
  const [tocItems, setTocItems] = useState<{ id: string; title: string; level: number }[]>([]);

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

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(progress);

        // Show back to top button after scrolling 300px
        setShowBackToTop(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Extract headings for table of contents
  useEffect(() => {
    if (typeof window !== 'undefined' && post?.content) {
      const articleContent = document.getElementById('article-content');
      if (articleContent) {
        const headings = articleContent.querySelectorAll('h2, h3, h4');

        const items = Array.from(headings).map(heading => {
          const id = heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
          if (!heading.id) heading.id = id;

          return {
            id,
            title: heading.textContent || '',
            level: parseInt(heading.tagName.substring(1)) // Get heading level (h2 -> 2)
          };
        });

        setTocItems(items);
        setShowToc(items.length > 0);
      }
    }
  }, [post]);

  // Extract FAQs from blog content
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && post?.content) {
      setTimeout(() => {
        const articleContent = document.getElementById('article-content');
        if (articleContent) {
          // Find all h2 or h3 elements that might be questions
          const possibleQuestionElements = articleContent.querySelectorAll('h2, h3');
          const extractedFAQs: FAQ[] = [];

          possibleQuestionElements.forEach(questionEl => {
            // Check if heading text ends with a question mark or contains typical FAQ words
            const questionText = questionEl.textContent || '';
            const isQuestion = questionText.trim().endsWith('?') ||
              /what|how|why|when|where|is|can|should|will|do/i.test(questionText.toLowerCase());

            if (isQuestion) {
              // Find the answer - all content until the next heading
              let answerHTML = '';
              let currentNode = questionEl.nextElementSibling;

              while (currentNode && !['H2', 'H3', 'H4'].includes(currentNode.tagName)) {
                answerHTML += currentNode.outerHTML;
                currentNode = currentNode.nextElementSibling;
              }

              if (answerHTML) {
                extractedFAQs.push({
                  question: questionText,
                  answer: answerHTML
                });
              }
            }
          });

          setFaqs(extractedFAQs);
        }
      }, 1000); // Allow time for content to render
    }
  }, [post]);

  // Generate structured data for the article
  const articleSchema = post ? generateArticleSchema({
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.date,
    author: {
      name: typeof post.author === 'object' ? post.author.name : 'Bajramedia Team',
      url: 'https://bajramedia.com/about'
    },
    publisher: {
      name: 'Bajramedia',
      logo: 'https://bajramedia.com/images/logo.png'
    },
    url: `https://bajramedia.com/blog/${post.slug}`
  }) : null;

  // Generate FAQ schema if FAQs were detected in the content
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  // Scroll to heading when clicking TOC item
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Header height offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Close mobile TOC if open
      setIsShowingMobileToc(false);
    }
  };

  // Handle copy link to clipboard
  const copyToClipboard = () => {
    const url = `https://bajramedia.com/blog/${post?.slug}`;
    navigator.clipboard.writeText(url).then(
      () => {
        setShareMessage("Link copied to clipboard!");
        setTimeout(() => setShareMessage(""), 3000);
      },
      () => {
        setShareMessage("Failed to copy link");
        setTimeout(() => setShareMessage(""), 3000);
      }
    );
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Post not found
          </h2>
          <Link href="/blog" className="text-primary hover:underline flex items-center justify-center">
            <FiArrowLeft className="mr-2" /> Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      {articleSchema && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      {/* FAQ Schema if applicable */}
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Reading Progress Bar */}
        <div
          className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />

        {/* Back to top button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg z-40 hover:bg-primary-dark transition-all duration-300"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        )}

        {/* Floating Dark Mode Toggle Button */}
        <div className="fixed bottom-8 left-8 z-40">
          <button
            onClick={toggleDarkMode}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5 text-yellow-500 transform group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-700 transform group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Main article content */}
        <article className="w-[90%] mx-auto px-4 py-12">
          {/* Back button */}
          <Link href="/blog" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-8 transition-colors duration-300">
            <FiArrowLeft className="mr-2" /> Back to all posts
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center mr-4">
                <FiCalendar className="mr-1" /> {formatDate(post.date)}
              </span>
              {post.readTime && (
                <span className="inline-flex items-center mr-4">
                  <FiClock className="mr-1" /> {post.readTime} min read
                </span>
              )}
              <span className="inline-flex items-center">
                <FiEye className="mr-1" /> {trackedViewCount} {trackedViewCount === 1 ? 'view' : 'views'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
              {post.excerpt}
            </div>

            {/* Category tag */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <FiTag className="mr-1" size={12} />
                {typeof post.category === 'string' ? post.category : post.category.name}
              </span>
            </div>

            {/* Author info */}
            {post.author && typeof post.author === 'object' && (
              <div className="flex items-center">
                {post.author.avatar && (
                  <div className="mr-4">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{post.author.name}</div>
                  {post.author.bio && <div className="text-sm text-gray-600 dark:text-gray-400">{post.author.bio}</div>}
                </div>
              </div>
            )}
          </header>

          {/* Featured Image */}
          <div className="relative h-72 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content with Table of Contents */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents (Desktop) */}
            {showToc && (
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Table of Contents</h3>
                  <nav className="toc">
                    <ul className="space-y-2">
                      {tocItems.map(item => (
                        <li
                          key={item.id}
                          className={`${item.level === 2 ? 'ml-0' :
                            item.level === 3 ? 'ml-3' :
                              'ml-6'
                            }`}
                        >
                          <button
                            onClick={() => scrollToHeading(item.id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-left"
                          >
                            {item.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            )}

            {/* Mobile ToC toggle */}
            {showToc && (
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setIsShowingMobileToc(!isShowingMobileToc)}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  <span className="font-medium text-gray-900 dark:text-white">Table of Contents</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${isShowingMobileToc ? 'transform rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {isShowingMobileToc && (
                  <nav className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <ul className="space-y-2">
                      {tocItems.map(item => (
                        <li
                          key={item.id}
                          className={`${item.level === 2 ? 'ml-0' :
                            item.level === 3 ? 'ml-3' :
                              'ml-6'
                            }`}
                        >
                          <button
                            onClick={() => scrollToHeading(item.id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-left"
                          >
                            {item.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            )}

            {/* Main Content */}
            <div className="flex-grow">
              <div
                id="article-content"
                className="prose prose-lg dark:prose-invert prose-headings:text-gray-800 dark:prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary-dark max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share section */}
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Share this article</h3>
                <div className="flex gap-3">
                  <SocialShare url={`https://bajramedia.com/blog/${post.slug}`} title={post.title} />
                  {shareMessage && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 ml-2 animate-fade-in">
                      {shareMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 dark:bg-gray-800 py-12">
            <div className="w-[95%] mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <div key={relatedPost.id}>
                    <BlogPostCard post={relatedPost} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BlogPostDetail;
