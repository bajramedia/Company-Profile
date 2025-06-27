"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePublicSettings } from '@/hooks/useSettings';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showImage?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
  showImage = true,
}) => {
  const { settings: publicSettings, loading } = usePublicSettings();

  const baseClasses = 'font-poppins font-bold transition-all duration-200';

  const variantClasses = {
    light: 'text-white',
    dark: 'text-foreground',
  };

  const sizeClasses = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
  };

  const imageSizes = {
    sm: { mobile: 20, desktop: 24 },
    md: { mobile: 24, desktop: 30 },
    lg: { mobile: 30, desktop: 36 },
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const imageHeight = size === 'sm' ? 'h-[20px] md:h-[24px]' :
    size === 'md' ? 'h-[24px] md:h-[30px]' :
      'h-[30px] md:h-[36px]';

  // Get site name from settings atau fallback ke default
  const siteName = loading ? 'Loading...' : (publicSettings?.siteName || 'Bajramedia');

  // Render site name dengan styling khusus untuk Bajramedia
  const renderSiteName = () => {
    if (siteName.toLowerCase().includes('bajramedia')) {
      return (
        <>
          Bajra<span className="text-green-500">media</span>
        </>
      );
    } else {
      // Jika site name custom, tampilkan apa adanya
      return siteName;
    }
  };

  return (
    <Link href="/" className={`flex items-center gap-1 md:gap-2 ${finalClasses}`}>
      {showImage && (
        <Image
          src="/images/Bajra.png"
          alt={`${siteName} Logo`}
          width={imageSizes[size].desktop}
          height={imageSizes[size].desktop}
          className={`object-contain w-auto ${imageHeight}`}
        />
      )}
      {renderSiteName()}
    </Link>
  );
};

export default Logo;
