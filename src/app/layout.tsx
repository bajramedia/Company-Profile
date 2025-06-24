import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter font
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font

// Base metadata configuration with enhanced SEO
export const metadata: Metadata = {
  title: {
    default: "Bajramedia - Desain Web, Aplikasi Mobile & Solusi Digital",
    template: "%s | Bajramedia"
  },
  description: "Kami menciptakan pengalaman digital yang luar biasa dengan teknologi terdepan dan desain yang memikat untuk mengembangkan bisnis Anda",
  keywords: "digital agency, web design, mobile app, branding, UI/UX, SEO, digital marketing, Bali, Indonesia",
  metadataBase: new URL('https://bajramedia.com'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://bajramedia.com",
    siteName: "Bajramedia",
    title: "Bajramedia - Desain Web, Aplikasi Mobile & Solusi Digital",
    description: "Kami menciptakan pengalaman digital yang luar biasa dengan teknologi terdepan dan desain yang memikat untuk mengembangkan bisnis Anda",
    images: [
      {
        url: "https://bajramedia.com/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Bajramedia Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bajramedia - Desain Web, Aplikasi Mobile & Solusi Digital",
    description: "Kami menciptakan pengalaman digital yang luar biasa dengan teknologi terdepan dan desain yang memikat untuk mengembangkan bisnis Anda",
    images: ["https://bajramedia.com/images/logo.png"],
  },
  alternates: {
    canonical: "https://bajramedia.com",
    languages: {
      'id-ID': 'https://bajramedia.com',
      'en-US': 'https://bajramedia.com/en',
    },
  },
  verification: {
    google: "google-site-verification-code", // Update with your actual code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased main-container green-glow bg-white dark:bg-gray-900 transition-colors duration-300`}> {/* Apply Inter font to body with dark mode support */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
