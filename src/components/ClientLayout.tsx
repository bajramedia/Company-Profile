"use client";

import React from 'react';
import { LanguageProvider } from "@/context/LanguageContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <LanguageProvider>
      <div className="relative z-10">
        {children}
      </div>
    </LanguageProvider>
  );
};

export default ClientLayout;
