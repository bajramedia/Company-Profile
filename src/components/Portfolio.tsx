"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Heading from './Heading';
import Text from './Text';
import Button from './Button';
import AnimatedText from './AnimatedText';

const Portfolio: React.FC = () => {
  const { t } = useLanguage();

  const portfolioItems = [
    {
      id: 1,
      slug: 'bajra-media-website',
      image: '/images/team-meeting.jpg',
      title: 'Bajra Media Corporate Website',
      category: 'Website, E-commerce',
      excerpt: 'Modern corporate website with responsive design and powerful CMS features for easy content management.'
    },
    {
      id: 2,
      slug: 'mobile-app-project',
      image: '/images/team-meeting-alt.jpg',
      title: 'E-Learning Mobile App',
      category: 'Mobile App, iOS',
      excerpt: 'Interactive learning platform with gamification features and real-time progress tracking.'
    },
    {
      id: 3,
      slug: 'ecommerce-platform',
      image: '/images/team-meeting-2.jpg',
      title: 'E-Commerce Platform',
      category: 'Website, Digital Marketing',
      excerpt: 'Full-featured e-commerce solution with inventory management and payment integration.'
    },
    {
      id: 4,
      slug: 'game-character-assets',
      image: '/images/team.jpg',
      title: 'Fantasy Game Assets',
      category: 'Mobile App, Android',
      excerpt: '2D and 3D character designs with complete animation sets for mobile gaming.'
    },
    {
      id: 5,
      slug: 'ui-design-system',
      image: '/images/team-meeting.jpg',
      title: 'Design System UI Kit',
      category: 'Website, UI/UX',
      excerpt: 'Comprehensive design system with reusable components and style guidelines.'
    },
    {
      id: 6,
      slug: 'social-media-campaign',
      image: '/images/team-meeting-alt.jpg',
      title: 'Brand Social Campaign',
      category: 'Digital Marketing, SEO',
      excerpt: 'Multi-platform social media strategy that increased brand engagement by 300%.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-14">
          <AnimatedText as="div">
            <Heading variant="h1" className="text-2xl md:text-3xl font-bold mb-3">
              {t('portfolio.title.main')} <span className="text-primary">{t('portfolio.title.highlight')}</span>
            </Heading>
          </AnimatedText>
          <AnimatedText as="div">
            <Text color="secondary" className="max-w-2xl mx-auto text-sm md:text-base">
              {t('portfolio.subtitle')}
            </Text>
          </AnimatedText>
        </div>

        <AnimatedText as="div">
          <div className="flex justify-center mb-8">
            <div className="inline-flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden transition-colors duration-300">
              <button className="px-4 py-2 text-sm font-medium bg-primary text-white dark:bg-green-600 transition-colors duration-300">
                {t('portfolio.filter.all')}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300">
                {t('portfolio.filter.website')}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300">
                {t('portfolio.filter.mobileApp')}
              </button>
            </div>
          </div>
        </AnimatedText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <Link
              key={item.id}
              href={`/portfolio/${item.slug}`}
              className="group relative overflow-hidden rounded-lg shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 block"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white dark:text-gray-100 font-semibold text-lg mb-1 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/80 dark:text-gray-300 text-sm transition-colors duration-300">{item.category}</p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-secondary dark:text-gray-400 text-sm mb-3 transition-colors duration-300">
                  {item.excerpt}
                </p>
                <p className="text-primary dark:text-green-400 text-xs font-medium transition-colors duration-300">
                  {item.category}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/portfolio">
            <Button variant="outline" size="md" className="px-6 py-3 border-primary text-primary hover:bg-primary/5 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-600/10 transition-colors duration-300">
              {t('portfolio.viewAll')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[15%] h-[25%] opacity-50 pointer-events-none">
        <div className="grid grid-cols-4 gap-1.5 h-full">
          {Array(20).fill(0).map((_, i) => (
            <div key={`portfolio-decor-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary opacity-30"></div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-[10%] h-[20%] opacity-50 pointer-events-none">
        <div className="grid grid-cols-3 gap-1.5 h-full">
          {Array(15).fill(0).map((_, i) => (
            <div key={`portfolio-decor-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary opacity-30"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
