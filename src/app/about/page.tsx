'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { FiArrowRight, FiAward, FiTarget, FiUsers, FiLinkedin, FiGithub, FiInstagram } from 'react-icons/fi';
import 'aos/dist/aos.css';
import AOS from 'aos';

// --- TYPE DEFINITIONS ---
interface Partner {
  id: string | number;
  name_en: string;
  name_id: string;
  description_en: string;
  description_id: string;
  logo_url: string;
  website_url: string;
  is_active: number;
}

interface TeamMember {
  id: string;
  name: string;
  role_en: string;
  role_id: string;
  image_url: string;
  linkedin_url?: string;
  github_url?: string;
  instagram_url?: string;
  is_active: number;
}

// --- STATIC CONTENT ---
const aboutContent = {
  hero: {
    title_en: 'About Me',
    title_id: 'Tentang Kami',
    content_en: 'Bajra Media ( formerly Reduktor Development ) is a technology company specializing in innovative software development and integrated digital solutions. We dedicated to helping businesses of all sizes transform and thrive in the digital age.',
    content_id: 'Bajra Media (sebelumnya Reduktor Development) adalah perusahaan teknologi yang mengkhususkan diri dalam pengembangan perangkat lunak inovatif dan solusi digital terintegrasi. Kami berdedikasi untuk membantu bisnis dari semua ukuran bertransformasi dan berkembang di era digital.',
  },
  story: {
    title_en: 'Our Story',
    title_id: 'Kisah Kami',
    content_en: 'Bajramedia was founded with a vision to bridge the gap between traditional businesses and the digital world. We recognized the growing need for UMKM (Micro, Small, and Medium Enterprises) and institutions to embrace digital transformation in this modern era.',
    content_id: 'Bajramedia didirikan dengan visi untuk menjembatani kesenjangan antara bisnis tradisional dan dunia digital. Kami menyadari kebutuhan yang berkembang bagi UMKM dan institusi untuk merangkul transformasi digital di era modern ini.',
  },
  vision: {
    title_en: 'Our Vision',
    title_id: 'Visi Kami',
    content_en: 'To be the leading digital transformation partner for businesses across Indonesia, empowering them to thrive in the digital age through innovative technology solutions and exceptional user experiences.',
    content_id: 'Menjadi mitra transformasi digital terdepan untuk bisnis di seluruh Indonesia, memberdayakan mereka untuk berkembang di era digital melalui solusi teknologi inovatif dan pengalaman pengguna yang luar biasa.',
  },
  mission: {
    title_en: 'Our Mission',
    title_id: 'Misi Kami',
    content_en: [
      'Deliver cutting-edge digital solutions that drive business growth and success',
      'Foster innovation and creativity in every project we undertake',
      'Build long-lasting partnerships with our clients based on trust and excellence',
    ],
    content_id: [
      'Memberikan solusi digital terdepan yang mendorong pertumbuhan dan kesuksesan bisnis',
      'Memupuk inovasi dan kreativitas dalam setiap proyek yang kami kerjakan',
      'Membangun kemitraan jangka panjang dengan klien berdasarkan kepercayaan dan keunggulan',
    ],
    icons: [FiTarget, FiAward, FiUsers]
  },
  partners: {
    title_en: 'Trusted by Great Companies',
    title_id: 'Dipercaya oleh Perusahaan Hebat',
    subtitle_en: 'We are proud to collaborate with leading companies and institutions.',
    subtitle_id: 'Kami bangga dapat berkolaborasi dengan perusahaan dan institusi terkemuka.',
  },
  team: {
    title_en: 'Meet Our Agile Team',
    title_id: 'Kenali Tim Andal Kami',
    subtitle_en: 'The passionate people behind our success.',
    subtitle_id: 'Orang-orang penuh semangat di balik kesuksesan kami.',
  }
};


