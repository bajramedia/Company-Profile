import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostDetail from '@/components/BlogPostDetail';
import { blogService, BlogPost } from '@/services/BlogService';

// Generate dynamic metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // Fetch the blog post data
    const post = await blogService.getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.'
      };
    }
    
    // Structure the metadata for optimal SEO
    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags?.join(', ') || '',
      authors: post.author ? [{ name: typeof post.author === 'object' ? post.author.name : 'Bajramedia' }] : [],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url: `https://bajramedia.com/blog/${post.slug}`,
        type: 'article',
        publishedTime: post.date,
        authors: typeof post.author === 'object' ? [post.author.name] : ['Bajramedia'],
        tags: post.tags,
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [post.featuredImage],
      },
      alternates: {
        canonical: `https://bajramedia.com/blog/${post.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Bajramedia',
      description: 'Read our latest blog post on Bajramedia.'
    };
  }
}

// Pre-render specific blog posts at build time (Static Generation)
export async function generateStaticParams() {
  try {
    const { posts } = await blogService.getAllPosts(1, 100); // Get up to 100 posts for static generation
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// The blog post page component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {  try {
    // Fetch the blog post data
    const post = await blogService.getPostBySlug(params.slug);
    
    // If post not found, return 404
    if (!post) {
      notFound();
    }
    
    // Render the blog post detail component with the fetched data
    return <BlogPostDetail post={post} />;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (document.documentElement) {
        if (newMode) {
          document.documentElement.classList.add('dark-mode');
        } else {
          document.documentElement.classList.remove('dark-mode');
        }
      }
      
      // Save preference to localStorage
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
  };    useEffect(() => {
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
        
        // Safely fetch related posts
        try {
          if (postData && postData.category) {
            const categoryId = typeof postData.category === 'string' 
              ? postData.category 
              : postData.category.slug || postData.category.id || '';
            
            if (categoryId) {
              const related = await blogService.getPostsByCategory(categoryId, 3);
              setRelatedPosts(related.filter(p => p.id !== postData.id));
            }
          }
        } catch (relatedError) {
          console.error("Error fetching related posts:", relatedError);
          // Don't fail the whole post loading if related posts fail
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
    // Extract headings for table of contents
  useEffect(() => {
    if (post && post.content) {
      // Use regex to extract headings from HTML content
      // This is a simple approach - in a real implementation you'd use a proper HTML parser
      const regex = /<h([2-4])[^>]*id=["']([^"']+)["'][^>]*>([^<]+)<\/h\1>/g;
      let match;
      const headings = [];
      let content = post.content;
      
      // If there's no content or we're using the placeholder content
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
        
        // If no headings have IDs, we can dynamically add them
        if (headings.length === 0 && typeof document !== 'undefined') {
          const container = document.querySelector('.prose > div');
          if (container) {
            const hElements = container.querySelectorAll('h2, h3, h4');
            hElements.forEach((el, index) => {
              const level = parseInt(el.tagName[1]);
              const title = el.textContent || '';
              const id = `heading-${index}`;
              
              // Add id to the heading if it doesn't have one
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
        setShowToc(headings.length > 2); // Only show TOC if we have enough headings
      }
    }
  }, [post]);
  // Handle reading progress, scroll position, and active TOC item
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        // Calculate reading progress
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(progress);
        
        // Show back to top button after scrolling down 300px
        setShowBackToTop(window.scrollY > 300);
        
        // Update document title with reading progress (Tokopedia-inspired feature)
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
      // Reset title when unmounting
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
    // Calculate estimated reading time based on content
  const calculateReadingTime = (content: string): number => {
    // Average reading speed (words per minute)
    const wordsPerMinute = 200;
    
    // Count words in content (rough approximation)
    const wordCount = content ? content.trim().split(/\s+/).length : 0;
    
    // Calculate reading time
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    // Return at least 1 minute
    return Math.max(1, readingTime);
  };
    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header skeleton */}
          <div className="animate-pulse">
            <div className="mb-5">
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
            </div>
            
            {/* Featured image skeleton */}
            <div className="relative w-full h-64 md:h-80 bg-gray-200 rounded-2xl mb-10"></div>
            
            {/* Author card skeleton */}
            <div className="p-6 bg-gray-100 rounded-2xl mb-12">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-5 w-24 bg-gray-200 rounded mb-3"></div>
                  <div className="h-7 w-48 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-3">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-6 mb-12">
              <div className="h-6 bg-gray-200 rounded-lg w-2/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              
              <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
              
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              
              <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            
            {/* Related posts skeleton */}
            <div className="mt-12">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-xl overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                      <div className="pt-3 flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
          <div className="text-center py-16 md:py-20">
            <div className="mb-6 relative">
              <div className="w-24 h-24 mx-auto bg-primary/5 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-40 h-40 bg-primary/5 rounded-full filter blur-3xl opacity-50"></div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
              {t('blog.postNotFound') || 'Blog Post Not Found'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
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
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('common.goHome') || 'Go to Homepage'}
              </Link>
            </div>
            
            {/* Suggested posts would go here if available */}
          </div>
        </div>
      </div>    );  
  }
  
  return (
    <>
      {/* SEO Component for dynamic meta tags */}
      <SEO 
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.date}
        author={typeof post.author === 'object' ? post.author.name : 'Bajramedia'}
        section={typeof post.category === 'object' ? post.category.name : post.category}
        tags={Array.isArray(post.tags) ? post.tags : []}      />        
      <div className="min-h-screen bg-white pt-24 pb-16">        
        {/* Tokopedia-style floating progress bar */}
        <div className="fixed top-0 md:top-16 left-0 right-0 h-1 md:h-1.5 bg-gray-100 z-40">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-out" 
            style={{width: `${readingProgress}%`}}
          ></div>
        </div>
          {/* Back to Top Button (Tokopedia-style) */}
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
        
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-24 md:top-20 right-4 md:right-8 p-2.5 rounded-full shadow-lg transition-all duration-300 z-30 hover:scale-110"
          style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', color: isDarkMode ? '#ffffff' : '#1f2937' }}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
          {/* Floating Table of Contents (Tokopedia-style) */}
        {showToc && tocItems.length > 0 && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-64">
              <div className="flex items-center border-b border-gray-100 pb-3 mb-3">
                <div className="p-1.5 bg-primary/10 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h5 className="text-sm font-semibold text-gray-900">Table of Contents</h5>
              </div>
              <nav>
                <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                  {tocItems.map((item, index) => (
                    <li key={index} style={{ marginLeft: (item.level - 2) * 12 + 'px' }}>
                      <a
                        href={`#${item.id}`}
                        className={`text-sm block py-1.5 px-2 rounded-lg transition-colors duration-200 hover:bg-primary/5 hover:text-primary 
                          ${item.level === 2 ? 'font-medium' : 'font-normal'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(item.id);
                          if (element) {
                            const yOffset = -100; // Adjust for fixed header
                            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
          <article className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Enhanced Post Header with Tokopedia style */}
          <header className="mb-8">
            {/* Category pill - Tokopedia style */}
            <AnimatedText as="div">
              <div className="mb-5">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <FiTag className="mr-1" size={12} />
                  {typeof post.category === 'string' ? post.category : post.category.name}
                </span>
              </div>
            </AnimatedText>
            
            {/* Title - Tokopedia style */}
            <AnimatedText as="div">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
                {post.title}
              </h1>
            </AnimatedText>
            
            {/* Meta info - Tokopedia style */}
            <AnimatedText as="div">
              <div className="flex flex-wrap items-center justify-between text-gray-500 text-sm mb-8">
                <div className="flex items-center">
                  <span className="flex items-center mr-4">
                    <FiCalendar className="mr-1" size={14} />
                    {formatDate(post.date)}
                  </span>
                  {post.readTime && (
                    <span className="flex items-center mr-4">
                      <FiClock className="mr-1" size={14} />
                      {post.readTime} min read
                    </span>
                  )}
                  <span className="flex items-center">
                    <FiEye className="mr-1" size={14} />
                    {viewTracker.views > 0 ? viewTracker.views : (post.views || 0)} views
                  </span>
                </div>
              </div>
            </AnimatedText>
            
            {/* Enhanced Featured Image - Tokopedia style */}
            <div className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 mb-8 rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src={post.featuredImage} 
                alt={post.title} 
                fill
                className="object-cover" 
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 85vw, 75vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          </header>        {/* Tokopedia-inspired Author section */}
        <AnimatedText as="div">
          <div className="mb-12 p-0">
            <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              {/* Author avatar with Tokopedia card style */}
              {post.author.avatar && (
                <div className="relative self-center md:self-start">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 sm:ring-4 ring-white">
                    <Image 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 sm:p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Author info with Tokopedia card style */}
              <div className="flex-1 text-center md:text-left">
                <p className="inline-block mb-2 px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                  Author
                </p>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{post.author.name}</h4>
                {post.author.bio && (
                  <p className="text-gray-600 text-sm md:text-base mb-3">{post.author.bio}</p>
                )}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                  <a href="#" className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-300">
                    Follow Author
                  </a>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all duration-300">
                      <FiTwitter size={16} />
                    </button>
                    <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all duration-300">
                      <FiLinkedin size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Post meta in Tokopedia style */}
              <div className="hidden md:block border-l border-gray-200 pl-6">
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiCalendar size={14} className="text-primary" />
                    <span>Published on {formatDate(post.date)}</span>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiClock size={14} className="text-primary" />
                      <span>{post.readTime} min read</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiEye size={14} className="text-primary" />
                    <span>{viewTracker.views > 0 ? viewTracker.views : (post.views || 0)} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedText>
          {/* Tokopedia-style Post Content with mobile TOC */}
        <div className="relative mb-16">          {/* Mobile Table of Contents Button */}
          {showToc && tocItems.length > 0 && (
            <div className="lg:hidden sticky top-20 z-20 mb-6">
              <button 
                onClick={() => setIsShowingMobileToc(prev => !prev)} 
                className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full shadow-md"
                aria-expanded={isShowingMobileToc}
                aria-controls="mobile-toc"
              >
                <div className="flex items-center justify-center p-1.5 bg-primary/10 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="flex-1 text-left">Table of Contents ({tocItems.length} sections)</span>
                <svg xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transform transition-transform duration-300 ${isShowingMobileToc ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Mobile TOC dropdown with smooth animation */}
              <div 
                id="mobile-toc"
                className={`mt-2 bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden ${
                  isShowingMobileToc ? 'mobile-toc-enter-active' : 'mobile-toc-exit-active'
                }`}
                style={{ transformOrigin: 'top' }}
              >
                <div className="max-h-[calc(60vh-40px)] overflow-y-auto p-4">
                  <ul className="space-y-2">
                    {tocItems.map((item, index) => (
                      <li 
                        key={index} 
                        className={`${
                          item.level === 2 
                            ? 'border-l-2 border-primary/70 pl-3' 
                            : item.level === 3 
                              ? 'ml-4 pl-3 border-l border-primary/40' 
                              : 'ml-8 pl-2'
                        }`}
                      >
                        <a
                          href={`#${item.id}`}
                          className={`text-sm block py-2 px-2 rounded-md transition-colors duration-200 hover:bg-primary/5 hover:text-primary 
                            ${item.level === 2 ? 'font-medium' : 'font-normal'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(item.id);
                            if (element) {
                              const yOffset = -80; // Adjust for fixed header
                              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                              setIsShowingMobileToc(false);
                            }
                          }}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
            <div className="prose prose-lg prose-gray max-w-none leading-relaxed">
            {/* Post content rendered as HTML - dangerouslySetInnerHTML used here */}
            <div 
              className="post-content" 
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>
        </div>
        </article>
          {/* Enhanced Related Posts section with cards and hover effects */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 md:mt-20">
            <div className="flex items-center mb-6 md:mb-8">
              <div className="h-8 w-1.5 bg-primary rounded-full mr-3"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('blog.relatedPosts') || 'Related Posts'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"> {/* Increased gap here */}
              {relatedPosts.map((relatedPost) => (
                <Link 
                  href={`/blog/${relatedPost.slug}`} 
                  key={relatedPost.id} 
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
                >
                  {/* Image with overlay and hover effect */}
                  <div className="relative overflow-hidden h-48 sm:h-52 md:h-56">
                    <Image 
                      src={relatedPost.featuredImage} 
                      alt={relatedPost.title} 
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
                    
                    {/* Category badge - positioned on the image */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary shadow-sm backdrop-blur-sm">
                        <FiTag className="mr-1.5" size={12} />
                        {typeof relatedPost.category === 'string' ? relatedPost.category : relatedPost.category.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <FiCalendar className="mr-1.5" size={14} />
                        {formatDate(relatedPost.date)}
                      </div>
                      
                      {relatedPost.readTime && (
                        <div className="flex items-center text-xs text-gray-500">
                          <FiClock className="mr-1.5" size={14} />
                          {relatedPost.readTime} min read
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* View all posts link */}
            <div className="text-center mt-8">
              <Link 
                href="/blog"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-all duration-300"
              >
                {t('blog.viewAllPosts') || 'View all posts'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
          {/* Improved Social Share section */}
        <div className="mt-12 md:mt-16 py-6 border-t border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t('blog.shareThisPost') || 'Share This Post'}
            </h2>
            <div className="text-sm text-gray-600 flex items-center">
              <span className="mr-2">{t('blog.helpfulArticle') || 'Was this article helpful?'}</span>
              <button 
                className="ml-1 p-2 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors duration-200"
                aria-label="Article was helpful"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <button 
                className="ml-1 p-2 bg-gray-50 hover:bg-red-100 hover:text-red-500 rounded-lg transition-colors duration-200"
                aria-label="Article was not helpful"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Share message toast notification */}
          {shareMessage && (
            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {shareMessage}
            </div>
          )}
          
          {/* Enhanced share buttons container */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"> {/* Changed container style */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              <div className="flex-grow">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    readOnly 
                    value={typeof window !== 'undefined' ? `${window.location.origin}/blog/${post?.slug || ''}` : ''} 
                    className="w-full pr-20 py-3 pl-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/70" 
                  />
                  <button 
                    onClick={() => handleShare('copy')} 
                    className="absolute right-0 h-full px-4 text-sm font-semibold text-primary bg-gray-50 border-l border-gray-200 rounded-r-lg hover:bg-primary/10 hover:text-primary-dark transition-colors duration-200"
                  >
                    {t('blog.copyLink') || 'Copy'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <button 
                  onClick={() => handleShare('native')} 
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm"
                  aria-label="Share"
                >
                  <FiShare2 className="mr-2" size={16} />
                  <span>{t('blog.share') || 'Share'}</span>
                </button>
                
                <button 
                  onClick={() => handleShare('twitter')} 
                  className="flex items-center justify-center h-10 w-10 text-white bg-[#1DA1F2] rounded-lg hover:opacity-90 transition-all duration-300 shadow-sm"
                  aria-label="Share on Twitter"
                >
                  <FiTwitter size={18} />
                </button>
                
                <button 
                  onClick={() => handleShare('linkedin')} 
                  className="flex items-center justify-center h-10 w-10 text-white bg-[#0077B5] rounded-lg hover:opacity-90 transition-all duration-300 shadow-sm"
                  aria-label="Share on LinkedIn"
                >
                  <FiLinkedin size={18} />
                </button>
                
                <button 
                  onClick={() => handleShare('facebook')} 
                  className="flex items-center justify-center h-10 w-10 text-white bg-[#1877F2] rounded-lg hover:opacity-90 transition-all duration-300 shadow-sm"
                  aria-label="Share on Facebook"
                >
                  <FiFacebook size={18} />
                </button>
              </div>
              
              <div className="ml-auto hidden sm:block">
                <div className="flex items-center text-sm text-gray-500">                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post?.views || 0} {t('blog.views') || 'views'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tokopedia-style Comments Section with mobile optimization */}
        <div className="mt-16 md:mt-20">
          <h2 className="text-2xl md:text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {t('blog.comments') || 'Comments'}
          </h2>
          
          {/* Comment form */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 p-5 md:p-7 mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-900 border-b border-gray-100 pb-2">
              {t('blog.leaveComment') || 'Leave a comment'}
            </h3>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('blog.name') || 'Name'} *
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all" 
                    placeholder={t('blog.yourName') || 'Your name'}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('blog.email') || 'Email'} *
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all" 
                    placeholder={t('blog.yourEmail') || 'Your email'}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('blog.comment') || 'Comment'} *
                </label>
                <textarea 
                  id="comment" 
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all" 
                  placeholder={t('blog.yourComment') || 'Your comment'}
                  required
                ></textarea>
              </div>
              
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="saveInfo" 
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                  />
                  <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-600">
                    {t('blog.saveInfo') || 'Save my name and email for next time'}
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm"
                >
                  {t('blog.submitComment') || 'Submit Comment'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          
          {/* Sample comments - mobile optimized */}
          <div className="space-y-6">
            {/* Comment 1 */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 p-5 md:p-6 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12">
                  <Image 
                    src="https://randomuser.me/api/portraits/men/41.jpg" 
                    alt="User Avatar" 
                    fill
                    className="rounded-full object-cover border-2 border-white shadow-sm"
                    sizes="(max-width: 640px) 40px, 48px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="text-base md:text-lg font-medium text-gray-900">John Doe</h4>
                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full">2 days ago</span>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    This is an excellent article! I've been looking for clear explanations on this topic for a while. Thanks for sharing your knowledge.
                  </p>
                  <div className="flex gap-5 mt-3">
                    <button className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Like
                    </button>
                    <button className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comment 2 with reply */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 p-5 md:p-6 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12">
                  <Image 
                    src="https://randomuser.me/api/portraits/women/32.jpg" 
                    alt="User Avatar" 
                    fill
                    className="rounded-full object-cover border-2 border-white shadow-sm"
                    sizes="(max-width: 640px) 40px, 48px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="text-base md:text-lg font-medium text-gray-900">Maria Silva</h4>
                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full">4 days ago</span>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    I have a question regarding the third point you mentioned. Would it work in a mobile-first approach as well?
                  </p>
                  <div className="flex gap-5 mt-3">
                    <button className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Like
                    </button>
                    <button className="flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Reply
                    </button>
                  </div>
                  
                  {/* Reply */}
                  <div className="mt-5 pl-4 md:pl-6 pt-4 border-l-2 border-primary/20">
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="relative flex-shrink-0 w-8 h-8 md:w-10 md:h-10">
                        <Image 
                          src="https://randomuser.me/api/portraits/men/85.jpg" 
                          alt="Author Avatar" 
                          fill
                          className="rounded-full object-cover border-2 border-white shadow-sm"
                          sizes="(max-width: 640px) 32px, 40px"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h5 className="text-sm md:text-base font-medium text-gray-900">Author</h5>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">3 days ago</span>
                        </div>
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                          Yes, absolutely! The approach works perfectly with mobile-first design. In fact, I've added some examples specifically for mobile in the second half of the article.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            {/* Load more comments button with enhanced styling */}
          <div className="text-center mt-8">
            <button className="inline-flex items-center px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md relative overflow-hidden group">
              <span className="absolute inset-0 w-0 bg-primary/10 transition-all duration-300 group-hover:w-full"></span>
              <span className="relative flex items-center">
                {t('blog.loadMoreComments') || 'Load more comments'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
        
        {/* Enhanced Newsletter Section */}
        <div className="mt-16 md:mt-20 mb-10 md:mb-12">
          <div className="bg-gradient-to-br from-primary/5 to-primary/15 rounded-2xl p-6 md:p-8 border border-primary/10 shadow-lg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 md:w-40 md:h-40 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {t('blog.newsletterTag') || 'Stay in the loop'}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                  {t('blog.stayUpdated') || 'Stay Updated'}
                </h2>
                <p className="text-sm md:text-base text-gray-700 mb-6 leading-relaxed">
                  {t('blog.newsletterDescription') || 'Subscribe to our newsletter to get the latest updates, articles, and resources sent straight to your inbox.'}
                </p>
                
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 mt-6">
                  <div className="flex items-center">
                    <div className="bg-white p-1 rounded-full mr-2 shadow-sm">
                      <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {t('blog.noSpam') || 'No spam'}
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white p-1 rounded-full mr-2 shadow-sm">
                      <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {t('blog.weeklyDigest') || 'Weekly digest'}
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white p-1 rounded-full mr-2 shadow-sm">
                      <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {t('blog.unsubscribeAnytime') || 'Unsubscribe anytime'}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium mb-3 text-gray-900">{t('blog.joinNewsletter') || 'Join Our Newsletter'}</h3>
                <form className="flex flex-col space-y-3">
                  <div>
                    <label htmlFor="newsletter-email" className="sr-only">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input 
                        id="newsletter-email"
                        type="email" 
                        placeholder={t('blog.yourEmail') || 'Your email address'} 
                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all" 
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-white px-4 py-3 rounded-lg font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center"
                  >
                    {t('blog.subscribe') || 'Subscribe'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
                
                <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-500 mt-4 md:hidden">
                  <div className="flex items-center">
                    <svg className="h-3 w-3 text-primary mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('blog.noSpam') || 'No spam'}
                  </div>
                  <div className="flex items-center">
                    <svg className="h-3 w-3 text-primary mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('blog.unsubscribeAnytime') || 'Unsubscribe anytime'}
                  </div>
                </div>
                
                <p className="text-center text-xs text-gray-500 mt-4 border-t border-gray-100 pt-3">
                  {t('blog.privacyPolicy') || 'By subscribing, you agree with our'} 
                  <a href="#" className="text-primary hover:underline ml-1 font-medium">{t('blog.privacyPolicyLink') || 'Privacy Policy'}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
