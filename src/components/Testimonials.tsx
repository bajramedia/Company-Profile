"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import Heading from './Heading';
import Text from './Text';
import AnimatedText from './AnimatedText';

const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      id: 1,
      name: t('testimonials.client1.name'),
      role: t('testimonials.client1.role'),
      quote: t('testimonials.client1.quote'),
      avatar: '/images/team.jpg'
    },
    {
      id: 2,
      name: t('testimonials.client2.name'),
      role: t('testimonials.client2.role'),
      quote: t('testimonials.client2.quote'),
      avatar: '/images/team-meeting.jpg'
    },
    {
      id: 3,
      name: t('testimonials.client3.name'),
      role: t('testimonials.client3.role'),
      quote: t('testimonials.client3.quote'),
      avatar: '/images/team-meeting-alt.jpg'
    }
  ];
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-14">
          <AnimatedText as="div">
            <Heading variant="h1" className="text-2xl md:text-3xl font-bold mb-3">
              {t('testimonials.title.main')} <span className="text-primary">{t('testimonials.title.highlight')}</span>
            </Heading>
          </AnimatedText>
          <AnimatedText as="div">
            <Text color="secondary" className="max-w-2xl mx-auto text-sm md:text-base">
              {t('testimonials.subtitle')}
            </Text>
          </AnimatedText>
        </div>        <AnimatedText as="div">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 group border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>                  <div>
                    <h4 className="font-semibold text-foreground dark:text-gray-100 transition-colors duration-300">{testimonial.name}</h4>
                    <p className="text-sm text-secondary dark:text-gray-400 transition-colors duration-300">{testimonial.role}</p>
                  </div>
                </div>
                  <div className="mb-4">
                  {/* Quote icon */}
                  <svg className="w-8 h-8 text-primary/20 dark:text-green-400/20 mb-2 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                <blockquote className="text-foreground dark:text-gray-300 leading-relaxed text-sm md:text-base italic transition-colors duration-300">
                  "{testimonial.quote}"
                </blockquote>                {/* Star rating */}
                <div className="flex mt-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 dark:text-yellow-300 fill-current transition-colors duration-300" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedText>
      </div>      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-[12%] h-[30%] opacity-40 pointer-events-none">
        <div className="grid grid-cols-3 gap-2 h-full">
          {Array(18).fill(0).map((_, i) => (
            <div key={`testimonial-decor-tl-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-green-400 opacity-30 transition-colors duration-300"></div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-[15%] h-[25%] opacity-40 pointer-events-none">
        <div className="grid grid-cols-4 gap-2 h-full">
          {Array(20).fill(0).map((_, i) => (
            <div key={`testimonial-decor-br-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-green-400 opacity-30 transition-colors duration-300"></div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/4 right-16 opacity-60 pointer-events-none">
        <div className="grid grid-cols-2 gap-2">
          {Array(6).fill(0).map((_, i) => (
            <div key={`testimonial-decor-tr-${i}`} className="w-2 h-2 rounded-full bg-primary dark:bg-green-400 opacity-40 transition-colors duration-300"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
