"use client";

import { usePathname } from 'next/navigation';
import { Navbar, Footer } from '@/components';
import WhatsAppChat from '@/components/WhatsAppChat';
import { ThemeProvider } from 'next-themes';
import FloatingDarkMode from './FloatingDarkMode';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  // Don't show navbar and footer for admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes use their own layout
    return <>{children}</>;
  }

  // Regular routes get navbar, footer, and floating buttons
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingDarkMode />
        <WhatsAppChat />
      </div>
    </ThemeProvider>
  );
}
