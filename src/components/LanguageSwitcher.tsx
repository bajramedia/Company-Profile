"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage, isChanging } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <div className="relative">
      <button
        onClick={toggleLanguage}
        disabled={isChanging}
        className={`flex items-center text-sm font-medium text-gray-600 hover:text-green-500 transition-all duration-300 ${isChanging ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        <svg
          className={`w-4 h-4 mr-1.5 transition-transform duration-300 ${isChanging ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className={`transition-all duration-300 ${isChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {language === 'en' ? 'ID' : 'EN'}
        </span>
      </button>
      {isChanging && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 border border-gray-300 border-t-primary rounded-full animate-spin ml-5"></div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
