"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Logo, LanguageSwitcher, AnimatedText, WhatsAppChat, Footer } from '@/components';
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
  logo: string;
  website: string;
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
            setTeamMembers(data);
        } catch (err) {
            setTeamError(err instanceof Error ? err.message : t('about.team.error'));
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
            setPartners(data);
        } catch (err) {
            setPartnersError(err instanceof Error ? err.message : t('about.partners.error'));
        } finally {
            setPartnersLoading(false);
        }
    };

    if (isClient) {
        fetchTeamMembers();
        fetchPartners();
    }
  }, [isClient, t]);

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

  if (!isClient) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <Logo size="lg" />
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t('common.loading') || 'Loading...'}</p>
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
              <Link key={link.href} href={link.href} className={`transition-colors duration-300 text-[15px] font-medium ${ '/about' === link.href ? 'text-green-500 dark:text-green-400' : 'text-gray-600 hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400'}`}>
                {t(link.key) || link.key.split('.')[1]}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <button onClick={toggleDarkMode} className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={t(isDarkMode ? 'common.lightMode' : 'common.darkMode')}>
              {isDarkMode ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-blue-500" />}
            </button>
            <Link href="/contact">
                <Button variant="primary" size="sm">{t('nav.contact') || 'Contact'}</Button>
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
                <Link key={link.href} href={link.href} className={`transition-colors duration-300 text-base font-medium ${ '/about' === link.href ? 'text-green-500 dark:text-green-400' : 'text-gray-600 hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400'}`} onClick={() => setIsMobileMenuOpen(false)}>
                  {t(link.key) || link.key.split('.')[1]}
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
                    {t('common.freeConsultation') || 'Free Consultation'}
                </Button>
            </Link>
          </div>
        )}
      </header>
      
      <main className="pt-20">
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50" data-aos="fade-in">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <AnimatedText>
              <Heading variant="h1" color="foreground" className="mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold">
                {t('about.hero.title.main') || 'Tentang Bajra Media'}
                <span className="text-green-500 relative"> {t('about.hero.title.highlight') || 'Kami'}
                  <span className="absolute bottom-1.5 left-0 w-full h-3 bg-green-500/10 -z-0"></span>
                </span>
              </Heading>
            </AnimatedText>
            <AnimatedText>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                {t('about.hero.subtitle') || 'Kami adalah agensi digital kreatif yang bersemangat dalam membangun solusi digital inovatif untuk bisnis Anda.'}
              </p>
            </AnimatedText>
          </div>
        </section>

        <section className="py-16 md:py-24" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div className="relative" data-aos="fade-right">
                    <Image src="/images/team-meeting.jpg" alt={t('about.story.imageAlt') || 'Tim berkolaborasi'} width={600} height={400} className="rounded-2xl shadow-lg w-full"/>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -z-10"></div>
                </div>
                <div data-aos="fade-left" data-aos-delay="200">
                    <Heading variant="h2" color="foreground" className="mb-6">{t('about.story.title') || 'Cerita Kami'}</Heading>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
                        <p>{t('about.story.paragraph1') || 'Berawal dari semangat untuk menciptakan solusi digital yang bermakna, Bajra Media didirikan untuk membantu bisnis bertransformasi di era digital.'}</p>
                        <p>{t('about.story.paragraph2') || 'Dengan tim yang solid dan berpengalaman, kami berkomitmen untuk memberikan layanan terbaik dan hasil yang melebihi ekspektasi.'}</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50" data-aos="fade-up">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                    <div data-aos="fade-right">
                        <Heading variant="h2" color="foreground" className="mb-6">{t('about.mission.title') || 'Misi Kami'}</Heading>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{t('about.mission.description') || 'Memberdayakan bisnis melalui solusi digital yang inovatif, fungsional, dan estetis, serta membangun kemitraan jangka panjang yang saling menguntungkan.'}</p>
                    </div>
                    <div data-aos="fade-left" data-aos-delay="200">
                        <Heading variant="h2" color="foreground" className="mb-6">{t('about.vision.title') || 'Visi Kami'}</Heading>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{t('about.vision.description') || 'Menjadi agensi digital terdepan di Indonesia yang dikenal karena kualitas, kreativitas, dan dampak positif bagi pertumbuhan bisnis klien.'}</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h2" color="foreground" className="mb-12">{t('about.values.title') || 'Nilai-Nilai Kami'}</Heading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '💡', key: 'innovation', title: t('about.values.innovation.title') || 'Inovasi', description: t('about.values.innovation.description') || 'Selalu mencari cara baru dan lebih baik untuk memberikan solusi teknologi dan desain terdepan.' },
                { icon: '🤝', key: 'collaboration', title: t('about.values.collaboration.title') || 'Kolaborasi', description: t('about.values.collaboration.description') || 'Bekerja sama secara erat dengan klien sebagai mitra strategis untuk mencapai tujuan bersama.' },
                { icon: '🏆', key: 'excellence', title: t('about.values.excellence.title') || 'Kualitas', description: t('about.values.excellence.description') || 'Berkomitmen pada standar tertinggi dalam setiap detail pekerjaan yang kami lakukan.' },
                { icon: '❤️', key: 'passion', title: t('about.values.passion.title') || 'Semangat', description: t('about.values.passion.description') || 'Memiliki antusiasme dan dedikasi mendalam terhadap setiap proyek yang kami tangani.' },
              ].map((value, index) => (
                <div key={value.key} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay={index * 100}>
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
            <Heading variant="h2" color="foreground" className="mb-4">{t('about.team.title') || 'Tim Hebat di Balik Layar'}</Heading>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">{t('about.team.subtitle') || 'Kami adalah tim yang solid terdiri dari para profesional berbakat dan bersemangat.'}</p>
            {teamLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {teamMembers.map((member, index) => (
                  <div key={member.id} className="text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="relative w-40 h-40 mx-auto mb-4">
                      <Image src={member.image || '/images/team/placeholder.jpg'} alt={member.name} width={160} height={160} className="rounded-full object-cover shadow-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-green-500 font-medium">{language === 'id' ? member.roleId : member.role}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24" data-aos="fade-up">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
                <Heading variant="h2" color="foreground" className="mb-12">{t('about.partners.title') || 'Dipercaya oleh Perusahaan Hebat'}</Heading>
                {partnersLoading && <p>{t('common.loading') || 'Loading...'}</p>}
                {partnersError && <p className="text-red-500">{partnersError}</p>}
                {!partnersLoading && !partnersError && (
                  <div className="flex flex-wrap justify-center items-center gap-12">
                    {partners.map((partner) => (
                      <Link key={partner.id} href={partner.website} target="_blank" className="grayscale hover:grayscale-0 transition-all" data-aos="zoom-in">
                        <Image src={partner.logo} alt={language === 'id' ? partner.nameId : partner.name} width={150} height={60} className="object-contain" />
                      </Link>
                    ))}
                  </div>
                )}
            </div>
        </section>
        
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h2" color="foreground" className="mb-6">{t('about.cta.title') || 'Ayo Mulai Proyek Bersama Kami'}</Heading>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">{t('about.cta.subtitle') || 'Jika Anda memiliki proyek atau ide yang ingin direalisasikan, jangan ragu untuk menghubungi kami.'}</p>
            <Link href="/contact">
              <Button variant="primary" size="lg">{t('common.contactUs') || 'Hubungi Kami'}</Button>
            </Link>
          </div>
        </section>
      </main>

      <WhatsAppChat phoneNumber="6285739402436" message={t('whatsapp.aboutPage') || 'Halo! Saya ingin tahu lebih banyak tentang Bajramedia.'} />
    </div>
  );
} 