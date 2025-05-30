import React from 'react';

interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'caption' | 'subtitle' | 'overline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'accent' | 'foreground' | 'muted' | 'success' | 'warning' | 'error';
  className?: string;
  as?: 'p' | 'span' | 'div';
}

const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  size = 'md',
  weight = 'regular',
  color = 'foreground',
  className = '',
  as = 'p',
}) => {
  const baseClasses = 'font-poppins';
  
  const variantClasses = {
    body: 'leading-relaxed',
    caption: 'text-sm leading-tight',
    subtitle: 'leading-snug',
    overline: 'uppercase tracking-wider text-xs leading-tight',
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weightClasses = {
    light: 'font-light',
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
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

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${className}`;

  const Component = as;

  return (
    <Component className={finalClasses}>
      {children}
    </Component>
  );
};

export default Text;
