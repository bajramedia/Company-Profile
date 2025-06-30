"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Logo, LanguageSwitcher, WhatsAppChat } from '@/components';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="relative z-10 py-6">
        <div className="w-[95%] mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
          <div className="flex items-center">
            <Logo size="md" />
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher className="text-gray-700 dark:text-gray-300" />
            <Link href="/">
              <Button variant="primary" size="sm">
                {t('nav.home')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 md:px-8" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="w-[90%] mx-auto text-center relative">
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            <div className="text-[120px] md:text-[180px] font-bold text-gray-200 dark:text-gray-700 leading-none">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('404.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('404.description')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('404.backToHome')}
              </Button>
            </Link>

            <Link href="/blog">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {t('404.readBlog')}
              </Button>
            </Link>

            <Link href="/portfolio">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {t('404.viewPortfolio')}
              </Button>
            </Link>
          </div>

          {/* Popular Pages */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t('404.popularPages')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/services" className="group p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg">
                <div className="text-primary text-2xl mb-2">🚀</div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {t('404.ourServices')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('404.servicesDescription')}
                </p>
              </Link>

              <Link href="/services/web-development" className="group p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg">
                <div className="text-primary text-2xl mb-2">🌐</div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {t('services.website.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('404.webDevDescription')}
                </p>
              </Link>

              <Link href="/services/mobile-apps" className="group p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg">
                <div className="text-primary text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {t('services.mobile.title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('404.mobileDescription')}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>{t('404.copyright')}</p>
      </footer>

      {/* WhatsApp Chat */}
      <WhatsAppChat
        phoneNumber="6285739402436"
        message={t('404.whatsappMessage')}
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
