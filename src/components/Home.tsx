"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AnimatedText from './AnimatedText';
import { usePublicSettings } from '@/hooks/useSettings';
import Logo from './Logo';
import Button from './Button';
import Heading from './Heading';
import Text from './Text';
import LanguageSwitcher from './LanguageSwitcher';
import Blog from './Blog';
import CTA from './CTA';
import Team from './Team';
import Navbar from './Navbar';
import Script from 'next/script';
import { generateWebsiteSchema, generateLocalBusinessSchema } from '@/lib/jsonld';

export default function Home() {
  const { t, language } = useLanguage();
  const { settings: publicSettings, loading: settingsLoading } = usePublicSettings();

  // Generate JSON-LD schemas
  const websiteSchema = generateWebsiteSchema({
    name: publicSettings?.siteName || 'Bajramedia',
    url: 'https://bajramedia.com',
    description: publicSettings?.siteDescription || 'Creative Digital Agency & Blog Platform',
    logo: 'https://bajramedia.com/images/logo.png',
    contactPoint: {
      telephone: publicSettings?.contactPhone || '',
      email: publicSettings?.contactEmail || 'info@bajramedia.com',
      contactType: 'customer service',
    },
    address: {
      addressLocality: 'Bali',
      addressCountry: 'Indonesia',
    },
    sameAs: [
      publicSettings?.socialLinks?.facebook,
      publicSettings?.socialLinks?.twitter,
      publicSettings?.socialLinks?.instagram,
      publicSettings?.socialLinks?.linkedin,
    ].filter(Boolean) as string[],
  });

  // Generate local business schema
  const localBusinessSchema = generateLocalBusinessSchema({
    name: publicSettings?.siteName || 'Bajramedia',
    url: 'https://bajramedia.com',
    description: publicSettings?.siteDescription || 'Creative Digital Agency & Blog Platform',
    logo: 'https://bajramedia.com/images/logo.png',
    contactPoint: {
      telephone: publicSettings?.contactPhone || '',
      email: publicSettings?.contactEmail || 'info@bajramedia.com',
    },
    address: {
      addressLocality: 'Bali',
      addressCountry: 'Indonesia',
    },
  });

  return (
    <>
      {/* Add structured data for SEO */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Use Navbar component instead of hardcoded header */}
        <Navbar activeTab="home" showDropdown={true} />

        {/* Rest of your component content... */}
        {/* Blog Section */}
        <Blog />

        {/* Team Section */}
        <Team />

        {/* CTA Section */}
        <CTA />

        {/* Footer Section */}
        {/* Footer will be handled by ClientLayout */}
      </div>
    </>
  );
}