// --- COMPONENT ---
export default function AboutPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    setIsClient(true);
    AOS.init({
      duration: 800,
      once: true,
    });

    const fetchPartners = async () => {
      try {
        setPartnersLoading(true);
        const response = await fetch('/api/partners');
        if (!response.ok) throw new Error('Failed to fetch partners');
        const data = await response.json();
        // Ambil semua partner yang aktif
        const activePartners = data.filter((p: any) => p.is_active === 1 || p.isActive === 1);
        setPartners(activePartners);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setPartners([]);
      } finally {
        setPartnersLoading(false);
      }
    };

    const fetchTeam = async () => {
      try {
        setTeamLoading(true);
        const response = await fetch('/api/team-members');
        if (!response.ok) throw new Error('Failed to fetch team');
        const data = await response.json();
        setTeam(data.filter((t: TeamMember) => t.is_active == 1));
      } catch (error) {
        console.error('Error fetching team:', error);
        setTeam([]);
      } finally {
        setTeamLoading(false);
      }
    };

    if (isClient) {
      fetchPartners();
      fetchTeam();
    }
  }, [isClient]);

  const currentContent = (section: keyof typeof aboutContent) => {
    const content = aboutContent[section];
    if (language === 'id') {
      return {
        title: (content as any).title_id,
        content: (content as any).content_id || (content as any).subtitle_id,
      };
    }
    return {
      title: (content as any).title_en,
      content: (content as any).content_en || (content as any).subtitle_en,
    };
  };

  if (!isClient) {
    // Render a skeleton loading state for SSR
    return <div className="min-h-screen pt-20 bg-white dark:bg-gray-900"></div>;
  }

  return (
    <>
      <main className="pt-20 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        
        {/* Hero Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
              <Heading variant="h1" className="mb-6 text-4xl md:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {currentContent('hero').title}
                </span>
              </Heading>
              <Text className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
                {currentContent('hero').content}
              </Text>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8" data-aos="fade-up">
              <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className='relative'>
                   <div className="absolute -top-4 -left-4 w-full h-full bg-primary/10 rounded-lg transform rotate-[-3deg]"></div>
                   <Image
                    src="/images/team-meeting.jpg"
                    alt="Our Story"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl relative z-10"
                  />
                </div>
                <div>
                  <Heading variant="h2" className="mb-4">{currentContent('story').title}</Heading>
                  <Text className="text-gray-600 dark:text-gray-400 prose dark:prose-invert">
                    {currentContent('story').content}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Vision Section */}
        <section className="py-20">
          <div className="container mx-auto max-w-7xl">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
              <Heading variant="h2" className="mb-4">{currentContent('vision').title}</Heading>
              <Text className="text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-3xl mx-auto">
                {currentContent('vision').content}
              </Text>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
              <Heading variant="h2" color="foreground" className="text-center mb-12">
                {currentContent('mission').title}
              </Heading>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {(currentContent('mission').content as string[]).map((item, index) => {
                  const MissionIcon = aboutContent.mission.icons[index] || FiTarget;
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-transparent dark:border-gray-700/50 text-center transition-all duration-300 hover:shadow-primary/20 hover:border-primary/20 hover:-translate-y-2">
                      <div className="mb-5 inline-block p-4 rounded-full bg-primary/10 text-primary">
                        <MissionIcon className="w-8 h-8" />
                      </div>
                      <Text className="text-gray-700 dark:text-gray-300 text-lg">
                        {item}
                      </Text>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20">
          <div className="container mx-auto max-w-7xl">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
              <div className="text-center mb-12">
                <Heading variant="h2" className="mb-4">
                  {currentContent('partners').title}
                </Heading>
                <Text className="text-gray-600 dark:text-gray-400">
                  {language === 'id' ? aboutContent.partners.subtitle_id : aboutContent.partners.subtitle_en}
                </Text>
              </div>

                                {partnersLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {partners.map((partner) => (
                    <div key={partner.id} className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-32 h-32 bg-white rounded-lg p-4 shadow-md">
                          <Image 
                            src={partner.logo_url || '/images/placeholder.jpg'} 
                            alt={language === 'id' ? partner.name_id : partner.name_en}
                            width={128} 
                            height={128}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {language === 'id' ? partner.name_id : partner.name_en}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6 text-base leading-relaxed">
                            {language === 'id' ? partner.description_id : partner.description_en}
                          </p>
                          <Link href={partner.website_url || '#'} passHref legacyBehavior>
                            <a target="_blank" rel="noopener noreferrer" className="inline-block">
                              <Button className="group flex items-center space-x-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                                <span>{t('about.partners.visitWebsite')}</span>
                                <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
              <Heading variant="h2" color="foreground" className="mb-4">
                {currentContent('team').title}
              </Heading>
              <Text className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16">
                {currentContent('team').content}
              </Text>
              {teamLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                    </div>
                  ))}
                </div>
              )}
              {!teamLoading && team.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12">
                  {team.map((member) => (
                    <div key={member.id} className="text-center group">
                      <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
                        <Image
                          src={member.image_url || '/images/team/default-avatar.jpg'}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 128px, 160px"
                          className="object-cover rounded-full shadow-lg transition-all duration-500 transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-full flex items-center justify-center space-x-3">
                          {member.linkedin_url && <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0"><FiLinkedin /></a>}
                          {member.github_url && <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0"><FiGithub /></a>}
                          {member.instagram_url && <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 transform translate-y-2 group-hover:translate-y-0"><FiInstagram /></a>}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-primary dark:text-accent text-sm">{language === 'id' ? member.role_id : member.role_en}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 