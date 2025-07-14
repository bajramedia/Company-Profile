export const colors = {
  // Brand Colors
  primary: '#00D084', // Warna hijau dari logo
  primaryHover: '#00B873', // Slightly darker for hover states
  primaryLight: '#E6FAF3', // Light version for backgrounds
  
  // Accent Colors
  secondary: '#1E293B', // Dark blue for text
  accent: '#3B82F6', // Blue for highlights
  
  // Text Colors
  textPrimary: '#1E293B', // Dark text
  textSecondary: '#64748B', // Secondary text
  textLight: '#94A3B8', // Light text
  
  // Background Colors
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F8FAFC',
  bgDark: '#0F172A',
  
  // Status Colors
  success: '#00D084',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Dark Mode Colors
  darkBgPrimary: '#0F172A',
  darkBgSecondary: '#1E293B',
  darkTextPrimary: '#F8FAFC',
  darkTextSecondary: '#CBD5E1'
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
