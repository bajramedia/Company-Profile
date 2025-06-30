"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { Button, Heading, Text, Logo, LanguageSwitcher, AnimatedText, SupportedBy, CTA, Blog, Portfolio, Team, WhatsAppChat, Navbar, Home } from "@/components";
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
          {/* Hero Section - Enhanced */}
          <section className="relative min-h-screen overflow-hidden pt-16 bg-gradient-to-br from-white via-gray-50 to-green-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="h-full flex flex-col md:flex-row relative z-10">
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
                      className="rounded-br-[120px] shadow-2xl transform hover:scale-105 transition-transform duration-700"
                    />
                    {/* Modern gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 dark:to-gray-900/20 transition-all duration-300"></div>
                    {/* Subtle primary color overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-transparent to-transparent transition-colors duration-300"></div>
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
                  className="opacity-10"
                />
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/85 transition-colors duration-300"></div>
              </div>

              {/* Content Container - Enhanced */}
              <div className="w-full md:w-2/5 flex items-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative bg-white dark:bg-gray-900 md:bg-transparent transition-colors duration-300 z-10 py-20 md:py-0">
                <div className="max-w-lg w-full">
                  <AnimatedText as="div">
                    <div className="mb-6 flex items-center space-x-2">
                      <div className="w-12 h-0.5 bg-green-500"></div>
                      <span className="text-green-500 font-medium text-sm tracking-wider uppercase">
                        {language === 'id' ? 'Solusi Digital Terdepan' : 'Leading Digital Solutions'}
                      </span>
                    </div>
                  </AnimatedText>

                  <AnimatedText as="div">
                    <Heading variant="h1" color="foreground" className="mb-8 text-[32px] md:text-[38px] lg:text-[44px] xl:text-[48px] font-extrabold leading-[1.2] tracking-tight">
                      {t('hero.title.part1')}{' '}
                      <span className="text-green-500 relative inline-block">
                        <span className="relative z-10">{t('hero.title.highlight')}</span>
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-green-500/20 -z-0 transform -skew-x-12"></span>
                      </span>
                      {' '}{t('hero.title.part2')}
                    </Heading>
                  </AnimatedText>

                  <AnimatedText as="div">
                    <Text color="secondary" className="mb-10 text-[16px] md:text-[17px] leading-relaxed tracking-wide max-w-lg">
                      {t('hero.subtitle')}
                    </Text>
                  </AnimatedText>

                  <AnimatedText as="div">
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                      <Link href="/about">
                        <Button variant="primary" size="md" className="px-8 py-4 shadow-2xl transform hover:scale-105 transition-transform duration-700 hover:shadow-xl font-semibold w-full sm:w-auto transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                          {t('hero.cta.consultation')}
                        </Button>
                      </Link>
                      <Link href="/portfolio">
                        <Button variant="outline" size="md" className="px-8 py-4 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold w-full sm:w-auto transform hover:scale-105 transition-all duration-300">
                          {t('hero.cta.portfolio')}
                        </Button>
                      </Link>
                    </div>
                  </AnimatedText>

                  {/* Stats or features */}
                  <AnimatedText as="div">
                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500 mb-1">50+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {language === 'id' ? 'Proyek Selesai' : 'Projects Done'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500 mb-1">5+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {language === 'id' ? 'Tahun Pengalaman' : 'Years Experience'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500 mb-1">24/7</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {language === 'id' ? 'Dukungan' : 'Support'}
                        </div>
                      </div>
                    </div>
                  </AnimatedText>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </section>

          {/* Spacer */}
          <div className="py-8 bg-gradient-to-b from-green-50/30 to-white dark:from-gray-800 dark:to-gray-900"></div>

          {/* About Section */}
          <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div>
                  <div className="mb-6 flex items-center space-x-2">
                    <div className="w-12 h-0.5 bg-green-500"></div>
                    <span className="text-green-500 font-medium text-sm tracking-wider uppercase">
                      {language === 'id' ? 'Tentang Kami' : 'About Us'}
                    </span>
                  </div>

                  <Heading variant="h2" color="foreground" className="mb-6 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold leading-[1.3] tracking-tight">
                    {language === 'id'
                      ? 'Menghadirkan Solusi Digital Terdepan untuk Bisnis Anda'
                      : 'Delivering Cutting-Edge Digital Solutions for Your Business'
                    }
                  </Heading>

                  <Text color="secondary" className="mb-8 text-[16px] leading-relaxed">
                    {language === 'id'
                      ? 'Dengan pengalaman lebih dari 5 tahun di industri teknologi, Bajramedia telah membantu puluhan klien mengembangkan bisnis mereka melalui solusi digital yang inovatif. Kami berkomitmen memberikan layanan terbaik dengan teknologi terdepan.'
                      : 'With over 5 years of experience in the technology industry, Bajramedia has helped dozens of clients grow their businesses through innovative digital solutions. We are committed to providing the best service with cutting-edge technology.'
                    }
                  </Text>

                  {/* Achievement Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">50+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'id' ? 'Proyek Selesai' : 'Projects Completed'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">5+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'id' ? 'Tahun Pengalaman' : 'Years Experience'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">100%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'id' ? 'Kepuasan Klien' : 'Client Satisfaction'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/about">
                      <Button variant="primary" size="md" className="px-8 py-4 transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        {language === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}
                      </Button>
                    </Link>
                    <Link href="/portfolio">
                      <Button variant="outline" size="md" className="px-8 py-4 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transform hover:scale-105 transition-all duration-300">
                        {language === 'id' ? 'Lihat Portfolio' : 'View Portfolio'}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="relative">
                  <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/images/team.jpg"
                      alt={language === 'id' ? 'Tim Bajramedia' : 'Bajramedia Team'}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-2xl transform hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 via-transparent to-transparent"></div>

                    {/* Floating Card */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {language === 'id' ? 'Tim Professional Siap Membantu Anda' : 'Professional Team Ready to Help You'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Spacer */}
          <div className="py-8 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800"></div>

          {/* Testimonials Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="mb-6 flex items-center justify-center space-x-2">
                  <div className="w-12 h-0.5 bg-green-500"></div>
                  <span className="text-green-500 font-medium text-sm tracking-wider uppercase">
                    {language === 'id' ? 'Testimoni Klien' : 'Client Testimonials'}
                  </span>
                  <div className="w-12 h-0.5 bg-green-500"></div>
                </div>

                <Heading variant="h2" color="foreground" className="mb-4 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold">
                  {language === 'id' ? 'Kata Mereka Tentang Kami' : 'What They Say About Us'}
                </Heading>

                <Text color="secondary" className="max-w-2xl mx-auto text-[16px] leading-relaxed">
                  {language === 'id'
                    ? 'Kepercayaan klien adalah prioritas utama kami. Berikut testimoni dari klien yang telah merasakan layanan terbaik dari Bajramedia.'
                    : 'Client trust is our top priority. Here are testimonials from clients who have experienced the best service from Bajramedia.'
                  }
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Text color="secondary" className="mb-6 italic text-[14px] leading-relaxed text-gray-600 dark:text-gray-300">
                    "{language === 'id'
                      ? 'Tim Bajramedia sangat profesional dalam mengembangkan website perusahaan kami. Hasilnya melebihi ekspektasi dan sangat membantu meningkatkan brand awareness.'
                      : 'Bajramedia team is very professional in developing our company website. The results exceeded expectations and really helped increase brand awareness.'
                    }"
                  </Text>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      A
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Andi Prasetyo</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">CEO, PT Maju Bersama</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Text color="secondary" className="mb-6 italic text-[14px] leading-relaxed text-gray-600 dark:text-gray-300">
                    "{language === 'id'
                      ? 'Pelayanan yang luar biasa! Sistem manajemen yang dikembangkan Bajramedia sangat membantu operasional bisnis kami menjadi lebih efisien.'
                      : 'Extraordinary service! The management system developed by Bajramedia really helps our business operations become more efficient.'
                    }"
                  </Text>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      S
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Sari Wijaya</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Owner, Sari Beauty Clinic</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Text color="secondary" className="mb-6 italic text-[14px] leading-relaxed text-gray-600 dark:text-gray-300">
                    "{language === 'id'
                      ? 'Aplikasi mobile yang dikembangkan sangat user-friendly dan sesuai dengan kebutuhan bisnis kami. Tim support juga sangat responsif.'
                      : 'The mobile application developed is very user-friendly and suits our business needs. The support team is also very responsive.'
                    }"
                  </Text>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      R
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Rudi Hartanto</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Director, RH Logistics</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Spacer */}
          <div className="py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"></div>

          {/* Blog Section */}
          <Blog />

          {/* Spacer */}
          <div className="py-8 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800 dark:to-gray-900"></div>

          {/* CTA Section */}
          <CTA />
        </main>

        {/* Footer */}
        {/* Footer will be handled by ClientLayout */}

        {/* Floating Dark Mode Toggle Button */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={toggleDarkMode}
            className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-2xl transform hover:scale-105 transition-transform duration-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 group dark-mode-button"
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

