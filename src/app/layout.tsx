import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar, Footer } from "@/components";
import WhatsAppChat from "@/components/WhatsAppChat";
import SecurityWrapper from "@/components/SecurityWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bajramedia - Digital Solutions Agency",
  description: "Professional digital solutions for your business growth. Web development, mobile apps, UI/UX design, and digital marketing services.",
  keywords: "web development, mobile apps, UI/UX design, digital marketing, Bali, Indonesia",
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
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
