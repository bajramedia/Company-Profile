import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ClientLayout } from "@/components";

export const metadata: Metadata = {
  title: "Bajramedia - Digital Agency",
  description: "Creative digital agency providing innovative technology solutions and cutting-edge design services.",
  keywords: "web development, mobile apps, UI/UX design, digital marketing, Bali, Indonesia",
  authors: [{ name: "Bajramedia Team" }],
  openGraph: {
    title: "Bajramedia - Digital Agency",
    description: "Creative digital agency providing innovative technology solutions and cutting-edge design services.",
    type: "website",
    locale: "id_ID",
    siteName: "Bajramedia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bajramedia - Digital Agency",
    description: "Creative digital agency providing innovative technology solutions and cutting-edge design services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Temporarily disable security restrictions for debugging */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; img-src 'self' data: blob: *; connect-src 'self' *;" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Temporarily enable console and right-click for debugging
              console.log('%c🔓 Security temporarily disabled for debugging', 'color: orange; font-weight: bold;');
              
              // Override any console blocking
              if (typeof console === 'undefined') {
                window.console = {};
                window.console.log = function() {};
                window.console.error = function() {};
                window.console.warn = function() {};
              }
              
              // Prevent right-click blocking
              document.addEventListener('contextmenu', function(e) {
                // Allow right-click for debugging
                console.log('Right-click enabled for debugging');
              });
              
              // Prevent F12 blocking
              document.addEventListener('keydown', function(e) {
                // Allow F12 and other dev tools shortcuts
                console.log('Developer tools shortcuts enabled');
              });
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
