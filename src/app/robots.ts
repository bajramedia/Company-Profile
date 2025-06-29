import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General rules untuk semua crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '*.pdf',
          '/search?*',
          '/*?utm_*',
          '/*?fbclid=*',
          '/*?gclid=*',
          '/*?ref=*',
          '/test-*',
          '/.well-known/',
          '/uploads/private/',
        ],
        crawlDelay: 1, // Delay 1 detik untuk menghindari overload
      },
      // Khusus untuk Googlebot - lebih permissive
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/test-*'
        ],
      },
      // Khusus untuk Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/test-*'
        ],
      },
      // Block specific bad bots
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'AspiegelBot'
        ],
        disallow: '/',
      }
    ],
    sitemap: [
      'https://www.bajramedia.com/sitemap.xml',
      // Bisa tambah sitemap lain jika ada
      // 'https://www.bajramedia.com/sitemap-images.xml'
    ],
    host: 'https://www.bajramedia.com'
  };
}
