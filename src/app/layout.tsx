import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import ClientLayout from "@/components/ClientLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bajramedia - Digital Solutions Agency",
  description: "We build digital solutions that drive business success. Specialized in web development, mobile apps, UI/UX design, and digital marketing.",
  keywords: "digital agency, web development, mobile apps, UI/UX design, digital marketing, Bajramedia",
  authors: [{ name: "Bajramedia Team" }],
  creator: "Bajramedia",
  publisher: "Bajramedia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bajramedia.com",
    siteName: "Bajramedia",
    title: "Bajramedia - Digital Solutions Agency",
    description: "We build digital solutions that drive business success.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Bajramedia Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bajramedia - Digital Solutions Agency",
    description: "We build digital solutions that drive business success.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Security Script - Disable Console & Unauthorized Access */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Production security measures
              if (typeof window !== 'undefined' && window.location.hostname.includes('bajramedia.com')) {
                // Disable console in production
                Object.defineProperty(window, 'console', {
                  value: {},
                  writable: false,
                  configurable: false
                });
                
                // Disable right-click context menu
                document.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                  return false;
                }, false);
                
                // Disable F12, Ctrl+Shift+I, Ctrl+U
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'F12' || 
                      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                      (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    window.location.href = '/404';
                    return false;
                  }
                }, false);
                
                // Detect DevTools
                let devtools = {
                  open: false,
                  orientation: null
                };
                
                const threshold = 160;
                setInterval(function() {
                  if (window.outerHeight - window.innerHeight > threshold || 
                      window.outerWidth - window.innerWidth > threshold) {
                    if (!devtools.open) {
                      devtools.open = true;
                      window.location.href = '/404';
                    }
                  } else {
                    devtools.open = false;
                  }
                }, 500);
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
