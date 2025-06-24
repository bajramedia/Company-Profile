"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { FiArrowRight } from 'react-icons/fi';
import AnimatedText from './AnimatedText';

interface SupportedByProps {
  className?: string;
}

export const SupportedBy: React.FC<SupportedByProps> = ({
  className = ''
}) => {
  const { t } = useLanguage();
  const primaryColor = "rgb(3, 177, 80)"; 
  const lightPrimaryColor = "rgba(3, 177, 80, 0.1)";  
    return (    <div className={`pt-6 mt-[-1px] pb-16 md:pb-24 relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${className}`} style={{
      backgroundImage: `radial-gradient(${primaryColor}08 1.2px, transparent 1.2px)`,
      backgroundSize: '28px 28px'
    }}>      {/* Subtle decorative elements */}
      <div className="absolute top-12 left-8 w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.15 }}></div>
      <div className="absolute bottom-12 right-10 w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.15 }}></div>
      <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.15 }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.15 }}></div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-32 right-1/5 w-16 h-16 rounded-full bg-primary/5 dark:bg-primary/10 blur-xl"></div>
      <div className="absolute bottom-20 left-1/6 w-24 h-24 rounded-full bg-primary/5 dark:bg-primary/10 blur-xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">        <div className="bg-white dark:bg-gray-800 py-10 md:py-12 px-6 md:px-10 lg:px-14 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] border border-gray-50 dark:border-gray-700 transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex flex-col items-center lg:items-start justify-center text-center lg:text-left space-y-6 lg:w-1/2 lg:pr-8">
              <AnimatedText as="div" className="mb-1">
                <div className="inline-flex items-center justify-center">
                  <span 
                    className="text-sm md:text-base font-bold px-6 py-3 rounded-full shadow-md inline-block"
                    style={{ 
                      color: "white", 
                      backgroundColor: primaryColor,
                      boxShadow: `0 4px 14px ${primaryColor}40`
                    }}
                  >
                    {t('inbis.officialCollaboration')}
                  </span>
                </div>
              </AnimatedText>
              <AnimatedText as="div" className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed lg:mt-4 transition-colors duration-300">
                <span className="italic font-light">{t('inbis.partnershipDescription')}</span>
              </AnimatedText>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <AnimatedText as="div" className="flex items-center justify-center space-x-8 group">
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 transition-all duration-300 group-hover:scale-110 rounded-full shadow-md overflow-hidden border-2 border-gray-100 dark:border-gray-600">
                  <Image 
                    src="/images/inbis-primakara-logo.jpg" 
                    alt="Inbis Primakara" 
                    fill
                    style={{objectFit: 'cover'}}
                    className="transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>              
                <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full p-3 shadow-md w-12 h-12 md:w-14 md:h-14 transition-all duration-300 group-hover:bg-gray-100 dark:group-hover:bg-gray-600">
                  <FiArrowRight className="w-6 h-6 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 transition-all duration-300 group-hover:scale-110 rounded-full shadow-md overflow-hidden border-2 border-gray-100 dark:border-gray-600">
                  <Image 
                    src="/images/Bajra.png" 
                    alt="Bajramedia" 
                    fill
                    style={{objectFit: 'contain'}}
                    className="bg-white p-0.5 transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </AnimatedText>            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportedBy;
