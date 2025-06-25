import type { Metadata, ResolvingMetadata } from 'next';

interface GenerateMetadataParams {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  ogImage?: string;
  locale?: string;
  twitterCard?: string;
  twitterHandle?: string;
}

// Default site constants
const SITE_NAME = 'Bajramedia';
const SITE_DESCRIPTION = 'Creative Digital Agency & Blog Platform';
const SITE_URL = 'https://bajramedia.com';
const DEFAULT_OG_IMAGE = '/images/logo.png';
const DEFAULT_LOCALE = 'id_ID';

export async function generateMetadata(
  params: GenerateMetadataParams,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  // Use parent metadata if available
  const parentMetadata = await parent;
  
  // Merge params with defaults
  const {
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
    tags = [],
    siteName = SITE_NAME,
    siteDescription = SITE_DESCRIPTION,
    siteUrl = SITE_URL,
    ogImage = DEFAULT_OG_IMAGE,
    locale = DEFAULT_LOCALE,
    twitterCard = 'summary_large_image',
    twitterHandle,
  } = params;
  
  // Create title with siteName
  const metadataTitle = title ? `${title} | ${siteName}` : siteName;
  const metadataDescription = description || siteDescription;
  const metadataImage = image || ogImage;
  const metadataUrl = url || siteUrl;
  
  // Create openGraph object based on type
  const openGraphConfig = type === 'article' ? {
    title: metadataTitle,
    description: metadataDescription,
    url: metadataUrl,
    siteName: siteName,
    locale: locale,
    type: 'article' as const,
    images: [
      {
        url: metadataImage,
        alt: `${title || siteName} image`,
      },
    ],
    publishedTime: publishedTime,
    modifiedTime: modifiedTime,
    authors: author ? [author] : undefined,
    section: section,
    tags: tags,
  } : {
    title: metadataTitle,
    description: metadataDescription,
    url: metadataUrl,
    siteName: siteName,
    locale: locale,
    type: 'website' as const,
    images: [
      {
        url: metadataImage,
        alt: `${title || siteName} image`,
      },
    ],
  };

  // Basic metadata
  const metadata: Metadata = {
    title: metadataTitle,
    description: metadataDescription,
    keywords: keywords,
    authors: author ? [{ name: author }] : [{ name: siteName }],
    openGraph: openGraphConfig,
    twitter: {
      card: twitterCard as 'summary_large_image' | 'summary',
      title: metadataTitle,
      description: metadataDescription,
      images: [metadataImage],
      site: twitterHandle,
    },
    alternates: {
      canonical: metadataUrl,
    },
    metadataBase: new URL(siteUrl),
    robots: {
      index: true,
      follow: true,
    },
  };

  return metadata;
}
