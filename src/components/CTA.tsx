"use client";

import React from 'react';
import Link from 'next/link';
import Button from './Button';
import AnimatedText from './AnimatedText';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle } from 'lucide-react';

interface CTAProps {
  className?: string;
}

const CTA: React.FC<CTAProps> = ({ className = '' }) => {
  const { t } = useLanguage();

  const whyChooseUsPoints = [
    t('cta.point1') || 'Tim Profesional & Berpengalaman',
    t('cta.point2') || 'Solusi Digital Inovatif & Terkini',
    t('cta.point3') || 'Harga Kompetitif & Transparan',
    t('cta.point4') || 'Dukungan Purna Jual Terbaik',
  ];

  return (
    <section className={`py-20 md:py-28 bg-gradient-to-br from-primary to-blue-900 dark:from-gray-900 dark:to-black relative overflow-hidden text-white ${className}`}>
      {/* Wave-shaped connector to SupportedBy section */}
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
      <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-32 h-32 rounded-full bg-white/5 dark:bg-gray-700/20 transition-colors duration-300"></div>
      <div className="absolute -bottom-5 right-1/4 w-16 h-16 rounded-full bg-white/5 dark:bg-gray-700/20 transition-colors duration-300"></div>

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

      <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="w-full lg:w-[55%]">
            <AnimatedText as="div">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight">
                {t('cta.title') || 'Mengapa Harus Kami?'}
              </h2>
            </AnimatedText>
            <AnimatedText as="div">
              <p className="text-gray-200 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
                {t('cta.description') || 'Kami bukan sekadar penyedia jasa, kami adalah partner pertumbuhan bisnis Anda. Kami menggabungkan keahlian teknis dengan pemahaman mendalam tentang kebutuhan pasar untuk memberikan hasil yang tidak hanya memuaskan, tetapi juga mendorong kesuksesan jangka panjang.'}
              </p>
            </AnimatedText>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {whyChooseUsPoints.map((point, index) => (
                <AnimatedText as="div" key={index}>
                  <div className="flex items-start gap-3 bg-white/10 dark:bg-gray-800/40 p-4 rounded-lg shadow-sm hover:bg-white/20 transition-all duration-300">
                    <CheckCircle className="w-7 h-7 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-100 dark:text-gray-200 font-medium">{point}</span>
                  </div>
                </AnimatedText>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 flex flex-col gap-5 mt-10 lg:mt-0">
            <Link href="https://wa.me/6285739402436?text=Halo%20Bajramedia!%20Saya%20tertarik%20untuk%20memulai%20proyek%20digital.%20Bisa%20konsultasi%20gratis?" target="_blank" className="w-full">
              <Button
                variant="primary"
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-lg font-bold shadow-lg w-full hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 group text-lg"
              >
                <span className="text-base font-semibold flex items-center justify-center">
                  {t('cta.primaryButton') || 'Mulai Proyek'}
                  <svg className="w-0 h-5 ml-0 opacity-0 group-hover:w-5 group-hover:ml-2 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>

            <Link href="/contact" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="py-4 px-8 rounded-lg font-bold text-white border-2 border-white/40 hover:bg-white/10 hover:border-white transform hover:-translate-y-1.5 w-full transition-all duration-300 group text-lg"
              >
                <span className="text-base font-semibold flex items-center justify-center">
                  {t('cta.secondaryButton') || 'Hubungi Kami'}
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
