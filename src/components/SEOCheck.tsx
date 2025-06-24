"use client";

import { useEffect, useState } from 'react';

interface SEOCheckResult {
  title: boolean;
  description: boolean;
  canonical: boolean;
  openGraph: boolean;
  twitter: boolean;
  jsonLd: boolean;
  mobileOptimization: boolean;
  imgAltTags: boolean;
  metaTags: boolean;
  robots: boolean;
  secureHttps: boolean;
  headers: boolean;
}

/**
 * SEO Check Component - Analyze current page for SEO aspects
 * This component will analyze the current page and provide feedback on SEO implementation
 */
export default function SEOCheck() {
  const [results, setResults] = useState<SEOCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      // Run check after a short delay to ensure all scripts are loaded
      setTimeout(runSeoCheck, 1000);
    }
  }, []);

  const runSeoCheck = () => {
    setLoading(true);
    
    // Initialize results
    const seoResults: SEOCheckResult = {
      title: false,
      description: false,
      canonical: false,
      openGraph: false,
      twitter: false,
      jsonLd: false,
      mobileOptimization: false,
      imgAltTags: true, // Assume true until we find an image without alt
      metaTags: false,
      robots: false,
      secureHttps: false,
      headers: false,
    };
    
    // Check page title
    const title = document.querySelector('title');
    seoResults.title = !!title && title.textContent!.length > 0;
    
    // Check meta description
    const description = document.querySelector('meta[name="description"]');
    seoResults.description = !!description && 
      description.getAttribute('content')!.length > 0;
    
    // Check canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    seoResults.canonical = !!canonical;
    
    // Check OpenGraph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    seoResults.openGraph = ogTags.length > 0;
    
    // Check Twitter Card tags
    const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
    seoResults.twitter = twitterTags.length > 0;
    
    // Check JSON-LD structured data
    const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
    seoResults.jsonLd = jsonLd.length > 0;
    
    // Check mobile optimization
    const viewport = document.querySelector('meta[name="viewport"]');
    seoResults.mobileOptimization = !!viewport;
    
    // Check image alt tags
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('role')?.includes('presentation')) {
        seoResults.imgAltTags = false;
      }
    });
    
    // Check robots meta tag
    const robots = document.querySelector('meta[name="robots"]');
    seoResults.robots = !!robots;
    
    // Check if using HTTPS
    seoResults.secureHttps = window.location.protocol === 'https:';
    
    // Check for proper headers (limited as we can't check HTTP headers from client)
    const h1Count = document.querySelectorAll('h1');
    const hasProperHeadings = h1Count.length === 1;
    seoResults.headers = hasProperHeadings;
    
    setResults(seoResults);
    setLoading(false);
  };

  const getScore = (): number => {
    if (!results) return 0;
    
    const total = Object.values(results).filter(v => v === true).length;
    return Math.round((total / Object.keys(results).length) * 100);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">SEO Check Results</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Overall Score
            </div>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-primary">{getScore()}%</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {results && Object.entries(results).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <div className="text-gray-700 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className={`font-medium ${value ? 'text-green-500' : 'text-red-500'}`}>
                  {value ? '✓ Passed' : '✗ Failed'}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={runSeoCheck} 
            className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Recheck
          </button>
        </>
      )}
    </div>
  );
}
