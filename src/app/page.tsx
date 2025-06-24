"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import { Button, Heading, Text, Logo, LanguageSwitcher, AnimatedText, SupportedBy, CTA, Blog, Team } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import { usePublicSettings } from "@/hooks/useSettings";

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
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
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="h-full flex flex-col md:flex-row">
            <div className="md:w-3/5 h-full relative bg-white dark:bg-gray-900 overflow-hidden hidden md:block transition-colors duration-300">
              <div className="absolute inset-0">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/team-meeting-alt.jpg"
                    alt={t('hero.imageAlt')}
                    fill
                    style={{objectFit: 'cover', objectPosition: 'center'}}
                    priority
                    className="rounded-br-[120px] shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/60"></div>
                  <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/5 flex items-center px-4 sm:px-6 md:px-10 lg:px-14 relative bg-white dark:bg-gray-900 transition-colors duration-300">
              <div className="max-w-md mt-4">
                <AnimatedText as="div">
                  <Heading variant="h1" color="foreground" className="mb-4 text-[28px] md:text-[34px] lg:text-[40px] font-bold leading-tight">
                    {t('hero.title.part1')}
                    <span className="text-primary relative">
                      <span className="relative z-10"> {t('hero.title.highlight')}</span>
                      <span className="absolute bottom-0.5 left-0 w-full h-2.5 bg-primary/10 -z-0"></span>
                    </span>
                    {t('hero.title.part2')}
                  </Heading>
                </AnimatedText>

                <AnimatedText as="div">
                  <Text color="secondary" className="mb-8 text-[14px] tracking-wide">
                    {t('hero.subtitle')}
                  </Text>
                </AnimatedText>

                <AnimatedText as="div">
                  <div className="flex flex-wrap gap-4 mb-12">
                    <Button variant="primary" size="md" className="px-5 py-2.5 shadow-sm font-medium">
                      {t('hero.cta.consultation')}
                    </Button>
                    <Button variant="outline" size="md" className="px-5 py-2.5 border-primary text-primary hover:bg-primary/5 font-medium">
                      {t('hero.cta.portfolio')}
                    </Button>
                  </div>
                </AnimatedText>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <Blog />
        
        {/* CTA Section */}
        <CTA />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden pt-16 pb-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="text-center py-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              {publicSettings?.footerText || `© ${new Date().getFullYear()} ${publicSettings?.siteName || 'Bajramedia'}. ${t('footer.rightsReserved') || 'Hak Cipta Dilindungi'}`}
            </p>
          </div>
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
  );
}
