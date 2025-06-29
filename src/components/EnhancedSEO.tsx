"use client";

import { useEffect } from 'react';
import Head from 'next/head';
import { usePublicSettings } from '@/hooks/useSettings';

interface EnhancedSEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product' | 'service';
    publishedTime?: string;
    modifiedTime?: string;
    author?: {
        name: string;
        url?: string;
        image?: string;
    };
    organization?: {
        name: string;
        url: string;
        logo: string;
        sameAs?: string[];
    };
    breadcrumbs?: Array<{
        name: string;
        url: string;
    }>;
    faq?: Array<{
        question: string;
        answer: string;
    }>;
    services?: Array<{
        name: string;
        description: string;
        url: string;
    }>;
    schema?: 'Article' | 'WebPage' | 'Organization' | 'Service' | 'Product' | 'FAQ';
    locale?: string;
    alternateUrls?: Record<string, string>;
}

export default function EnhancedSEO({
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    organization,
    breadcrumbs = [],
    faq = [],
    services = [],
    schema,
    locale = 'en',
    alternateUrls = {}
}: EnhancedSEOProps) {
    const { settings, loading } = usePublicSettings();

    useEffect(() => {
        // Google Analytics
        if (settings?.analyticsCode && typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.analyticsCode}`;
            script.async = true;
            document.head.appendChild(script);

            const configScript = document.createElement('script');
            configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.analyticsCode}');
      `;
            document.head.appendChild(configScript);
        }
    }, [settings]);

    if (loading || !settings) return null;

    // Compile SEO data
    const seoTitle = title ? `${title} | ${settings.siteName}` : settings.seoSettings?.metaTitle || settings.siteName;
    const seoDescription = description || settings.seoSettings?.metaDescription || settings.siteDescription;
    const seoKeywords = keywords.length > 0 ? keywords.join(', ') : settings.seoSettings?.metaKeywords;
    const seoImage = image || settings.seoSettings?.ogImage || `${settings.siteUrl}/images/og-image.jpg`;
    const seoUrl = url || settings.siteUrl;

    // Organization data
    const orgData = organization || {
        name: settings.siteName,
        url: settings.siteUrl,
        logo: `${settings.siteUrl}/images/logo.png`,
        sameAs: Object.values(settings.socialLinks || {}).filter(Boolean)
    };

    // Generate structured data based on schema type
    const generateStructuredData = () => {
        const baseSchema = {
            "@context": "https://schema.org",
            "@type": schema || "WebPage",
            "name": seoTitle,
            "description": seoDescription,
            "url": seoUrl,
            "image": seoImage,
            "inLanguage": locale,
            "isPartOf": {
                "@type": "WebSite",
                "name": settings.siteName,
                "url": settings.siteUrl
            }
        };

        // Add organization data
        if (schema === 'Organization' || type === 'website') {
            return {
                ...baseSchema,
                "@type": "Organization",
                "name": orgData.name,
                "url": orgData.url,
                "logo": {
                    "@type": "ImageObject",
                    "url": orgData.logo
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": settings.contactPhone,
                    "contactType": "customer service",
                    "email": settings.contactEmail,
                    "areaServed": "ID",
                    "availableLanguage": ["English", "Indonesian"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": settings.contactAddress,
                    "addressCountry": "ID"
                },
                "sameAs": orgData.sameAs,
                "foundingDate": "2020",
                "numberOfEmployees": "10-50",
                "slogan": "Digital Solutions for Modern Business"
            };
        }

        // Article schema
        if (schema === 'Article' && author) {
            return {
                ...baseSchema,
                "@type": "Article",
                "headline": seoTitle,
                "datePublished": publishedTime,
                "dateModified": modifiedTime || publishedTime,
                "author": {
                    "@type": "Person",
                    "name": author.name,
                    "url": author.url,
                    "image": author.image
                },
                "publisher": {
                    "@type": "Organization",
                    "name": orgData.name,
                    "logo": {
                        "@type": "ImageObject",
                        "url": orgData.logo
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": seoUrl
                }
            };
        }

        // Service schema
        if (schema === 'Service' && services.length > 0) {
            return {
                ...baseSchema,
                "@type": "Service",
                "serviceType": "Digital Agency Services",
                "provider": {
                    "@type": "Organization",
                    "name": orgData.name,
                    "url": orgData.url
                },
                "areaServed": "Indonesia",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Digital Services",
                    "itemListElement": services.map((service, index) => ({
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": service.name,
                            "description": service.description,
                            "url": service.url
                        }
                    }))
                }
            };
        }

        return baseSchema;
    };

    // FAQ Schema
    const faqSchema = faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    // Breadcrumb Schema
    const breadcrumbSchema = breadcrumbs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
        }))
    } : null;

    return (
        <Head>
            {/* Enhanced Meta Tags */}
            <title>{seoTitle}</title>
            <meta name="description" content={seoDescription} />
            {seoKeywords && <meta name="keywords" content={seoKeywords} />}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <meta name="bingbot" content="index, follow" />

            {/* Language and locale */}
            <meta name="language" content={locale} />
            <meta httpEquiv="content-language" content={locale} />

            {/* Open Graph Enhanced */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={seoTitle} />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:site_name" content={settings.siteName} />
            <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'id_ID'} />

            {/* Twitter Card Enhanced */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDescription} />
            <meta name="twitter:image" content={seoImage} />
            <meta name="twitter:image:alt" content={seoTitle} />
            {settings.socialLinks?.twitter && (
                <meta name="twitter:site" content={`@${settings.socialLinks.twitter.replace(/.*twitter\.com\//, '')}`} />
            )}

            {/* Article specific */}
            {type === 'article' && (
                <>
                    <meta property="article:published_time" content={publishedTime} />
                    <meta property="article:modified_time" content={modifiedTime || publishedTime} />
                    {author && <meta property="article:author" content={author.name} />}
                    <meta property="article:publisher" content={settings.siteName} />
                </>
            )}

            {/* Canonical and alternates */}
            <link rel="canonical" href={seoUrl} />
            {Object.entries(alternateUrls).map(([lang, url]) => (
                <link key={lang} rel="alternate" hrefLang={lang} href={url} />
            ))}

            {/* Enhanced Favicon */}
            <link rel="icon" href="/favicon.ico" sizes="32x32" />
            <link rel="icon" href="/icon.svg" type="image/svg+xml" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/manifest.json" />

            {/* Performance hints */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
            />

            {/* FAQ Schema */}
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            {/* Breadcrumb Schema */}
            {breadcrumbSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                />
            )}
        </Head>
    );
} 