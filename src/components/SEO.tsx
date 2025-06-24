'use client';

import { usePublicSettings } from '@/hooks/useSettings';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SEOProps) {
  const { settings, loading } = usePublicSettings();

  if (loading) return null;

  // Fallback ke settings default jika tidak ada props
  const seoTitle = title ? `${title} | ${settings?.siteName || 'Bajramedia'}` : settings?.seoSettings?.metaTitle || settings?.siteName || 'Bajramedia';
  const seoDescription = description || settings?.seoSettings?.metaDescription || settings?.siteDescription || 'Creative Digital Agency & Blog Platform';
  const seoKeywords = keywords || settings?.seoSettings?.metaKeywords || 'digital agency, creative, design, development, bali';
  const seoImage = image || settings?.seoSettings?.ogImage || '/images/logo.png';
  const seoUrl = url || settings?.siteUrl || 'https://bajramedia.com';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author || settings?.siteName || 'Bajramedia'} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={settings?.siteName || 'Bajramedia'} />
      <meta property="og:locale" content="id_ID" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      {settings?.socialLinks?.twitter && (
        <meta name="twitter:site" content={`@${settings.socialLinks.twitter.replace('https://twitter.com/', '')}`} />
      )}
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#10B981" />
      <meta name="msapplication-TileColor" content="#10B981" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/images/logo.png" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === 'article' ? 'Article' : 'Organization',
            "name": settings?.siteName || 'Bajramedia',
            "description": seoDescription,
            "url": seoUrl,
            "logo": seoImage,
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": settings?.contactPhone,
              "contactType": "customer service",
              "email": settings?.contactEmail
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": settings?.contactAddress
            },
            "sameAs": [
              settings?.socialLinks?.facebook,
              settings?.socialLinks?.twitter,
              settings?.socialLinks?.instagram,
              settings?.socialLinks?.linkedin,
              settings?.socialLinks?.youtube
            ].filter(Boolean)
          })
        }}
      />
    </Head>
  );
}
