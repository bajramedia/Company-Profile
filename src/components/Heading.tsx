import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  variant: 'h1' | 'h4';
  color?: 'primary' | 'secondary' | 'accent' | 'foreground' | 'muted' | 'success' | 'warning' | 'error';
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  variant,
  color = 'foreground',
  className = '',
}) => {
  const baseClasses = 'font-poppins font-bold transition-colors duration-300';
  
  const variantClasses = {
    h1: 'text-4xl md:text-5xl lg:text-6xl leading-tight',
    h4: 'text-lg md:text-xl lg:text-2xl leading-relaxed',
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    foreground: 'text-foreground',
    muted: 'text-muted',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${colorClasses[color]} ${className}`;

  const Component = variant;

  return (
    <Component className={finalClasses}>
      {children}
    </Component>
  );
};

export default Heading;
