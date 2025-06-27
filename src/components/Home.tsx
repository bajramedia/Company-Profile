"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedText from './AnimatedText';
import { usePublicSettings } from '@/hooks/useSettings';
import Logo from './Logo';
import Button from './Button';
import Heading from './Heading';
import Text from './Text';
import LanguageSwitcher from './LanguageSwitcher';
import Blog from './Blog';
import CTA from './CTA';
import Team from './Team';
import Navbar from './Navbar';
import Script from 'next/script';
import { generateWebsiteSchema, generateLocalBusinessSchema } from '@/lib/jsonld';

export default function Home() {
  const { t, language } = useLanguage();
  const { settings: publicSettings, loading: settingsLoading } = usePublicSettings();

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

  // Generate JSON-LD schema for the website
  const websiteSchema = generateWebsiteSchema({
    name: publicSettings?.siteName || 'Bajramedia',
    url: 'https://bajramedia.com',
    description: publicSettings?.siteDescription || 'Creative Digital Agency & Blog Platform',
    logo: 'https://bajramedia.com/images/logo.png',
    contactPoint: {
      telephone: publicSettings?.contactPhone || '',
      email: publicSettings?.contactEmail || 'info@bajramedia.com',
      contactType: 'customer service',
    },
    address: {
      addressLocality: 'Bali',
      addressCountry: 'Indonesia',
    },
    sameAs: [
      publicSettings?.socialLinks?.facebook,
      publicSettings?.socialLinks?.twitter,
      publicSettings?.socialLinks?.instagram,
      publicSettings?.socialLinks?.linkedin,
    ].filter(Boolean) as string[],
  });

  // Generate local business schema
  const localBusinessSchema = generateLocalBusinessSchema({
    name: publicSettings?.siteName || 'Bajramedia',
    url: 'https://bajramedia.com',
    description: publicSettings?.siteDescription || 'Creative Digital Agency & Blog Platform',
    logo: 'https://bajramedia.com/images/logo.png',
    contactPoint: {
      telephone: publicSettings?.contactPhone || '',
      email: publicSettings?.contactEmail || 'info@bajramedia.com',
    },
    address: {
      addressLocality: 'Bali',
      addressCountry: 'Indonesia',
    },
  });

  return (
    <>
      {/* Add structured data for SEO */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Use Navbar component instead of hardcoded header */}
        <Navbar activeTab="home" showDropdown={true} />

        {/* Rest of your component content... */}
        {/* Blog Section */}
        <Blog />

        {/* Team Section */}
        <Team />

        {/* CTA Section */}
        <CTA />

        {/* Footer Section */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden pt-16 pb-10 transition-colors duration-300">
          {/* Footer content... */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            {/* Footer content here - copy from original page.tsx */}
          </div>

          {/* "Back to top" button */}
          <div className="absolute right-6 bottom-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
              aria-label="Back to top"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </footer>

        {/* Floating Dark Mode Toggle Button */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={toggleDarkMode}
            className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group dark-mode-button"
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              // Sun icon for light mode
              <svg
                className="w-6 h-6 text-yellow-500 transform group-hover:rotate-180 transition-transform duration-300"
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
              // Moon icon for dark mode
              <svg
                className="w-6 h-6 text-gray-700 transform group-hover:rotate-12 transition-transform duration-300"
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
      </div>
    </>
  );
}
