"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Logo, LanguageSwitcher, AnimatedText, Footer, WhatsAppChat } from '@/components';
import { useLanguage } from '@/context/LanguageContext';
// Import AOS CSS statically to avoid build issues
import 'aos/dist/aos.css';

// Conditional AOS import to avoid SSR issues
let AOS: any = null;
if (typeof window !== 'undefined') {
  import('aos').then((aosModule) => {
    AOS = aosModule.default;
  }).catch((error) => {
    console.warn('AOS could not be loaded:', error);
  });
}

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
  order: number;
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
  order: number;
}

export default function About() {
  const { t = (key: string) => key, language = 'en' } = useLanguage() || {};
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize AOS with safety checks
    const initAOS = () => {
      try {
        if (AOS && typeof AOS.init === 'function') {
          AOS.init({
            duration: 1000,
            once: true,
            offset: 100
          });
        }
      } catch (error) {
        console.warn('AOS initialization failed:', error);
      }
    };

    if (AOS) {
      initAOS();
    } else {
      // Wait for AOS to load
      const checkAOS = setInterval(() => {
        if (AOS) {
          initAOS();
          clearInterval(checkAOS);
        }
      }, 100);

      // Clear interval after 3 seconds
      setTimeout(() => clearInterval(checkAOS), 3000);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members and partners in parallel
        const [teamResponse, partnersResponse] = await Promise.all([
          fetch('/api/team-members', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          fetch('/api/partners', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ]);

        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setTeamMembers(Array.isArray(teamData) ? teamData : []);
        }

        if (partnersResponse.ok) {
          const partnersData = await partnersResponse.json();
          setPartners(Array.isArray(partnersData) ? partnersData : []);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Data will remain empty arrays, which is fine - fallback handled by APIs
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t('nav.home')}
                </Link>
                <Link href="/about" className="text-blue-600 dark:text-blue-400 font-medium">
                  {t('nav.about')}
                </Link>
                <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t('nav.services')}
                </Link>
                <Link href="/portfolio" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t('nav.portfolio')}
                </Link>
                <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t('nav.blog')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <Heading
              level={1}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              <AnimatedText
                text={t('about.hero.title')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              />
            </Heading>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <Heading
                level={2}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                {t('about.story.title')}
              </Heading>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  {t('about.story.paragraph1')}
                </p>
                <p>
                  {t('about.story.paragraph2')}
                </p>
                <p>
                  {t('about.story.paragraph3')}
                </p>
              </div>
            </div>
            <div data-aos="fade-left">
              <div className="relative">
                <Image
                  src="/images/team-meeting.jpg"
                  alt="Bajramedia Team"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-80"></div>
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <Heading
              level={2}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            >
              {t('about.values.title')}
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: t('about.values.innovation.title'),
                description: t('about.values.innovation.description')
              },
              {
                icon: "🤝",
                title: t('about.values.collaboration.title'),
                description: t('about.values.collaboration.description')
              },
              {
                icon: "🏆",
                title: t('about.values.excellence.title'),
                description: t('about.values.excellence.description')
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <Heading level={3} className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </Heading>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <Heading
                level={2}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                {t('about.team.title')}
              </Heading>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t('about.team.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={member.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <Heading level={3} className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </Heading>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                      {language === 'id' ? member.roleId : member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {language === 'id' ? member.bioId : member.bio}
                    </p>
                    <div className="flex space-x-3">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {member.social.instagram && (
                        <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.652-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.245 17.815.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners Section */}
      {partners.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <Heading
                level={2}
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                {t('about.partners.title')}
              </Heading>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t('about.partners.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <a
                  key={partner.id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="relative h-20 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 flex items-center justify-center">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={120}
                        height={60}
                        className="object-contain filter group-hover:brightness-110 transition-all"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/logo.png';
                        }}
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                      {language === 'id' ? partner.nameId : partner.name}
                    </h3>
                    {(partner.description || partner.descriptionId) && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 text-center mt-2">
                        {language === 'id' ? partner.descriptionId : partner.description}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-aos="fade-up">
            <Heading
              level={2}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              {t('about.cta.title')}
            </Heading>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/services"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                {t('about.cta.services')}
              </Button>
              <Button
                href="/portfolio"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                {t('about.cta.portfolio')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppChat />
    </div>
  );
} 