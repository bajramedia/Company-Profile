// Color variables that match the CSS custom properties
const colors = {
  // Light theme colors
  light: {
    background: '#ffffff',
    foreground: '#171717',
    primary: '#39ff14',
    secondary: '#6b7280',
    accent: '#8b5cf6',
    muted: '#f3f4f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  // Dark theme colors
  dark: {
    background: '#0a0a0a',
    foreground: '#ededed',
    primary: '#39ff14',
    secondary: '#9ca3af',
    accent: '#a78bfa',
    muted: '#374151',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  }
};

// Font weights for Poppins
export const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

// Export individual color functions
export const getColor = (colorName: keyof typeof colors.light, isDark: boolean = false) => {
  return isDark ? colors.dark[colorName] : colors.light[colorName];
};

export default colors;
