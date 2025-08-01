"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { FiArrowRight, FiAward, FiTarget, FiUsers } from 'react-icons/fi';
import 'aos/dist/aos.css';
import AOS from 'aos';

interface Partner {
  id: string | number;
  name: string;
  nameId: string;
  description: string;
  descriptionId: string;
  logo: string;
  website: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  positionId: string;
  avatar: string;
}

const aboutContent = {
  hero: {
    title_en: 'About Bajra Media',
    title_id: 'Tentang Bajra Media',
    content_en: 'Bajra Media ( formerly Reduktor Development ) is a technology company specializing in innovative software development and integrated digital solutions. We dedicated to helping businesses of all sizes transform and thrive in the digital age. We are a trusted partner in designing, building, and managing technology that drives operational efficiency and competitive advantage for our clients.',
    content_id: 'Bajra Media (sebelumnya Reduktor Development) adalah perusahaan teknologi yang mengkhususkan diri dalam pengembangan perangkat lunak inovatif dan solusi digital terintegrasi. Kami berdedikasi untuk membantu bisnis dari semua ukuran bertransformasi dan berkembang di era digital. Kami adalah mitra tepercaya dalam merancang, membangun, dan mengelola teknologi yang mendorong efisiensi operasional dan keunggulan kompetitif bagi klien kami.',
  },
  story: {
    title_en: 'Our Background Story',
    title_id: 'Latar Belakang Kami',
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
    title_en: 'Meet Our Team',
    title_id: 'Kenali Tim Kami',
    subtitle_en: 'The passionate people behind our success.',
    subtitle_id: 'Orang-orang penuh semangat di balik kesuksesan kami.',
  }
};

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
      duration: 1000,
      once: true,
      mirror: false,
    });

    const fetchPartners = async () => {
      try {
        setPartnersLoading(true);
        const response = await fetch(`/api/partners`);
        if (!response.ok) throw new Error('Failed to fetch partners');
        const data = await response.json();
        const formattedData = data.map((p: any) => ({
          ...p,
          // Memastikan nama properti sesuai dengan yang diharapkan komponen
          logo: p.logo_url || p.logo,
          name: p.name_en || p.name,
          nameId: p.name_id || p.nameId,
          description: p.description_en || p.description,
          descriptionId: p.description_id || p.descriptionId,
          website: p.website_url || p.website,
        }));
        setPartners(formattedData.filter((p: any) => p.is_featured).slice(0, 2));
      } catch (err) {
        console.error('Error fetching partners:', err);
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
        const formattedData = data.map((t: any) => ({
          ...t,
          // Memetakan nama properti dari API ke yang diharapkan komponen
          avatar: t.image_url || t.avatar,
          position: t.role_en || t.position,
          positionId: t.role_id || t.positionId,
        }));
        setTeam(formattedData.filter((t: any) => t.is_featured));
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setTeamLoading(false);
      }
    };

    if (isClient) {
      fetchPartners();
      fetchTeam();
    }
  }, [isClient]);

  if (!isClient) {
    return null;
  }

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

  return (
    <>
      <main className="pt-20">
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50 about-hero" data-aos="fade-in">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h1" className="mb-4">
              {currentContent('hero').title}
            </Heading>
            <Text className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
              {currentContent('hero').content}
            </Text>
          </div>
        </section>

        <section className="py-16 md:py-24" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/team-meeting.jpg"
                  alt="Our Story"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <Heading variant="h2" className="mb-4">{currentContent('story').title}</Heading>
                <Text className="text-gray-600 dark:text-gray-400">
                  {currentContent('story').content}
                </Text>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <Image
                  src="/images/team-meeting-2.jpg"
                  alt="Our Vision"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:order-1">
                <Heading variant="h2" className="mb-4">{currentContent('vision').title}</Heading>
                <Text className="text-gray-600 dark:text-gray-400">
                  {currentContent('vision').content}
                </Text>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
            <Heading variant="h2" color="foreground" className="text-center mb-12">
              {currentContent('mission').title}
            </Heading>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {(currentContent('mission').content as string[]).map((item, index) => {
                const MissionIcon = aboutContent.mission.icons[index] || FiTarget;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50 text-center transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30 hover:-translate-y-1">
                    <div className="mb-4 inline-block p-4 rounded-full bg-primary/10 text-primary">
                      <MissionIcon className="w-8 h-8" />
                    </div>
                    <Text className="text-gray-700 dark:text-gray-300">{item}</Text>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Partners Section - Tetap Dinamis */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h2" color="foreground" className="mb-4">
              {currentContent('partners').title}
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
              {currentContent('partners').content}
            </p>
            {partnersLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
                    <div className="h-16 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                  </div>
                ))}
              </div>
            )}
            {!partnersLoading && partners.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {partners.map((partner) => (
                  <div key={partner.id} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-left transition-transform transform hover:scale-105">
                    <div className="flex items-start space-x-6">
                      <Image src={partner.logo} alt={language === 'id' ? partner.nameId : partner.name} width={80} height={80} className="w-20 h-20 object-contain"/>
                      <div>
                        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                          {language === 'id' ? partner.nameId : partner.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {language === 'id' ? partner.descriptionId : partner.description}
                        </p>
                        <Link href={partner.website} passHref legacyBehavior>
                          <a target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              {t('about.partners.visit')} <FiArrowRight className="ml-2" />
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
        </section>

        {/* Team Section - Tetap Dinamis */}
        <section className="py-16 md:py-24" data-aos="fade-up">
          <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <Heading variant="h2" color="foreground" className="mb-4">
              {currentContent('team').title}
            </Heading>
            <Text className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
              {currentContent('team').content}
            </Text>
            {teamLoading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                  </div>
                ))}
              </div>
            )}
            {!teamLoading && team.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12">
                {team.map((member) => (
                  <div key={member.id} className="text-center group">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-lg transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl">
                      <Image
                        src={member.avatar || '/images/team/default-avatar.jpg'}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 128px, 160px"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{language === 'id' ? member.positionId : member.position}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
} 