import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter font
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font

export const metadata: Metadata = {
  title: "Bajramedia - Desain Web, Aplikasi Mobile & Solusi Digital",
  description: "Kami menciptakan pengalaman digital yang luar biasa dengan teknologi terdepan dan desain yang memikat untuk mengembangkan bisnis Anda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased main-container green-glow`}> {/* Apply Inter font to body */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
