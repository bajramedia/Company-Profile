"use client";

import dynamic from 'next/dynamic';

// Import BlogListingPage with dynamic import to avoid SSR issues
const BlogListingPageWrapper = dynamic(() => import('@/components/BlogListingPageWrapper'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16 flex items-center justify-center">
      <div className="animate-pulse">Loading blog posts...</div>
    </div>
  )
});

export default function BlogPage() {
  return <BlogListingPageWrapper />;
}
