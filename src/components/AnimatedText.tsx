"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'div' 
}) => {
  const { isChanging } = useLanguage();

  return (
    <Component 
      className={`transition-all duration-300 ease-out ${
        isChanging 
          ? 'opacity-0 translate-y-2 scale-[0.98] blur-[1px]' 
          : 'opacity-100 translate-y-0 scale-100 blur-0'
      } ${className}`}
      style={{
        transitionDelay: isChanging ? '0ms' : '50ms'
      }}
    >
      {children}
    </Component>
  );
};

export default AnimatedText;
