"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useViewTracker } from '@/hooks/useViewTracker';
import { FiArrowLeft, FiCalendar, FiClock, FiEye, FiShare2, FiUser, FiTag, FiHeart, FiBookmark, FiTwitter, FiLinkedin, FiFacebook, FiLink } from 'react-icons/fi';
import { blogService, BlogPost } from '@/services/BlogService.api';
import Link from 'next/link';
import { WhatsAppChat } from '@/components';

interface TocItem {
    level: number;
    id: string;
    title: string;
}

interface BlogPostClientProps {
    initialPost: BlogPost | null;
    slug: string;
}

export default function BlogPostClient({ initialPost, slug }: BlogPostClientProps) {
    const { t } = useLanguage();
    const [post, setPost] = useState<BlogPost | null>(initialPost);
    const [loading, setLoading] = useState(!initialPost);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [readingProgress, setReadingProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [showToc, setShowToc] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize dark mode based on user preference
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const shouldEnableDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

            setIsDarkMode(shouldEnableDarkMode);

            if (shouldEnableDarkMode) {
                document.documentElement.classList.add('dark');
            }

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

            localStorage.setItem('darkMode', newMode ? 'true' : 'false');
            return newMode;
        });
    };

    const handleShare = async (platform: string) => {
        if (!post) return;
        const shareData = {
            title: post.title,
            text: post.excerpt,
            url: typeof window !== 'undefined' ? window.location.href : ''
        };

        try {
            if (platform === 'native' && navigator.share) {
                await navigator.share(shareData);
                setShareMessage('Link shared!');
            } else if (platform === 'copy') {
                await navigator.clipboard.writeText(shareData.url);
                setShareMessage('Link copied!');
            } else if (platform === 'twitter') {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`);
            } else if (platform === 'linkedin') {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`);
            } else if (platform === 'facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`);
            }
        } catch (e) {
            setShareMessage('Failed to share');
        }
        setTimeout(() => setShareMessage(''), 2000);
    };

    useEffect(() => {
        if (!initialPost) {
            const fetchPost = async () => {
                if (!slug || typeof slug !== 'string') return;

                try {
                    setLoading(true);
                    const postData = await blogService.getPostBySlug(slug);

                    if (!postData) {
                        console.error("Blog post not found");
                        setLoading(false);
                        return;
                    }

                    setPost(postData);
                } catch (error) {
                    console.error("Error fetching blog post:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchPost();
        }
    }, [slug, initialPost]);

    // Fetch related posts
    useEffect(() => {
        const fetchRelatedPosts = async () => {
            if (!post) return;

            try {
                if (post.category) {
                    const categoryId = typeof post.category === 'string'
                        ? post.category
                        : post.category.slug || post.category.id || '';

                    if (categoryId) {
                        const related = await blogService.getPostsByCategory(categoryId, 3);
                        setRelatedPosts(related.filter(p => p.id !== post.id));
                    }
                }
            } catch (relatedError) {
                console.error("Error fetching related posts:", relatedError);
            }
        };

        fetchRelatedPosts();
    }, [post]);

    // Extract headings for table of contents
    useEffect(() => {
        if (post && post.content) {
            const regex = /<h([2-4])[^>]*id=["']([^"']+)["'][^>]*>([^<]+)<\/h\1>/g;
            let match;
            const headings = [];
            let content = post.content;

            if (!content) {
                const contentDiv = document.querySelector('.prose > div');
                if (contentDiv) {
                    content = contentDiv.innerHTML;
                }
            }

            if (content) {
                while ((match = regex.exec(content)) !== null) {
                    headings.push({
                        level: parseInt(match[1]),
                        id: match[2],
                        title: match[3].trim()
                    });
                }

                if (headings.length === 0 && typeof document !== 'undefined') {
                    const container = document.querySelector('.prose > div');
                    if (container) {
                        const hElements = container.querySelectorAll('h2, h3, h4');
                        hElements.forEach((el, index) => {
                            const level = parseInt(el.tagName[1]);
                            const title = el.textContent || '';
                            const id = `heading-${index}`;

                            if (!el.id) {
                                el.id = id;
                            }

                            headings.push({
                                level,
                                id: el.id,
                                title: title.trim()
                            });
                        });
                    }
                }

                setTocItems(headings);
                setShowToc(headings.length > 2);
            }
        }
    }, [post]);

    // Handle reading progress and scroll
    useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                const totalHeight = document.body.scrollHeight - window.innerHeight;
                const progress = (window.scrollY / totalHeight) * 100;
                setReadingProgress(progress);
                setShowBackToTop(window.scrollY > 300);

                if (post) {
                    const progressPercent = Math.round(progress);
                    if (progressPercent > 0 && progressPercent < 100) {
                        document.title = `(${progressPercent}%) ${post.title}`;
                    } else {
                        document.title = post.title;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (post) document.title = post.title;
        };
    }, [post]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateReadingTime = (content: string): number => {
        const wordsPerMinute = 200;
        const wordCount = content ? content.trim().split(/\s+/).length : 0;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return Math.max(1, readingTime);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="animate-pulse">
                        <div className="mb-5">
                            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mb-6"></div>
                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="relative w-full h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-10"></div>
                        <div className="space-y-6 mb-12">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-16 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="text-center py-16 md:py-20">
                        <div className="mb-6 relative">
                            <div className="w-24 h-24 mx-auto bg-primary/5 dark:bg-primary/10 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                            {t('blog.postNotFound') || 'Blog Post Not Found'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {t('blog.postNotFoundDescription') || 'The blog post you are looking for does not exist or has been removed.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/blog"
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm"
                            >
                                <FiArrowLeft className="mr-2" />
                                {t('blog.backToBlog') || 'Back to Blog'}
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                {t('common.goHome') || 'Go to Homepage'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16 transition-colors duration-300">
            {/* Progress bar */}
            <div className="fixed top-0 md:top-16 left-0 right-0 h-1 md:h-1.5 bg-gray-100 dark:bg-gray-800 z-40">
                <div
                    className="h-full bg-primary transition-all duration-100 ease-out"
                    style={{ width: `${readingProgress}%` }}
                ></div>
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-110"
                    aria-label="Back to top"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}

            {/* Share message */}
            {shareMessage && (
                <div className="fixed top-20 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in-right">
                    {shareMessage}
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Back to blog link */}
                <div className="mb-6">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                        <FiArrowLeft className="mr-2" />
                        {t('blog.backToBlog') || 'Back to Blog'}
                    </Link>
                </div>

                {/* Article header */}
                <header className="mb-10">
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {typeof post.category === 'object' ? post.category.name : post.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
                        <div className="flex items-center">
                            <FiCalendar className="mr-2" />
                            <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center">
                            <FiClock className="mr-2" />
                            <span>{calculateReadingTime(post.content || post.excerpt)} min read</span>
                        </div>
                        <div className="flex items-center">
                            <FiEye className="mr-2" />
                            <span>{post.views || 0} views</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                >
                                    <FiTag className="mr-1" size={12} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Featured image */}
                    {post.featuredImage && (
                        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>
                    )}
                </header>

                {/* Article content */}
                <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <div dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }} />
                </article>

                {/* Share buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share this article</h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleShare('twitter')}
                                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                                aria-label="Share on Twitter"
                            >
                                <FiTwitter size={18} />
                            </button>
                            <button
                                onClick={() => handleShare('facebook')}
                                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                aria-label="Share on Facebook"
                            >
                                <FiFacebook size={18} />
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-colors"
                                aria-label="Share on LinkedIn"
                            >
                                <FiLinkedin size={18} />
                            </button>
                            <button
                                onClick={() => handleShare('copy')}
                                className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                                aria-label="Copy link"
                            >
                                <FiLink size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related posts */}
                {relatedPosts.length > 0 && (
                    <section className="border-t border-gray-200 dark:border-gray-700 pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/blog/${relatedPost.slug}`}
                                    className="group block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                                >
                                    {relatedPost.featuredImage && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={relatedPost.featuredImage}
                                                alt={relatedPost.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="text-xs text-primary font-medium mb-2">
                                            {typeof relatedPost.category === 'object' ? relatedPost.category.name : relatedPost.category}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                                            {relatedPost.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{formatDate(relatedPost.date)}</span>
                                            <span className="flex items-center">
                                                <FiEye className="mr-1" />
                                                {relatedPost.views || 0}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber="6285739402436"
                message="Halo! Saya tertarik dengan layanan Bajramedia. Bisa konsultasi gratis?"
            />

            {/* Dark Mode Toggle */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={toggleDarkMode}
                    className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? (
                        <svg className="w-6 h-6 text-yellow-500 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-gray-700 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
} 