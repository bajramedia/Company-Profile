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
  
  return (
    <div className={`pt-6 mt-[-1px] pb-20 relative ${className}`} style={{
      backgroundColor: "#f9fafb",
      backgroundImage: `radial-gradient(${primaryColor}08 1.2px, transparent 1.2px)`,
      backgroundSize: '28px 28px'
    }}>
      {/* Subtle decorative elements */}
      <div className="absolute top-12 left-8 w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.1 }}></div>
      <div className="absolute bottom-12 right-10 w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.1 }}></div>
      <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.1 }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.1 }}></div>
      
      <div className="max-w-3xl mx-auto px-6 sm:px-8 md:px-10 relative z-10">
        <div className="bg-white py-10 px-6 md:px-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col items-center justify-center text-center space-y-5">
            <AnimatedText as="div" className="mb-1">
              <div className="inline-flex items-center justify-center">
                <span 
                  className="text-sm font-bold px-5 py-2.5 rounded-full shadow-md inline-block"
                  style={{ 
                    color: "white", 
                    backgroundColor: primaryColor,
                    boxShadow: `0 4px 14px ${primaryColor}30`
                  }}
                >
                  {t('inbis.officialCollaboration')}
                </span>
              </div>
            </AnimatedText>
            
            <AnimatedText as="div" className="flex items-center space-x-5 group">
              <div className="relative w-14 h-14 flex-shrink-0 transition-all duration-300 group-hover:scale-110 rounded-full shadow-md overflow-hidden border-2 border-gray-100">
                <Image 
                  src="/images/inbis-primakara-logo.jpg" 
                  alt="Inbis Primakara" 
                  fill
                  style={{objectFit: 'cover'}}
                  className="transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-center bg-gray-50 rounded-full p-2 shadow-md w-10 h-10 transition-all duration-300 group-hover:bg-gray-100">
                <FiArrowRight className="w-5 h-5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="relative w-14 h-14 flex-shrink-0 transition-all duration-300 group-hover:scale-110 rounded-full shadow-md overflow-hidden border-2 border-gray-100">
                <Image 
                  src="/images/Bajra.png" 
                  alt="Bajramedia" 
                  fill
                  style={{objectFit: 'contain'}}
                  className="bg-white p-0.5 transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </AnimatedText>
            
            <AnimatedText as="p" className="text-sm text-gray-600 max-w-md leading-relaxed text-center px-4 mt-3">
              <span className="italic font-light">{t('inbis.partnershipDescription')}</span>
            </AnimatedText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportedBy;
