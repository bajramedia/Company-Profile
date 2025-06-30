"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Heading, Text } from '@/components';

const services = [
  {
    id: 'web-development',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    titleId: 'Pengembangan Web',
    titleEn: 'Web Development',
    descriptionId: 'Membangun website dan aplikasi web modern dengan teknologi terdepan untuk kebutuhan bisnis Anda.',
    descriptionEn: 'Building modern websites and web applications with cutting-edge technology for your business needs.',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Secure'],
    link: '/services/web-development'
  },
  {
    id: 'mobile-apps',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    titleId: 'Aplikasi Mobile',
    titleEn: 'Mobile Apps',
    descriptionId: 'Mengembangkan aplikasi mobile native dan cross-platform untuk iOS dan Android.',
    descriptionEn: 'Developing native and cross-platform mobile applications for iOS and Android.',
    features: ['iOS & Android', 'Native Performance', 'User-Friendly', 'App Store Ready'],
    link: '/services/mobile-apps'
  },
  {
    id: 'uiux-design',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    ),
    titleId: 'Desain UI/UX',
    titleEn: 'UI/UX Design',
    descriptionId: 'Menciptakan pengalaman pengguna yang menarik dan intuitif dengan desain yang modern.',
    descriptionEn: 'Creating engaging and intuitive user experiences with modern design.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design System'],
    link: '/services/uiux-design'
  },
  {
    id: 'sistem-development',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    titleId: 'Pengembangan Sistem',
    titleEn: 'System Development',
    descriptionId: 'Membangun sistem informasi dan enterprise solutions yang sesuai dengan kebutuhan perusahaan.',
    descriptionEn: 'Building information systems and enterprise solutions that meet company needs.',
    features: ['Custom Solutions', 'Scalable Architecture', 'Integration Ready', 'Security Focused'],
    link: '/services/sistem-development'
  },
  {
    id: 'digital-marketing',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    titleId: 'Digital Marketing',
    titleEn: 'Digital Marketing',
    descriptionId: 'Meningkatkan visibilitas online dan pertumbuhan bisnis melalui strategi digital marketing.',
    descriptionEn: 'Increasing online visibility and business growth through digital marketing strategies.',
    features: ['SEO/SEM', 'Social Media', 'Content Marketing', 'Analytics'],
    link: '/services/digital-marketing'
  },
  {
    id: 'game-development',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M16 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    titleId: 'Pengembangan Game',
    titleEn: 'Game Development',
    descriptionId: 'Mengembangkan game dan aset game yang menarik untuk berbagai platform.',
    descriptionEn: 'Developing engaging games and game assets for various platforms.',
    features: ['2D/3D Games', 'Multi-Platform', 'Game Assets', 'Interactive Design'],
    link: '/services/aset-game-development'
  }
];

export default function ServicesOverview() {
  const { language } = useLanguage();
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mb-6 flex items-center justify-center space-x-2">
            <div className="w-12 h-0.5 bg-green-500"></div>
            <span className="text-green-500 font-medium text-sm tracking-wider uppercase">
              {language === 'id' ? 'Layanan Kami' : 'Our Services'}
            </span>
            <div className="w-12 h-0.5 bg-green-500"></div>
          </div>
          
          <Heading variant="h2" color="foreground" className="mb-4 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold">
            {language === 'id' ? 'Solusi Digital Komprehensif' : 'Comprehensive Digital Solutions'}
          </Heading>
          
          <Text color="secondary" className="max-w-3xl mx-auto text-[16px] leading-relaxed">
            {language === 'id'
              ? 'Kami menyediakan berbagai layanan digital yang dirancang khusus untuk membantu bisnis Anda berkembang di era digital dengan teknologi terdepan dan strategi yang tepat.'
              : 'We provide various digital services specially designed to help your business grow in the digital era with cutting-edge technology and the right strategies.'
            }
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 dark:border-gray-700 hover:border-green-500/20"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                
                {/* Floating dot */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="relative">
                <Heading variant="h3" color="foreground" className="mb-3 text-xl font-bold">
                  {language === 'id' ? service.titleId : service.titleEn}
                </Heading>
                
                <Text color="secondary" className="mb-4 text-sm leading-relaxed">
                  {language === 'id' ? service.descriptionId : service.descriptionEn}
                </Text>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium group-hover:bg-green-500/10 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link href={service.link}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-green-500/20 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 group-hover:shadow-lg"
                  >
                    {language === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </div>

              {/* Decorative element */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Text color="secondary" className="mb-6 text-lg">
            {language === 'id'
              ? 'Siap untuk mengembangkan bisnis Anda dengan solusi digital terbaik?'
              : 'Ready to grow your business with the best digital solutions?'
            }
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button
                variant="primary"
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {language === 'id' ? 'Lihat Semua Layanan' : 'View All Services'}
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transform hover:scale-105 transition-all duration-300"
              >
                {language === 'id' ? 'Konsultasi Gratis' : 'Free Consultation'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 