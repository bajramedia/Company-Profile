"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingDarkMode() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed left-6 bottom-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
      aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
    >
      {theme === 'dark' ? (
        <Sun className="w-6 h-6 text-yellow-500 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700 group-hover:rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
} 