"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedText from './AnimatedText';

const Team = () => {
  const { t } = useLanguage();

  const teamMembers = [
    {
      id: 1,
      name: t('team.member1.name'),
      position: t('team.position.ceo'),
      bio: t('team.member1.bio'),
      image: '/images/team-meeting.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'ahmad@bajramedia.com'
      }
    },
    {
      id: 2,
      name: t('team.member2.name'),
      position: t('team.position.cto'),
      bio: t('team.member2.bio'),
      image: '/images/team-meeting-alt.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'sari@bajramedia.com'
      }
    },
    {
      id: 3,
      name: t('team.member3.name'),
      position: t('team.position.designer'),
      bio: t('team.member3.bio'),
      image: '/images/team-meeting-2.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'budi@bajramedia.com'
      }
    },
    {
      id: 4,
      name: t('team.member4.name'),
      position: t('team.position.marketing'),
      bio: t('team.member4.bio'),
      image: '/images/team.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'diana@bajramedia.com'
      }
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden opacity-60">
        {/* Top Right Decoration */}
        <div className="absolute top-10 right-10">
          <div className="grid grid-cols-4 gap-2">
            {Array(16).fill(0).map((_, i) => (
              <div 
                key={`team-top-${i}`} 
                className="w-2 h-2 rounded-full bg-primary/20 dark:bg-primary/30" 
              />
            ))}
          </div>
        </div>

        {/* Bottom Left Decoration */}
        <div className="absolute bottom-20 left-10">
          <div className="grid grid-cols-3 gap-2">
            {Array(9).fill(0).map((_, i) => (
              <div 
                key={`team-bottom-${i}`} 
                className="w-2.5 h-2.5 rounded-full bg-primary/20 dark:bg-primary/30" 
              />
            ))}
          </div>
        </div>

        {/* Center Right Decoration */}
        <div className="absolute top-1/2 right-20 transform -translate-y-1/2">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary/30 dark:border-primary/40 animate-spin-slow"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Header - Tokopedia Style */}
        <div className="text-center mb-14">
          <AnimatedText as="div">
            <div className="inline-flex items-center justify-center bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full mb-3 transition-colors duration-300">
              <span className="text-xs text-primary font-medium tracking-wider uppercase">
                {t('team.badge')}
              </span>
            </div>
          </AnimatedText>
          <AnimatedText as="div">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300">
              {t('team.title')} <span className="text-primary">{t('team.titleHighlight')}</span>
            </h2>
          </AnimatedText>
          <AnimatedText as="div">
            <p className="text-secondary dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base transition-colors duration-300">
              {t('team.subtitle')}
            </p>
          </AnimatedText>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {teamMembers.map((member, index) => (
            <AnimatedText key={member.id} as="div">
              <div className="group relative">
                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700">
                  {/* Profile Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Position Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-primary/90 text-white px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
                        {member.position}
                      </div>
                    </div>

                    {/* Social Links - Appears on Hover */}
                    <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <a
                        href={member.social.linkedin}
                        className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a
                        href={member.social.twitter}
                        className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                        </svg>
                      </a>
                      <a
                        href={`mailto:${member.social.email}`}
                        className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-secondary dark:text-gray-400 text-sm mb-3 transition-colors duration-300">
                      {member.position}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Floating Element */}
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </AnimatedText>
          ))}
        </div>

        {/* View All Team Members */}
        <AnimatedText as="div">
          <div className="text-center">
            <a 
              href="#" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-200 group"
            >
              {t('team.viewAll')}
              <svg 
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </AnimatedText>
      </div>
    </section>
  );
};

export default Team;