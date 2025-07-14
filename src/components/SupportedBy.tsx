
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Heading from './Heading';
import Text from './Text';
import AnimatedText from './AnimatedText';

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  type: string;
  description: string;
}

const SupportedBy: React.FC = () => {
  const { t, language } = useLanguage();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch partners from database
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        if (response.ok) {
          const data = await response.json();
          setPartners(data || []);
        } else {
          // API failed, set empty partners array
          setPartners([]);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        // No fallback data - set empty array instead
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <AnimatedText as="div">
              <Heading variant="h2" className="text-2xl md:text-3xl font-bold mb-4">
                {language === 'id' ? 'Partner Kami' : 'Our Partners'}
              </Heading>
            </AnimatedText>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-32 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null; // Don't show section if no partners
  }

  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      </div>

      <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <AnimatedText as="div">
            <Heading variant="h1" className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'id' ? 'Partner Terpercaya' : 'Trusted Partners'}
            </Heading>
          </AnimatedText>
          <AnimatedText as="div">
            <Text color="secondary" className="max-w-2xl mx-auto">
              {language === 'id'
                ? 'Bekerjasama dengan partner terbaik untuk memberikan solusi digital berkualitas tinggi'
                : 'Collaborating with the best partners to deliver high-quality digital solutions'
              }
            </Text>
          </AnimatedText>
        </div>

        <AnimatedText as="div">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner, index) => (
              <Link
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-6 rounded-xl bg-white dark:bg-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-[140px] h-20 border border-gray-100 dark:border-gray-600"
                title={partner.description}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={100}
                    height={50}
                    style={{ objectFit: 'contain' }}
                    className="max-w-full max-h-full filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white font-semibold text-sm transition-colors">${partner.name}</span>`;
                      }
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </AnimatedText>

        {/* Call to action for partnerships */}
        <AnimatedText as="div">
          <div className="text-center mt-12">
            <Text color="secondary" className="text-sm mb-4">
              {language === 'id'
                ? 'Tertarik untuk bermitra dengan kami?'
                : 'Interested in partnering with us?'
              }
            </Text>
            <Link
              href="/#contact"
              className="inline-flex items-center text-green-500 hover:text-green-600 font-medium text-sm transition-colors duration-300"
            >
              {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </AnimatedText>
      </div>
    </section>
  );
};

export default SupportedBy;
