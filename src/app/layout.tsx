import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar, Footer } from "@/components";
import WhatsAppChat from "@/components/WhatsAppChat";
import SecurityWrapper from "@/components/SecurityWrapper";
import { API_BASE_URL } from "@/config/api";

const inter = Inter({ subsets: ["latin"] });

// Fetch dynamic metadata from settings
async function getMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(`${API_BASE_URL}?endpoint=settings`, {
      headers: {
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (response.ok) {
      const settings = await response.json();

      // Parse settings based on structure
      let seoSettings: any = {};
      let siteName = 'Bajramedia';
      let siteDescription = 'Professional digital solutions for your business growth';

      if (Array.isArray(settings)) {
        // Key-value structure
        settings.forEach((setting: any) => {
          if (setting.key?.startsWith('seo_')) {
            const key = setting.key.replace('seo_', '');
            seoSettings[key] = setting.value;
          } else if (setting.key === 'siteName') {
            siteName = setting.value;
          } else if (setting.key === 'siteDescription') {
            siteDescription = setting.value;
          }
        });
      } else {
        // Object structure
        seoSettings = settings.seoSettings || {};
        siteName = settings.siteName || siteName;
        siteDescription = settings.siteDescription || siteDescription;
      }

      const title = seoSettings.metaTitle || `${siteName} - Digital Solutions Agency`;
      const description = seoSettings.metaDescription || siteDescription;
      const keywords = seoSettings.metaKeywords || 'web development, mobile apps, UI/UX design, digital marketing, Bali, Indonesia, digital agency, creative agency';
      const ogImage = seoSettings.ogImage || 'https://bajramedia.com/images/og-image.jpg';

      return {
        title: {
          default: title,
          template: `%s | ${siteName}`
        },
        description,
        keywords: keywords.split(',').map((k: string) => k.trim()),
        authors: [{ name: "Bajramedia Team", url: "https://bajramedia.com/about" }],
        creator: siteName,
        publisher: siteName,
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          }
        },
        openGraph: {
          type: "website",
          locale: "en_US",
          alternateLocale: ["id_ID"],
          url: "https://bajramedia.com",
          title,
          description,
          siteName,
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
              type: 'image/jpeg'
            }
          ]
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [ogImage],
          creator: "@bajramedia"
        },
        verification: {
          google: process.env.GOOGLE_VERIFICATION_CODE || "your-google-verification-code",
          yandex: process.env.YANDEX_VERIFICATION_CODE || "your-yandex-verification-code",
          yahoo: process.env.YAHOO_VERIFICATION_CODE || "your-yahoo-verification-code"
        },
        alternates: {
          canonical: "https://bajramedia.com",
          languages: {
            'en-US': 'https://bajramedia.com',
            'id-ID': 'https://bajramedia.com/id'
          }
        },
        category: 'Digital Agency',
        classification: 'Business'
      };
    }
  } catch (error) {
    console.error('Failed to fetch dynamic metadata:', error);
  }

  // Fallback metadata
  return {
    title: {
      default: "Bajramedia - Digital Solutions Agency",
      template: "%s | Bajramedia"
    },
    description: "Professional digital solutions for your business growth. Web development, mobile apps, UI/UX design, and digital marketing services.",
    keywords: ["web development", "mobile apps", "UI/UX design", "digital marketing", "Bali", "Indonesia", "digital agency"],
    authors: [{ name: "Bajramedia Team" }],
    creator: "Bajramedia",
    publisher: "Bajramedia",
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://bajramedia.com",
      title: "Bajramedia - Digital Solutions Agency",
      description: "Professional digital solutions for your business growth",
      siteName: "Bajramedia",
    },
    twitter: {
      card: "summary_large_image",
      title: "Bajramedia - Digital Solutions Agency",
      description: "Professional digital solutions for your business growth",
    }
  };
}

export const metadata: Metadata = await getMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Enhanced SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#10B981" />
        <meta name="msapplication-TileColor" content="#10B981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://balimoonartandspeace.com" />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className={inter.className}>
        <SecurityWrapper>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <WhatsAppChat />
            </div>
          </LanguageProvider>
        </SecurityWrapper>
      </body>
    </html>
  );
}
