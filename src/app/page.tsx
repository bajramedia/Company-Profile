"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import { Button, Heading, Text, Logo, LanguageSwitcher, AnimatedText, SupportedBy, CTA, Blog, Team, WhatsAppChat, Navbar, Home } from "@/components";
import { useLanguage } from "@/context/LanguageContext";
import { usePublicSettings } from "@/hooks/useSettings";
import EnhancedSEO from '@/components/EnhancedSEO';

export default function HomePage() {
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

  return (
    <>
      <EnhancedSEO
        title="Professional Digital Solutions Agency"
        description="Transform your business with our comprehensive digital solutions. Web development, mobile apps, UI/UX design, digital marketing, and more. Based in Bali, serving globally."
        keywords={[
          'digital agency Bali',
          'web development Indonesia',
          'mobile app development',
          'UI UX design services',
          'digital marketing agency',
          'system development',
          'game development',
          'creative agency Bali',
          'software development Indonesia',
          'digital transformation'
        ]}
        type="website"
        schema="Organization"
        organization={{
          name: 'Bajramedia',
          url: 'https://bajramedia.com',
          logo: 'https://bajramedia.com/images/logo.png',
          sameAs: [
            'https://instagram.com/bajramedia',
            'https://linkedin.com/company/bajramedia',
            'https://github.com/bajramedia'
          ]
        }}
        services={[
          {
            name: 'Web Development',
            description: 'Custom website and web application development using latest technologies',
            url: 'https://bajramedia.com/services/web-development'
          },
          {
            name: 'Mobile App Development',
            description: 'Native and cross-platform mobile application development',
            url: 'https://bajramedia.com/services/mobile-apps'
          },
          {
            name: 'UI/UX Design',
            description: 'User-centered design for web and mobile applications',
            url: 'https://bajramedia.com/services/uiux-design'
          },
          {
            name: 'Digital Marketing',
            description: 'Comprehensive digital marketing strategies and implementation',
            url: 'https://bajramedia.com/services/digital-marketing'
          },
          {
            name: 'System Development',
            description: 'Enterprise system development and integration solutions',
            url: 'https://bajramedia.com/services/sistem-development'
          }
        ]}
        faq={[
          {
            question: 'What services does Bajramedia offer?',
            answer: 'Bajramedia offers comprehensive digital solutions including web development, mobile app development, UI/UX design, digital marketing, system development, and game development services.'
          },
          {
            question: 'Where is Bajramedia located?',
            answer: 'Bajramedia is based in Bali, Indonesia, but we serve clients globally with our digital solutions and remote collaboration capabilities.'
          },
          {
            question: 'How long does a typical project take?',
            answer: 'Project timelines vary based on scope and complexity. Web development projects typically take 4-12 weeks, while mobile apps may take 8-16 weeks. We provide detailed timelines during project planning.'
          },
          {
            question: 'Do you provide ongoing support after project completion?',
            answer: 'Yes, we offer comprehensive maintenance and support packages to ensure your digital solutions continue to perform optimally after launch.'
          }
        ]}
        breadcrumbs={[
          { name: 'Home', url: 'https://bajramedia.com' }
        ]}
      />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Header - Use Navbar component instead of hardcoded */}
        <Navbar activeTab="home" showDropdown={true} />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className="relative h-screen overflow-hidden pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="h-full flex flex-col md:flex-row">
              {/* Desktop Image */}
              <div className="md:w-3/5 h-full relative bg-white dark:bg-gray-900 overflow-hidden hidden md:block transition-colors duration-300">
                <div className="absolute inset-0">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/team-meeting-alt.jpg"
                      alt={t('hero.imageAlt')}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      priority
                      className="rounded-br-[120px] shadow-lg"
                    />
                    {/* Light gradient overlay only */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent transition-all duration-300"></div>
                    {/* Subtle primary color overlay */}
                    <div className="absolute inset-0 transition-colors duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Mobile Image Background */}
              <div className="absolute inset-0 md:hidden">
                <Image
                  src="/images/team-meeting-alt.jpg"
                  alt={t('hero.imageAlt')}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  priority
                  className="opacity-15"
                />
                <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/80 transition-colors duration-300"></div>
              </div>

              {/* Content Container */}
              <div className="w-full md:w-2/5 flex items-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative bg-white dark:bg-gray-900 md:bg-transparent transition-colors duration-300 z-10">
                <div className="max-w-lg w-full">
                  <AnimatedText as="div">
                    <Heading variant="h1" color="foreground" className="mb-6 mt-8 text-[28px] md:text-[34px] lg:text-[40px] xl:text-[44px] font-bold leading-[1.3] tracking-wide">
                      {t('hero.title.part1')}{' '}
                      <span className="text-green-500 relative">
                        <span className="relative z-10">{t('hero.title.highlight')}</span>
                        <span className="absolute bottom-0.5 left-0 w-full h-2.5 bg-green-500/10 -z-0"></span>
                      </span>
                      {' '}{t('hero.title.part2')}
                    </Heading>
                  </AnimatedText>

                  <AnimatedText as="div">
                    <Text color="secondary" className="mb-10 text-[15px] md:text-[16px] leading-loose tracking-wide max-w-md">
                      {t('hero.subtitle')}
                    </Text>
                  </AnimatedText>

                  <AnimatedText as="div">
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                      <Button variant="primary" size="md" className="px-6 py-3 shadow-sm font-medium w-full sm:w-auto">
                        {t('hero.cta.consultation')}
                      </Button>
                      <Button variant="outline" size="md" className="px-6 py-3 border-green-500 text-green-500 hover:bg-green-500/5 font-medium w-full sm:w-auto">
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

        {/* WhatsApp Chat */}
        <WhatsAppChat
          phoneNumber="6285739402436"
          message="Halo! Saya tertarik dengan layanan Bajramedia. Bisa konsultasi gratis?"
        />
      </div>
    </>
  );
}

