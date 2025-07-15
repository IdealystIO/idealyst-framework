// Base color palettes - these are the source of truth for all colors
export const colorPalettes = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  purple: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
} as const;

// Intent system - maps semantic meanings to color palettes
export const intentMappings = {
  primary: {
    palette: 'blue' as const,
    main: 500 as const,
    on: '#ffffff',
    container: 100 as const,
    onContainer: 800 as const,
    light: 200 as const,
    dark: 700 as const,
    border: 300 as const,
  },
  
  success: {
    palette: 'green' as const,
    main: 500 as const,
    on: '#ffffff',
    container: 100 as const,
    onContainer: 800 as const,
    light: 200 as const,
    dark: 700 as const,
    border: 300 as const,
  },
  
  error: {
    palette: 'red' as const,
    main: 500 as const,
    on: '#ffffff',
    container: 100 as const,
    onContainer: 800 as const,
    light: 200 as const,
    dark: 700 as const,
    border: 300 as const,
  },
  
  warning: {
    palette: 'amber' as const,
    main: 500 as const,
    on: '#ffffff',
    container: 100 as const,
    onContainer: 800 as const,
    light: 200 as const,
    dark: 700 as const,
    border: 300 as const,
  },
  
  neutral: {
    palette: 'gray' as const,
    main: 500 as const,
    on: '#ffffff',
    container: 100 as const,
    onContainer: 800 as const,
    light: 200 as const,
    dark: 700 as const,
    border: 300 as const,
  },
  
  info: {
    palette: 'cyan' as const,
    main: 500 as const,
    on: '#ffffff',
    container: 100 as const,
    onContainer: 800 as const,
    light: 200 as const,
    dark: 700 as const,
    border: 300 as const,
  },
} as const;

// Color system for display components (non-actionable)
export const colorMappings = {
  // Text colors
  text: {
    primary: 'gray.900' as const,
    secondary: 'gray.600' as const,
    disabled: 'gray.400' as const,
    inverse: '#ffffff',
  },
  
  // Surface colors
  surface: {
    primary: '#ffffff',
    secondary: 'gray.50' as const,
    tertiary: 'gray.100' as const,
    inverse: 'gray.900' as const,
  },
  
  // Border colors
  border: {
    primary: 'gray.200' as const,
    secondary: 'gray.300' as const,
    focus: 'primary' as const, // References intent.primary.main
  },
  
  // Direct color references (for backward compatibility and special cases)
  primary: 'primary' as const,   // References intent.primary.main
  success: 'success' as const,   // References intent.success.main
  error: 'error' as const,       // References intent.error.main
  warning: 'warning' as const,   // References intent.warning.main
  neutral: 'neutral' as const,   // References intent.neutral.main
  info: 'info' as const,         // References intent.info.main
} as const;

// Dark theme overrides
export const darkThemeOverrides = {
  colorMappings: {
    text: {
      primary: 'gray.50' as const,
      secondary: 'gray.300' as const,
      disabled: 'gray.500' as const,
      inverse: 'gray.900' as const,
    },
    
    surface: {
      primary: 'gray.900' as const,
      secondary: 'gray.800' as const,
      tertiary: 'gray.700' as const,
      inverse: '#ffffff',
    },
    
    border: {
      primary: 'gray.700' as const,
      secondary: 'gray.600' as const,
      focus: 'primary' as const,
    },
  },
  
  // Dark theme intent adjustments
  intentMappings: {
    primary: {
      palette: 'blue' as const,
      main: 400 as const,        // Lighter blue for dark theme
      on: 'gray.900' as const,   // Dark text on light blue
      container: 900 as const,   // Very dark blue container
      onContainer: 100 as const, // Light text on dark container
      light: 800 as const,
      dark: 300 as const,
      border: 400 as const,
    },
    
    success: {
      palette: 'green' as const,
      main: 400 as const,
      on: 'gray.900' as const,
      container: 900 as const,
      onContainer: 100 as const,
      light: 800 as const,
      dark: 300 as const,
      border: 400 as const,
    },
    
    error: {
      palette: 'red' as const,
      main: 400 as const,
      on: 'gray.900' as const,
      container: 900 as const,
      onContainer: 100 as const,
      light: 800 as const,
      dark: 300 as const,
      border: 400 as const,
    },
    
    warning: {
      palette: 'amber' as const,
      main: 400 as const,
      on: 'gray.900' as const,
      container: 900 as const,
      onContainer: 100 as const,
      light: 800 as const,
      dark: 300 as const,
      border: 400 as const,
    },
    
    neutral: {
      palette: 'gray' as const,
      main: 400 as const,
      on: 'gray.900' as const,
      container: 800 as const,
      onContainer: 100 as const,
      light: 700 as const,
      dark: 300 as const,
      border: 400 as const,
    },
    
    info: {
      palette: 'cyan' as const,
      main: 400 as const,
      on: 'gray.900' as const,
      container: 900 as const,
      onContainer: 100 as const,
      light: 800 as const,
      dark: 300 as const,
      border: 400 as const,
    },
  },
} as const;

// Import variant types
import type { IntentVariant, ColorVariant, ColorPaletteShade } from './variants';

// Export types for TypeScript
export type ColorPalette = keyof typeof colorPalettes;
export type ColorShade = keyof typeof colorPalettes.blue;
export type IntentName = keyof typeof intentMappings;
export type ColorName = keyof typeof colorMappings;

// Ensure our variant types match the actual data structures
export type { IntentVariant, ColorVariant, ColorPaletteShade }; 