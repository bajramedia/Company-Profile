export const colors = {
  // Light mode colors
  light: {
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
    
    // Status Colors
    success: '#00D084',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  
  // Dark mode colors
  dark: {
    // Brand Colors
    primary: '#00D084', // Keep brand color consistent
    primaryHover: '#00B873',
    primaryLight: '#0D2818', // Darker version for dark mode
    
    // Accent Colors
    secondary: '#F8FAFC', // Light text for dark mode
    accent: '#3B82F6',
    
    // Text Colors
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textLight: '#94A3B8',
    
    // Background Colors
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    
    // Status Colors
    success: '#00D084',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
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
