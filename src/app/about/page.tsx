"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Heading, Text, AnimatedText, Button } from '@/components';
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  stats: Array<{
    value: string;
    label: string;
  }>;
}

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members
        const teamResponse = await fetch('/api/team-members');
        const teamData = await teamResponse.json();
        setTeamMembers(teamData);

        // Fetch about content
        const aboutResponse = await fetch('/api/admin/about-content');
        const aboutData = await aboutResponse.json();
        setAboutContent(aboutData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00D084]"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D084]/10 to-transparent dark:from-[#00D084]/5"></div>
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <AnimatedText as="div">
              <Heading variant="h1" color="foreground" className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
                {aboutContent?.title || t('about.title')}
              </Heading>
              <Text color="secondary" className="text-lg md:text-xl mb-8 max-w-2xl">
                {aboutContent?.description || t('about.description')}
              </Text>
            </AnimatedText>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <AnimatedText as="div" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <div className="w-12 h-12 bg-[#00D084]/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <Heading variant="h3" color="foreground" className="text-2xl font-bold mb-4">
                  {t('about.mission.title')}
                </Heading>
                <Text color="secondary" className="leading-relaxed">
                  {aboutContent?.mission || t('about.mission.description')}
                </Text>
              </div>
            </AnimatedText>

            {/* Vision */}
            <AnimatedText as="div" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <div className="w-12 h-12 bg-[#00D084]/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <Heading variant="h3" color="foreground" className="text-2xl font-bold mb-4">
                  {t('about.vision.title')}
                </Heading>
                <Text color="secondary" className="leading-relaxed">
                  {aboutContent?.vision || t('about.vision.description')}
                </Text>
              </div>
            </AnimatedText>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <AnimatedText as="div">
              <Heading variant="h2" color="foreground" className="text-3xl md:text-4xl font-bold mb-4">
                {t('about.values.title')}
              </Heading>
              <Text color="secondary" className="max-w-2xl mx-auto">
                {language === 'id'
                  ? 'Nilai-nilai yang kami junjung tinggi dalam setiap aspek pekerjaan kami'
                  : 'The values we uphold in every aspect of our work'
                }
              </Text>
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutContent?.values.map((value, index) => (
              <AnimatedText key={index} as="div" className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-[#00D084]/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 text-[#00D084]" dangerouslySetInnerHTML={{ __html: value.icon }} />
                </div>
                <Heading variant="h4" color="foreground" className="text-xl font-bold mb-3">
                  {value.title}
                </Heading>
                <Text color="secondary" className="text-sm">
                  {value.description}
                </Text>
              </AnimatedText>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <AnimatedText as="div">
              <Heading variant="h2" color="foreground" className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'id' ? 'Tim Kami' : 'Our Team'}
              </Heading>
              <Text color="secondary" className="max-w-2xl mx-auto">
                {language === 'id'
                  ? 'Kenali tim profesional kami yang berdedikasi untuk kesuksesan proyek Anda'
                  : 'Meet our professional team dedicated to your project success'
                }
              </Text>
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <AnimatedText key={member.id} as="div" className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <Heading variant="h4" color="foreground" className="text-xl font-bold mb-2">
                  {member.name}
                </Heading>
                <Text color="primary" className="text-[#00D084] font-medium mb-4">
                  {member.position}
                </Text>
                <Text color="secondary" className="text-sm mb-6">
                  {member.bio}
                </Text>
                <div className="flex items-center justify-center space-x-4">
                  {member.socialLinks.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#00D084] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {member.socialLinks.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#00D084] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {member.socialLinks.github && (
                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#00D084] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </AnimatedText>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {aboutContent?.stats.map((stat, index) => (
              <AnimatedText key={index} as="div" className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#00D084] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </AnimatedText>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 dark:bg-gray-800">
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedText as="div">
              <Heading variant="h2" className="text-white text-3xl md:text-4xl font-bold mb-6">
                {language === 'id'
                  ? 'Siap Memulai Project Bersama Kami?'
                  : 'Ready to Start Your Project with Us?'
                }
              </Heading>
              <Text className="text-gray-400 mb-8 text-lg">
                {language === 'id'
                  ? 'Konsultasikan kebutuhan digital Anda dengan tim kami'
                  : 'Consult your digital needs with our team'
                }
              </Text>
              <Link href="/contact">
                <Button variant="primary" size="lg" className="bg-[#00D084] hover:bg-[#00B873] text-white px-8 py-4">
                  {language === 'id' ? 'Mulai Konsultasi' : 'Start Consultation'}
                </Button>
              </Link>
            </AnimatedText>
          </div>
        </div>
      </section>
    </div>
  );
} 