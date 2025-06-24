import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Insights & Articles',
  description: 'Latest articles, news, and insights about web development, mobile apps, UI/UX design, and digital marketing from Bajramedia.',
  keywords: 'blog, articles, web development, mobile development, UI/UX design, digital marketing, Indonesia',
  openGraph: {
    title: 'Blog - Insights & Articles | Bajramedia',
    description: 'Latest articles, news, and insights about web development, mobile apps, UI/UX design, and digital marketing.',
    url: 'https://bajramedia.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://bajramedia.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Bajramedia Blog',
      }
    ],
  }
};
