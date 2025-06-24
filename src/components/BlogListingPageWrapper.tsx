"use client";

import React, { Suspense } from 'react';
import BlogListingPage from '@/components/BlogListingPage';

// Client wrapper component for the blog listing page
export default function BlogListingPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16 flex items-center justify-center">
        <div className="text-gray-800 dark:text-gray-200 text-xl">Loading blog posts...</div>
      </div>
    }>
      <BlogListingPage />
    </Suspense>
  );
}
