"use client";

import React from 'react';
import Image from 'next/image';
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
      image: '/images/team-meeting.jpg',
      category: 'Website, E-commerce'
    },
    {
      id: 2,
      image: '/images/team-meeting-alt.jpg',
      category: 'Mobile App, iOS'
    },
    {
      id: 3,
      image: '/images/team-meeting-2.jpg',
      category: 'Website, Digital Marketing'
    },
    {
      id: 4,
      image: '/images/team.jpg',
      category: 'Mobile App, Android'
    },
    {
      id: 5,
      image: '/images/team-meeting.jpg',
      category: 'Website, UI/UX'
    },
    {
      id: 6,
      image: '/images/team-meeting-alt.jpg',
      category: 'Digital Marketing, SEO'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
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
            <div className="inline-flex border border-gray-200 rounded-md overflow-hidden">
              <button className="px-4 py-2 text-sm font-medium bg-primary text-white">
                {t('portfolio.filter.all')}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-50">
                {t('portfolio.filter.website')}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-50">
                {t('portfolio.filter.mobileApp')}
              </button>
            </div>
          </div>
        </AnimatedText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={t('portfolio.item.alt', { number: item.id })}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {t('portfolio.item.titleOverlay', { number: item.id })}
                  </h3>
                  <p className="text-white/80 text-sm">{item.category}</p>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg mb-2">
                  {t('portfolio.item.title', { number: item.id })}
                </h3>
                <p className="text-secondary text-sm">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="md" className="px-6 py-3 border-primary text-primary hover:bg-primary/5">
            {t('portfolio.viewAll')}
          </Button>
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
