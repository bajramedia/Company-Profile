"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { AnimatedText, Blog } from '@/components';
import { blogService, BlogPost, BlogPostAuthor } from '@/services/BlogService';
import { useViewTracker, useViewCounter } from '@/hooks/useViewTracker';
import { SocialShareService } from '@/services/SocialShareService';
import { FiCalendar, FiClock, FiTag, FiArrowLeft, FiShare2, FiTwitter, FiLinkedin, FiFacebook, FiCopy, FiEye } from 'react-icons/fi';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const primaryColor = "rgb(3, 177, 80)";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [shareMessage, setShareMessage] = useState<string>('');
    // Initialize view tracking and counter
  const viewCounter = useViewCounter(post?.views || 0);
  const viewTracker = useViewTracker({ slug: post?.slug || '', delay: 3000 });
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug || typeof slug !== 'string') return;
      
      try {
        setLoading(true);
        const postData = await blogService.getPostBySlug(slug);
        setPost(postData);
        
        if (postData && typeof postData.category === 'string') {
          const related = await blogService.getPostsByCategory(postData.category, 3);
          setRelatedPosts(related.filter(p => p.id !== postData.id));
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
    const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const showShareMessage = (message: string) => {
    setShareMessage(message);
    setTimeout(() => setShareMessage(''), 3000);
  };
  const handleShare = async (platform: 'twitter' | 'linkedin' | 'facebook' | 'copy' | 'native') => {
    if (!post) return;
    
    const shareData = {
      title: post.title,
      description: post.excerpt,
      url: window.location.href,
      hashtags: post.tags || []
    };
    
    try {
      switch (platform) {
        case 'native':
          const nativeSuccess = await SocialShareService.nativeShare(shareData);
          if (nativeSuccess) {
            SocialShareService.trackShare('native', post.slug || '');
            showShareMessage('Shared successfully!');
          } else {
            // Fallback to copy if native share not available
            const copySuccess = await SocialShareService.copyToClipboard(shareData.url);
            if (copySuccess) {
              showShareMessage('Link copied to clipboard!');
            } else {
              showShareMessage('Sharing not available on this device.');
            }
          }
          break;
        case 'twitter':
          SocialShareService.shareToTwitter(shareData);
          SocialShareService.trackShare('twitter', post.slug || '');
          showShareMessage('Opening Twitter...');
          break;
        case 'linkedin':
          SocialShareService.shareToLinkedIn(shareData);
          SocialShareService.trackShare('linkedin', post.slug || '');
          showShareMessage('Opening LinkedIn...');
          break;
        case 'facebook':
          SocialShareService.shareToFacebook(shareData);
          SocialShareService.trackShare('facebook', post.slug || '');
          showShareMessage('Opening Facebook...');
          break;
        case 'copy':
          const success = await SocialShareService.copyToClipboard(shareData.url);
          if (success) {
            SocialShareService.trackShare('copy', post.slug || '');
            showShareMessage('Link copied to clipboard!');
          } else {
            showShareMessage('Failed to copy link. Please try again.');
          }
          break;
      }
    } catch (error) {
      console.error('Share error:', error);
      showShareMessage('Sorry, sharing failed. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold mb-2">
              {t('blog.postNotFound') || 'Blog Post Not Found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('blog.postNotFoundDescription') || 'The blog post you are looking for does not exist or has been removed.'}
            </p>
            <Link href="/blog" className="inline-flex items-center text-primary font-medium">
              <FiArrowLeft className="mr-2" /> 
              {t('blog.backToBlog') || 'Back to Blog'}
            </Link>
          </div>
        </div>
      </div>
    );
  }
    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-28 pb-16">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Enhanced Back to blog with breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{post.title}</span>
          </nav>
          
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-primary transition-all duration-300 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 hover:shadow-md">
            <FiArrowLeft className="mr-2" /> 
            {t('blog.backToBlog') || 'Back to Blog'}
          </Link>
        </div>
        
        {/* Enhanced Post Header */}
        <header className="mb-12">
          <AnimatedText as="div">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold" 
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                <FiTag className="mr-2" size={14} />
                {typeof post.category === 'string' ? post.category : post.category.name}
              </span>
                {/* Reading time and views */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {post.readTime && (
                  <span className="flex items-center">
                    <FiClock className="mr-1" size={14} />
                    {post.readTime} min read
                  </span>
                )}                <span className="flex items-center">
                  <FiEye className="mr-1" size={14} />
                  {viewTracker.views > 0 ? viewTracker.views : (post.views || 0)} views
                </span>
              </div>
            </div>
          </AnimatedText>
            <AnimatedText as="div">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {post.title}
            </h1>
          </AnimatedText>
          
          <AnimatedText as="div">
            <div className="flex flex-wrap items-center text-gray-600 text-base mb-8">
              <span className="flex items-center mr-6 mb-2">
                <FiCalendar className="mr-2" size={16} />
                Published on {formatDate(post.date)}
              </span>
            </div>
          </AnimatedText>
          
          {/* Enhanced Featured Image */}
          <div className="relative w-full h-80 md:h-96 lg:h-[500px] mb-10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
            <Image 
              src={post.featuredImage} 
              alt={post.title} 
              fill
              className="object-cover" 
              priority
            />
          </div>
        </header>
          {/* Enhanced Author section */}
        <AnimatedText as="div">
          <div className="flex items-center mb-12 p-6 border border-gray-200 bg-gradient-to-r from-white to-gray-50/50 rounded-2xl shadow-sm" 
               style={{ borderLeftColor: primaryColor, borderLeftWidth: '4px' }}>
            {post.author.avatar && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-6 ring-4 ring-white shadow-lg">
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{post.author.name}</p>
                  {post.author.bio && <p className="text-gray-600 mt-1">{post.author.bio}</p>}
                  <p className="text-sm text-gray-500 mt-2">Published {formatDate(post.date)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <FiTwitter size={18} />
                  </button>
                  <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <FiLinkedin size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedText>
        
        {/* Enhanced Post Content */}
        <div className="prose prose-lg prose-gray max-w-none mb-16 leading-relaxed">
          <style jsx global>{`
            .prose {
              color: #374151;
              line-height: 1.8;
            }
            .prose h1, .prose h2, .prose h3, .prose h4 {
              color: #111827;
              font-weight: 700;
              margin-top: 2.5rem;
              margin-bottom: 1rem;
            }
            .prose h2 {
              font-size: 1.875rem;
              border-bottom: 2px solid #f3f4f6;
              padding-bottom: 0.5rem;
            }
            .prose h3 {
              font-size: 1.5rem;
              color: ${primaryColor};
            }
            .prose p {
              margin-bottom: 1.5rem;
              font-size: 1.125rem;
            }
            .prose blockquote {
              border-left: 4px solid ${primaryColor};
              background: linear-gradient(to right, ${primaryColor}08, transparent);
              padding: 1.5rem;
              margin: 2rem 0;
              border-radius: 0 0.5rem 0.5rem 0;
              font-style: italic;
              font-size: 1.25rem;
            }
            .prose ul, .prose ol {
              margin: 1.5rem 0;
            }
            .prose li {
              margin: 0.5rem 0;
              font-size: 1.125rem;
            }
            .prose code {
              background: #f9fafb;
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              font-size: 0.875rem;
              color: ${primaryColor};
            }
            .prose pre {
              background: #1f2937;
              color: #f9fafb;
              padding: 1.5rem;
              border-radius: 0.75rem;
              overflow-x: auto;
              margin: 2rem 0;
            }
            .prose img {
              border-radius: 1rem;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              margin: 2rem auto;
            }
            .prose a {
              color: ${primaryColor};
              text-decoration: none;
              border-bottom: 1px solid ${primaryColor}40;
              transition: all 0.3s ease;
            }
            .prose a:hover {
              border-bottom-color: ${primaryColor};
              background: ${primaryColor}10;
              padding: 0 0.25rem;
              border-radius: 0.25rem;
            }
          `}</style>
          
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <div>
              <p className="text-xl leading-relaxed mb-8">
                This is a placeholder for the blog post content. In a real implementation,
                this would be actual content from your CMS with rich formatting, images, and interactive elements.
              </p>
              
              <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900">Key Insights and Takeaways</h2>
              
              <p className="mb-6">
                In today's rapidly evolving digital landscape, businesses must adapt and innovate to stay competitive. 
                This comprehensive guide explores the essential strategies and best practices that successful companies 
                are implementing to drive growth and engagement.
              </p>
              
              <blockquote className="my-8">
                "The future belongs to organizations that can turn today's information into tomorrow's insight, 
                today's insight into tomorrow's wisdom, and tomorrow's wisdom into tomorrow's results."
              </blockquote>
              
              <h3 className="text-2xl font-bold mt-10 mb-4">Strategic Implementation Framework</h3>
              
              <p className="mb-6">
                Success in digital transformation requires a systematic approach that encompasses technology, 
                people, and processes. Here are the fundamental pillars that organizations should focus on:
              </p>
              
              <ol className="list-decimal pl-8 mb-8 space-y-3">
                <li><strong>Technology Infrastructure:</strong> Building scalable and secure systems that can adapt to changing business needs</li>
                <li><strong>Data-Driven Decision Making:</strong> Implementing analytics and insights to guide strategic choices</li>
                <li><strong>Customer Experience Optimization:</strong> Creating seamless interactions across all touchpoints</li>
                <li><strong>Agile Methodology:</strong> Adopting flexible processes that enable rapid iteration and improvement</li>
                <li><strong>Continuous Learning Culture:</strong> Fostering an environment that encourages innovation and adaptation</li>
              </ol>
              
              <h3 className="text-2xl font-bold mt-10 mb-4">Measuring Success and ROI</h3>
              
              <p className="mb-6">
                To ensure your initiatives are delivering value, it's crucial to establish clear metrics and KPIs. 
                Focus on both quantitative measures (revenue growth, conversion rates, efficiency gains) and 
                qualitative indicators (customer satisfaction, employee engagement, brand perception).
              </p>
              
              <p className="mb-6">
                The journey of digital transformation is ongoing, requiring constant evaluation and adjustment. 
                Organizations that embrace this mindset and commit to continuous improvement will be best positioned 
                to thrive in an increasingly competitive marketplace.
              </p>
            </div>
          )}
        </div>          {/* Enhanced Social Share */}
        <div className="mb-16 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 relative">
          {/* Share success message */}
          {shareMessage && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10">
              {shareMessage}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t('blog.sharePost') || 'Found this article helpful?'}
              </h4>
              <p className="text-gray-600">Share it with your network and help others discover great content</p>
            </div>            <div className="flex items-center space-x-4">              {/* Show native share button on mobile/supported devices */}
              {typeof window !== 'undefined' && 'share' in navigator && (
                <button 
                  onClick={() => handleShare('native')}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FiShare2 className="mr-2" size={18} />
                  <span className="font-medium">Share</span>
                </button>
              )}
              <button 
                onClick={() => handleShare('twitter')}
                className="flex items-center px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a91da] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FiTwitter className="mr-2" size={18} />
                <span className="font-medium">Twitter</span>
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className="flex items-center px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FiLinkedin className="mr-2" size={18} />
                <span className="font-medium">LinkedIn</span>
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="flex items-center px-4 py-2 bg-[#4267B2] text-white rounded-lg hover:bg-[#365899] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FiFacebook className="mr-2" size={18} />
                <span className="font-medium">Facebook</span>
              </button>
              <button 
                onClick={() => handleShare('copy')}
                className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-300 group"
                title="Copy link"
              >
                <FiCopy size={18} className="group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tags section */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-16">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h4>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Enhanced Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {t('blog.relatedPosts') || 'Continue Reading'}
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover more insights and expert perspectives on related topics
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="block group">
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <FiCalendar className="mr-1" size={14} />
                        <span>{formatDate(relatedPost.date)}</span>
                        {relatedPost.readTime && (
                          <>
                            <span className="mx-2">•</span>
                            <FiClock className="mr-1" size={14} />
                            <span>{relatedPost.readTime} min read</span>
                          </>
                        )}
                      </div>
                      <h4 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {relatedPost.author.avatar && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                              <Image
                                src={relatedPost.author.avatar}
                                alt={relatedPost.author.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-700">{relatedPost.author.name}</span>
                        </div>
                        <div className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                          Read More →
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
