"use client";

import React from 'react';
import Link from 'next/link';
import Button from './Button';
import AnimatedText from './AnimatedText';
import { useLanguage } from '@/context/LanguageContext';

interface CTAProps {
  className?: string;
}

const CTA: React.FC<CTAProps> = ({ className = '' }) => {
  const { t } = useLanguage();  return (
    <section className={`py-16 md:py-24 bg-primary dark:bg-gray-900 relative overflow-hidden transition-colors duration-300 ${className}`}>      {/* Wave-shaped connector to SupportedBy section */}
      <div className="absolute -bottom-1 left-0 right-0 overflow-hidden">
        <svg
          className="relative block w-full h-[60px] fill-gray-50 dark:fill-gray-800 transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40L40,35C80,30,160,20,240,20C320,20,400,30,480,40C560,50,640,60,720,60C800,60,880,50,960,45C1040,40,1120,40,1200,45C1280,50,1360,60,1400,65L1440,70L1440,100L1400,100C1360,100,1280,100,1200,100C1120,100,1040,100,960,100C880,100,800,100,720,100C640,100,560,100,480,100C400,100,320,100,240,100C160,100,80,100,40,100L0,100Z"
          ></path>
        </svg>
      </div>
      {/* Background decorative elements */}
      <div className="absolute -top-10 right-10 w-20 h-20 rounded-full bg-white/10 dark:bg-gray-700/30 transition-colors duration-300"></div>
      <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-32 h-32 rounded-full bg-white/10 dark:bg-gray-700/30 transition-colors duration-300"></div>
      <div className="absolute -bottom-5 right-1/4 w-16 h-16 rounded-full bg-white/10 dark:bg-gray-700/30 transition-colors duration-300"></div>
      
      {/* Dots pattern */}
      <div className="absolute top-10 left-20 opacity-30">
        <div className="grid grid-cols-3 gap-2">
          {Array(6).fill(0).map((_, i) => (
            <div 
              key={`cta-dots-top-${i}`} 
              className="w-2 h-2 rounded-full bg-white dark:bg-gray-300 transition-colors duration-300"
            ></div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-10 right-20 opacity-30">
        <div className="grid grid-cols-3 gap-2">
          {Array(6).fill(0).map((_, i) => (
            <div 
              key={`cta-dots-bottom-${i}`} 
              className="w-2 h-2 rounded-full bg-white dark:bg-gray-300 transition-colors duration-300"
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-[95%] mx-auto px-4 sm:px-6 md:px-8">        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="w-full lg:w-2/3">
            <AnimatedText as="div">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-gray-100 mb-4 transition-colors duration-300">
                {t('cta.title') || 'Ready to Transform Your Digital Presence?'}
              </h2>
            </AnimatedText>
            <AnimatedText as="div">
              <p className="text-white/80 dark:text-gray-300 text-base md:text-lg max-w-2xl transition-colors duration-300">
                {t('cta.description') || 'Let us help you build beautiful, functional, and effective digital solutions that drive results for your business. Start your journey with us today.'}
              </p>
            </AnimatedText>
          </div>
            <div className="w-full lg:w-1/3 flex flex-col md:flex-row lg:flex-col items-center gap-4">
              <Link href="/about" className="w-full md:w-auto lg:w-full">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="bg-[#f7d046] hover:bg-[#03b150] text-gray-800 hover:text-white py-5 px-8 rounded-xl font-bold shadow-xl w-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <span className="text-base font-semibold flex items-center justify-center">
                    {t('cta.primaryButton') || 'Start Your Project'}
                    <svg className="w-0 h-5 ml-0 opacity-0 group-hover:w-5 group-hover:ml-2 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
              
              <Link href="/about" className="w-full md:w-auto lg:w-full">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="py-5 px-8 rounded-xl font-bold text-white border-2 border-white hover:bg-white/15 hover:-translate-y-1 w-full transition-all duration-300 group"
                >
                  <span className="text-base font-semibold flex items-center justify-center">
                    {t('cta.secondaryButton') || 'Contact Us'}
                    <svg className="w-0 h-5 ml-0 opacity-0 group-hover:w-5 group-hover:ml-2 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
