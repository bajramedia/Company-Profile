"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Logo, LanguageSwitcher, AnimatedText, WhatsAppChat } from '@/components';
import { useLanguage } from '@/context/LanguageContext';
import { Sun, Moon } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
}

interface AboutContent {
  id: number;
  section_key: string;
  title_en: string;
  title_id: string;
  content_en: string;
  content_id: string;
  is_active: boolean;
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
  const [aboutContent, setAboutContent] = useState<{[key: string]: any}>({});
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setTeamLoading(true);
        const response = await fetch('/api/team');
        if (!response.ok) throw new Error('Failed to fetch team members');
        const data = await response.json();
        // Pastikan data memiliki format yang benar
        const formattedTeam = Array.isArray(data) ? data : (data.team || []);
        setTeamMembers(formattedTeam.map((member: Partial<TeamMember>) => ({
          ...member,
          image: member.image || '/images/team/placeholder.jpg',
          social: member.social || {}
        })));
      } catch (err) {
        setTeamError(err instanceof Error ? err.message : t('about.team.error') || 'Gagal memuat data tim');
      } finally {
        setTeamLoading(false);
      }
    };

    const fetchPartners = async () => {
      try {
        setPartnersLoading(true);
        const response = await fetch('/api/partners');
        if (!response.ok) throw new Error('Failed to fetch partners');
        const data = await response.json();
        // Pastikan data memiliki format yang benar
        const formattedPartners = Array.isArray(data) ? data : (data.partners || []);
        setPartners(formattedPartners.map((partner: Partial<Partner>) => ({
          ...partner,
          logo: partner.logo || '/images/partners/placeholder.jpg'
        })));
      } catch (err) {
        setPartnersError(err instanceof Error ? err.message : t('about.partners.error') || 'Gagal memuat data partner');
      } finally {
        setPartnersLoading(false);
      }
    };

    const fetchAboutContent = async () => {
      try {
        setContentLoading(true);
        const response = await fetch(`/api/content/about`);
        if (!response.ok) throw new Error('Failed to fetch about content');
        const data: AboutContent[] = await response.json();
        
        // Mengubah array data menjadi objek yang lebih mudah digunakan
        const contentObject = data.reduce((acc, item) => {
          acc[item.section_key] = {
            title_en: item.title_en,
            title_id: item.title_id,
            content_en: item.content_en,
            content_id: item.content_id,
          };
          return acc;
        }, {} as { [key: string]: any });

        setAboutContent(contentObject);
      } catch (err) {
        console.error('Error fetching about content:', err);
        setContentError(err instanceof Error ? err.message : 'Gagal memuat konten');
        setAboutContent({});
      } finally {
        setContentLoading(false);
      }
    };

    if (isClient) {
      fetchTeamMembers();
      fetchPartners();
      fetchAboutContent();
    }
  }, [isClient, language, t]);

  useEffect(() => {
    if (isClient) {
      const savedMode = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(savedMode);
      if (savedMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isClient]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { href: '/', key: 'nav.home' },
    { href: '/about', key: 'nav.about' },
    { href: '/services', key: 'nav.services' },
    { href: '/portfolio', key: 'nav.portfolio' },
    { href: '/blog', key: 'nav.blog' },
    { href: '/contact', key: 'nav.contact' },
  ];

  if (!isClient || contentLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (contentError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" />
          <p className="mt-4 text-lg text-red-500">{contentError}</p>
          <Button variant="primary" size="sm" className="mt-4" onClick={() => window.location.reload()}>
            {t('common.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 shadow-sm z-50 py-3 md:py-4 backdrop-blur-sm">
        <div className="w-[95%] mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
          <Logo size="md" />
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`transition-colors duration-300 text-[15px] font-medium ${'/about' === link.href ? 'text-green-500 dark:text-green-400' : 'text-gray-600 hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400'}`}>
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <button onClick={toggleDarkMode} className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={t(isDarkMode ? 'common.lightMode' : 'common.darkMode')}>
              {isDarkMode ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-blue-500" />}
            </button>
            <Link href="/contact">
              <Button variant="primary" size="sm">{t('nav.contact')}</Button>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 focus:outline-none" aria-label="Open menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h10"></path></svg>
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4 pt-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`transition-colors duration-300 text-base font-medium ${'/about' === link.href ? 'text-green-500 dark:text-green-400' : 'text-gray-600 hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400'}`} onClick={() => setIsMobileMenuOpen(false)}>
                  {t(link.key)}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex items-center justify-between">
              <LanguageSwitcher />
              <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label={t(isDarkMode ? 'common.lightMode' : 'common.darkMode')}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <Link href="/contact">
              <Button variant="primary" size="sm" className="w-full mt-6" onClick={() => setIsMobileMenuOpen(false)}>
                {t('common.freeConsultation')}
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="pt-20">
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50 about-hero" data-aos="fade-in">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <AnimatedText>
              <Heading variant="h1" color="foreground" className="mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold">
                {language === 'id' ? aboutContent['hero']?.title_id : aboutContent['hero']?.title_en}
              </Heading>
            </AnimatedText>
            <AnimatedText>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                {language === 'id' ? aboutContent['hero']?.content_id : aboutContent['hero']?.content_en}
              </p>
            </AnimatedText>
          </div>
        </section>

        <section className="py-16 md:py-24" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="relative" data-aos="fade-right">
                <Image 
                  src="/images/team-meeting.jpg"
                  alt={t('about.story.imageAlt') || 'Tim Bajramedia'} 
                  width={600} 
                  height={400} 
                  className="rounded-2xl shadow-lg w-full"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -z-10"></div>
              </div>
              <div data-aos="fade-left" data-aos-delay="200">
                <Heading variant="h2" color="foreground" className="mb-6">
                  {language === 'id' ? aboutContent['story']?.title_id : aboutContent['story']?.title_en}
                </Heading>
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
                  <div dangerouslySetInnerHTML={{ 
                    __html: language === 'id' ? aboutContent['story']?.content_id : aboutContent['story']?.content_en
                  }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              <div data-aos="fade-right">
                <Heading variant="h2" color="foreground" className="mb-6">
                  {language === 'id' ? aboutContent['mission']?.title_id : aboutContent['mission']?.title_en}
                </Heading>
                <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed" 
                     dangerouslySetInnerHTML={{ 
                       __html: language === 'id' ? aboutContent['mission']?.content_id : aboutContent['mission']?.content_en
                     }} />
              </div>
              <div data-aos="fade-left" data-aos-delay="200">
                <Heading variant="h2" color="foreground" className="mb-6">
                  {language === 'id' ? aboutContent['vision']?.title_id : aboutContent['vision']?.title_en}
                </Heading>
                <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                     dangerouslySetInnerHTML={{ 
                       __html: language === 'id' ? aboutContent['vision']?.content_id : aboutContent['vision']?.content_en
                     }} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h2" color="foreground" className="mb-12">
              {language === 'id' ? aboutContent['values']?.title_id : aboutContent['values']?.title_en}
            </Heading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 about-values-grid">
              {[
                { icon: '💡', key: 'innovation', title: t('about.values.innovation.title'), description: t('about.values.innovation.description') },
                { icon: '🤝', key: 'collaboration', title: t('about.values.collaboration.title'), description: t('about.values.collaboration.description') },
                { icon: '🏆', key: 'excellence', title: t('about.values.excellence.title'), description: t('about.values.excellence.description') },
                { icon: '❤️', key: 'passion', title: t('about.values.passion.title'), description: t('about.values.passion.description') },
              ].map((value, index) => (
                <div key={value.key} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow about-values-card" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h2" color="foreground" className="mb-4">
              {language === 'id' ? aboutContent['team']?.title_id : aboutContent['team']?.title_en}
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
              {language === 'id' ? aboutContent['team']?.content_id : aboutContent['team']?.content_en}
            </p>
            {teamLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 about-team-grid">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center animate-pulse">
                    <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                  </div>
                ))}
              </div>
            )}
            {teamError && <p className="text-red-500">{teamError}</p>}
            {!teamLoading && !teamError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 about-team-grid">
                {teamMembers.map((member, index) => (
                  <div key={member.id} className="text-center about-team-card" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full">
                      <Image src={member.image || '/images/team/placeholder.jpg'} alt={member.name} width={160} height={160} className="object-cover shadow-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-green-500 font-medium">{language === 'id' ? member.roleId : member.role}</p>
                    <div className="mt-4 flex justify-center space-x-4">
                      {member.social.linkedin && (
                        <Link href={member.social.linkedin} target="_blank" className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </Link>
                      )}
                      {member.social.github && (
                        <Link href={member.social.github} target="_blank" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </Link>
                      )}
                      {member.social.instagram && (
                        <Link href={member.social.instagram} target="_blank" className="text-gray-600 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h2" color="foreground" className="mb-12">
              {language === 'id' ? aboutContent['partners']?.title_id : aboutContent['partners']?.title_en}
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
              {language === 'id' ? aboutContent['partners']?.content_id : aboutContent['partners']?.content_en}
            </p>
            {partnersLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-1"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-4"></div>
                  </div>
                ))}
              </div>
            )}
            {partnersError && <p className="text-red-500">{partnersError}</p>}
            {!partnersLoading && !partnersError && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {partners.slice(0, 2).map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-left flex flex-col"
                    data-aos="zoom-in"
                  >
                    <div className="relative h-16 mb-6 flex items-start">
                      <Image
                        src={partner.logo}
                        alt={language === 'id' ? partner.nameId : partner.name}
                        width={150}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {language === 'id' ? partner.nameId : partner.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                      {language === 'id' ? partner.descriptionId : partner.description}
                    </p>
                    <Link
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto"
                    >
                      <Button variant="outline" size="sm">
                        {t('about.partners.visit')}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h2" color="foreground" className="mb-6">
              {language === 'id' ? aboutContent['cta']?.title_id : aboutContent['cta']?.title_en}
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              {language === 'id' ? aboutContent['cta']?.content_id : aboutContent['cta']?.content_en}
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">{t('common.contactUs')}</Button>
            </Link>
          </div>
        </section>
      </main>

      <WhatsAppChat phoneNumber="6285739402436" message={t('whatsapp.aboutPage')} />
    </div>
  );
} 