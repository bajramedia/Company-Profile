"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Logo, LanguageSwitcher, AnimatedText, Footer } from '@/components';
import { useLanguage } from '@/context/LanguageContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Team members will be fetched from API

// Partners data will be fetched from API

interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  roleId: string;
  bio: string;
  bioId: string;
  image: string;
  social: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    behance?: string;
    tiktok?: string;
    youtube?: string;
  };
}

interface Partner {
  id: string | number;
  name: string;
  nameId: string;
  description: string;
  descriptionId: string;
  logo: string;
  website: string;
  type: string;
}

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [partnersError, setPartnersError] = useState<string | null>(null);

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

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setTeamLoading(true);
        setTeamError(null);

        const response = await fetch('/api/team-members');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        setTeamError(error instanceof Error ? error.message : 'Failed to load team members');
      } finally {
        setTeamLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setPartnersLoading(true);
        setPartnersError(null);

        const response = await fetch('/api/partners');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPartners(data);
      } catch (error) {
        console.error('Failed to fetch partners:', error);
        setPartnersError(error instanceof Error ? error.message : 'Failed to load partners');
      } finally {
        setPartnersLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 shadow-sm z-50 py-3 md:py-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
          <Logo size="md" />
          <div className="hidden md:flex items-center space-x-7">
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">{t('nav.home')}</Link>
              <Link href="/about" className="text-primary transition-colors">{t('nav.about')}</Link>
              <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">{t('nav.services')}</Link>
              <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">{t('nav.portfolio')}</Link>
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">{t('nav.blog')}</Link>
            </nav>
            <LanguageSwitcher className="mr-4" />
            <Button variant="primary" size="sm">{t('nav.contact')}</Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-20 pb-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400" data-aos="fade-right">
            <Link href="/" className="hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white">{t('nav.about')}</span>
          </nav>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <Heading variant="h1" className="text-[32px] md:text-[44px] lg:text-[52px] font-bold mb-6">
                {t('about.title.main')} <span className="text-primary">{t('about.title.highlight')}</span>
              </Heading>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                {t('about.subtitle')}
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-16" data-aos="fade-up" data-aos-delay="200">
              <Image
                src="/images/team-meeting.jpg"
                alt={t('about.hero.imageCaption')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t('about.hero.imageCaption')}</h3>
                <p className="text-white/80">{t('about.hero.imageDescription')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Background Story */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.background.title')}
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none" data-aos="fade-up" data-aos-delay="200">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t('about.background.content1')}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t('about.background.content2')}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('about.background.content3')}
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Vision */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg" data-aos="fade-right">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('about.vision.title')}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  {t('about.vision.content')}
                </p>
              </div>

              {/* Mission */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg" data-aos="fade-left">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('about.mission.title')}
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t('about.mission.point1')}</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t('about.mission.point2')}</p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t('about.mission.point3')}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.team.title')} <span className="text-primary">{t('about.team.titleHighlight')}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('about.team.subtitle')}
              </p>
            </div>

            {/* Team Members Grid */}
            {teamLoading ? (
              // Loading State
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg animate-pulse"
                  >
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                      <div className="flex justify-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : teamError ? (
              // Error State
              <div className="text-center py-12">
                <div className="text-red-500 dark:text-red-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('about.team.error.title') || 'Failed to Load Team'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.team.error.message') || 'Unable to load team members. Please try again later.'}
                </p>
              </div>
            ) : teamMembers.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('about.team.empty.title') || 'No Team Members'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.team.empty.message') || 'Team members will appear here once they are added.'}
                </p>
              </div>
            ) : (
              // Data Loaded Successfully
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h4>
                      <p className="text-primary font-medium mb-3">
                        {language === 'id' ? member.roleId : member.role}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {language === 'id' ? member.bioId : member.bio}
                      </p>

                      {/* Social Links - Only show if any social links exist */}
                      {Object.values(member.social).some(link => link && link !== '') && (
                        <div className="flex justify-center space-x-3">
                          {member.social.linkedin && member.social.linkedin !== '' && (
                            <a
                              href={member.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </a>
                          )}
                          {member.social.github && member.social.github !== '' && (
                            <a
                              href={member.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                            </a>
                          )}
                          {member.social.instagram && member.social.instagram !== '' && (
                            <a
                              href={member.social.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            </a>
                          )}
                          {member.social.behance && member.social.behance !== '' && (
                            <a
                              href={member.social.behance}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.125 1.074.32 1.485.58.41.263.733.597.96 1.02.225.42.34.952.34 1.59 0 .71-.183 1.31-.55 1.79-.368.48-.88.84-1.543 1.1.893.26 1.54.65 1.92 1.18.38.53.57 1.18.57 1.95 0 .68-.122 1.27-.365 1.78-.243.51-.595.93-1.06 1.26-.467.33-1.04.56-1.716.7-.678.14-1.454.21-2.34.21H0V4.503h6.938zM3.24 7.248v2.906h3.22c.4 0 .73-.061.99-.185.26-.123.47-.295.63-.516.16-.22.24-.48.24-.78 0-.56-.17-.99-.51-1.29-.34-.3-.822-.45-1.44-.45H3.24zm0 5.154v3.462h3.76c.42 0 .78-.066 1.07-.2.29-.13.52-.31.69-.54.17-.23.25-.5.25-.81 0-.32-.08-.59-.24-.81-.16-.22-.39-.39-.68-.51-.29-.12-.64-.18-1.05-.18H3.24zm11.697-12.52c.827 0 1.576.095 2.246.285.67.19 1.24.468 1.71.834.47.365.83.822 1.08 1.368.25.546.375 1.162.375 1.846 0 .684-.125 1.3-.375 1.846-.25.546-.61 1.003-1.08 1.368-.47.366-1.04.644-1.71.834-.67.19-1.419.285-2.246.285-.827 0-1.576-.095-2.246-.285-.67-.19-1.24-.468-1.71-.834-.47-.365-.83-.822-1.08-1.368-.25-.546-.375-1.162-.375-1.846 0-.684.125-1.3.375-1.846.25-.546.61-1.003 1.08-1.368.47-.366 1.04-.644 1.71-.834.67-.19 1.419-.285 2.246-.285z" />
                              </svg>
                            </a>
                          )}
                          {member.social.tiktok && member.social.tiktok !== '' && (
                            <a
                              href={member.social.tiktok}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                              </svg>
                            </a>
                          )}
                          {member.social.youtube && member.social.youtube !== '' && (
                            <a
                              href={member.social.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Our Partners */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.partners.title')} <span className="text-primary">{t('about.partners.titleHighlight')}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('about.partners.subtitle')}
              </p>
            </div>

            {/* Partners Grid */}
            {partnersLoading ? (
              // Loading State
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-pulse text-center"
                  >
                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-6"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : partnersError ? (
              // Error State
              <div className="text-center py-12">
                <div className="text-red-500 dark:text-red-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('about.partners.error.title') || 'Failed to Load Partners'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.partners.error.message') || 'Unable to load partners. Please try again later.'}
                </p>
              </div>
            ) : partners.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('about.partners.empty.title') || 'No Partners'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('about.partners.empty.message') || 'Partners will appear here once they are added.'}
                </p>
              </div>
            ) : (
              // Data Loaded Successfully
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {partners.map((partner, index) => (
                  <div
                    key={partner.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                    data-aos="fade-up"
                    data-aos-delay={index * 200}
                  >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {language === 'id' ? partner.nameId : partner.name}
                    </h4>
                    <p className="text-primary font-medium mb-4">
                      {partner.type}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {language === 'id' ? partner.descriptionId : partner.description}
                    </p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      {t('about.partners.visitWebsite')}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>


      </main>

      {/* Dark Mode Toggle */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleDarkMode}
          className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:shadow-xl transition-all duration-300"
        >
          {isDarkMode ? <span className="text-2xl">☀️</span> : <span className="text-2xl">🌙</span>}
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 