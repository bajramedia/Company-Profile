"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import { Button, Heading, Text, Logo, LanguageSwitcher, AnimatedText, SupportedBy, CTA, Blog, Team } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import { usePublicSettings } from "@/hooks/useSettings";
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
        document.body.classList.add('dark-mode');
      }
    }
  }, []);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;

      if (newMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-mode');
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

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"> {/* Added dark mode support */}
        <header className="fixed top-0 left-0 right-0 bg-[var(--navbar-background)] dark:bg-gray-800/95 shadow-sm z-50 py-3 md:py-4 backdrop-blur-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            <div className="hidden md:flex items-center space-x-7">
              <nav className="flex space-x-6 md:space-x-8">
                <AnimatedText as="span">
                  <a href="#" className="text-foreground hover:text-primary transition-colors text-[15px]">{t('nav.home')}</a>
                </AnimatedText>
                <AnimatedText as="span">
                  <a href="#" className="text-foreground hover:text-primary transition-colors text-[15px]">{t('nav.about')}</a>
                </AnimatedText>
                <AnimatedText as="span">
                  <a href="#" className="text-foreground hover:text-primary transition-colors text-[15px] relative group">
                    {t('nav.services')}
                    <span className="inline-block ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                </AnimatedText>
                <AnimatedText as="span">
                  <a href="#" className="text-foreground hover:text-primary transition-colors text-[15px]">{t('nav.portfolio')}</a>
                </AnimatedText>
                <AnimatedText as="span">
                  <a href="/blog" className="text-foreground hover:text-primary transition-colors text-[15px]">{t('nav.blog')}</a>
                </AnimatedText>
              </nav>
              <LanguageSwitcher className="mr-4 text-foreground" />
              <AnimatedText as="span">
                <Button variant="primary" size="sm" className="px-5 py-2 rounded-md font-medium">
                  {t('nav.contact')}
                </Button>
              </AnimatedText>
            </div>
            <div className="flex items-center space-x-4 md:hidden">
              <LanguageSwitcher className="text-foreground" />
              <button className="text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Rest of your component ... */}
        <section className="relative h-screen overflow-hidden pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          {/* Hero section content */}
        </section>

        <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
          {/* Services section content */}
        </section>

        <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
          {/* Challenges section content */}
        </section>

        {/* Team Section */}
        <Team />

        {/* Blog Section */}
        <Blog />

        {/* CTA Section */}
        <CTA />

        {/* Footer Section */}
        {/* Footer will be handled by ClientLayout */}

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
