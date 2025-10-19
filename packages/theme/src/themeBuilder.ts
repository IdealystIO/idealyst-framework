import type { ColorPaletteShade } from './variants';
import { commonThemeProperties } from './common';

// =============================================================================
// TYPES
// =============================================================================

export interface ThemeColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ResolvedIntent {
  main: string;
  on: string;
  container: string;
  onContainer: string;
  light: string;
  dark: string;
  border: string;
}

export interface ThemeColorSystem {
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    'inverse-secondary': string;
    'inverse-tertiary': string;
    muted: string;
    placeholder: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
    strong: string;
    focus: string;
    disabled: string;
  };
  interactive: {
    hover: string;
    pressed: string;
    focus: string;
    disabled: string;
  };
}

export interface ThemeConfig {
  name?: string;
  mode?: 'light' | 'dark';
  
  // Required: Color palettes with actual hex values
  palettes: {
    red: ThemeColorPalette;
    orange: ThemeColorPalette;
    yellow: ThemeColorPalette;
    green: ThemeColorPalette;
    blue: ThemeColorPalette;
    purple: ThemeColorPalette;
    black: ThemeColorPalette;
    gray: ThemeColorPalette;
    white: ThemeColorPalette;
  };
  
  // Required: Resolved intent colors (actual hex values)
  intents: {
    primary: ResolvedIntent;
    success: ResolvedIntent;
    error: ResolvedIntent;
    warning: ResolvedIntent;
    neutral: ResolvedIntent;
    info: ResolvedIntent;
  };
  
  // Required: Resolved color system (actual hex values)
  colors: ThemeColorSystem;
  
  // Optional: Typography
  typography?: {
    fontFamily?: string;
    fontSize?: Record<string, number>;
    fontWeight?: Record<string, string>;
    lineHeight?: Record<string, number>;
  };
  
  // Optional: Spacing
  spacing?: Record<string, number>;
  
  // Optional: Border radius
  borderRadius?: Record<string, number>;
  
  // Optional: Shadows
  shadows?: Record<string, any>;
  
  // Optional: Transitions
  transitions?: Record<string, string>;
  
  // Optional: Custom properties
  custom?: Record<string, any>;
}

// =============================================================================
// HELPER FUNCTIONS (exported for optional use)
// =============================================================================

/**
 * Generates a full color palette from a single color
 * This is a helper function that users can choose to use
 */
export function generateColorPalette(baseColor: string): ThemeColorPalette {
  // Simple implementation - in a real app, you'd use a color manipulation library
  const colorMap: Record<string, ThemeColorPalette> = {
    // Red variants
    '#ef4444': { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
    '#dc2626': { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
    
    // Blue variants
    '#3b82f6': { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
    '#2563eb': { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
    
    // Green variants
    '#22c55e': { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
    '#16a34a': { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
    
    // Orange variants
    '#f97316': { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
    '#ea580c': { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
    
    // Purple variants
    '#a855f7': { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed', 800: '#6b21a8', 900: '#581c87' },
    '#9333ea': { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed', 800: '#6b21a8', 900: '#581c87' },
    
    // Yellow variants
    '#eab308': { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12' },
    '#ca8a04': { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12' },
    
    // Gray variants
    '#6b7280': { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
    '#4b5563': { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
    
    // Black variants
    '#000000': { 50: '#f8f9fa', 100: '#f1f3f4', 200: '#e8eaed', 300: '#dadce0', 400: '#bdc1c6', 500: '#9aa0a6', 600: '#80868b', 700: '#5f6368', 800: '#3c4043', 900: '#202124' },
    '#202124': { 50: '#f8f9fa', 100: '#f1f3f4', 200: '#e8eaed', 300: '#dadce0', 400: '#bdc1c6', 500: '#9aa0a6', 600: '#80868b', 700: '#5f6368', 800: '#3c4043', 900: '#202124' },
    
    // White variants
    '#ffffff': { 50: '#ffffff', 100: '#fefefe', 200: '#fdfdfd', 300: '#fcfcfc', 400: '#fafafa', 500: '#f8f8f8', 600: '#f5f5f5', 700: '#f0f0f0', 800: '#e8e8e8', 900: '#d4d4d4' },
    '#f8f8f8': { 50: '#ffffff', 100: '#fefefe', 200: '#fdfdfd', 300: '#fcfcfc', 400: '#fafafa', 500: '#f8f8f8', 600: '#f5f5f5', 700: '#f0f0f0', 800: '#e8e8e8', 900: '#d4d4d4' },
  };
  
  // Return exact match or fallback to a basic palette
  if (colorMap[baseColor]) {
    return colorMap[baseColor];
  }
  
  // Fallback: generate a basic palette
  return {
    50: lighten(baseColor, 0.9),
    100: lighten(baseColor, 0.8),
    200: lighten(baseColor, 0.6),
    300: lighten(baseColor, 0.4),
    400: lighten(baseColor, 0.2),
    500: baseColor,
    600: darken(baseColor, 0.1),
    700: darken(baseColor, 0.2),
    800: darken(baseColor, 0.3),
    900: darken(baseColor, 0.4),
  };
}

/**
 * Simple color lightening function
 */
export function lighten(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Simple color darkening function
 */
export function darken(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.max(0, Math.round(r * (1 - amount)));
  const newG = Math.max(0, Math.round(g * (1 - amount)));
  const newB = Math.max(0, Math.round(b * (1 - amount)));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Helper function to create standard light theme resolved intents
 */
export function createLightResolvedIntents(palettes: ThemeConfig['palettes']): ThemeConfig['intents'] {
  return {
    primary: {
      main: palettes.blue[500],
      on: '#ffffff',
      container: palettes.blue[50],
      onContainer: palettes.blue[900],
      light: palettes.blue[100],
      dark: palettes.blue[700],
      border: palettes.blue[200],
    },
    success: {
      main: palettes.green[500],
      on: '#ffffff',
      container: palettes.green[50],
      onContainer: palettes.green[800],
      light: palettes.green[100],
      dark: palettes.green[700],
      border: palettes.green[200],
    },
    error: {
      main: palettes.red[500],
      on: '#ffffff',
      container: palettes.red[50],
      onContainer: palettes.red[800],
      light: palettes.red[100],
      dark: palettes.red[700],
      border: palettes.red[200],
    },
    warning: {
      main: palettes.orange[500],
      on: '#ffffff',
      container: palettes.orange[50],
      onContainer: palettes.orange[800],
      light: palettes.orange[100],
      dark: palettes.orange[700],
      border: palettes.orange[200],
    },
    neutral: {
      main: palettes.gray[500],
      on: '#ffffff',
      container: palettes.gray[50],
      onContainer: palettes.gray[800],
      light: palettes.gray[100],
      dark: palettes.gray[700],
      border: palettes.gray[200],
    },
    info: {
      main: palettes.blue[500],
      on: '#ffffff',
      container: palettes.blue[50],
      onContainer: palettes.blue[800],
      light: palettes.blue[100],
      dark: palettes.blue[700],
      border: palettes.blue[200],
    },
  };
}

/**
 * Helper function to create standard dark theme resolved intents
 */
export function createDarkResolvedIntents(palettes: ThemeConfig['palettes']): ThemeConfig['intents'] {
  return {
    primary: {
      main: palettes.blue[400],
      on: palettes.gray[50],        // Dark text on primary background
      container: palettes.blue[200], // Darker container for dark mode
      onContainer: palettes.blue[800], // Light text on dark container
      light: palettes.blue[300],
      dark: palettes.blue[600],
      border: palettes.blue[400],
    },
    success: {
      main: palettes.green[400],
      on: palettes.gray[50],        // Dark text on success background
      container: palettes.green[200], // Darker container for dark mode
      onContainer: palettes.green[800], // Light text on dark container
      light: palettes.green[300],
      dark: palettes.green[600],
      border: palettes.green[400],
    },
    error: {
      main: palettes.red[400],
      on: palettes.gray[50],        // Dark text on error background
      container: palettes.red[200],  // Darker container for dark mode
      onContainer: palettes.red[800], // Light text on dark container
      light: palettes.red[300],
      dark: palettes.red[600],
      border: palettes.red[400],
    },
    warning: {
      main: palettes.orange[400],
      on: palettes.gray[50],        // Dark text on warning background
      container: palettes.orange[200], // Darker container for dark mode
      onContainer: palettes.orange[800], // Light text on dark container
      light: palettes.orange[300],
      dark: palettes.orange[600],
      border: palettes.orange[400],
    },
    neutral: {
      main: palettes.gray[400],
      on: palettes.gray[50],        // Dark text on neutral background
      container: palettes.gray[200], // Medium dark container
      onContainer: palettes.gray[800], // Light text on dark container
      light: palettes.gray[300],
      dark: palettes.gray[600],
      border: palettes.gray[400],
    },
    info: {
      main: palettes.blue[400],
      on: palettes.gray[50],        // Dark text on info background
      container: palettes.blue[200], // Darker container for dark mode
      onContainer: palettes.blue[800], // Light text on dark container
      light: palettes.blue[300],
      dark: palettes.blue[600],
      border: palettes.blue[400],
    },
  };
}

/**
 * Helper function to create standard light theme resolved colors
 */
export function createLightResolvedColors(palettes: ThemeConfig['palettes']): ThemeColorSystem {
  return {
    text: {
      primary: palettes.gray[900],                      // Dark text (main)
      secondary: palettes.gray[600],                    // Medium dark text
      tertiary: palettes.gray[500],                     // Light dark text
      disabled: palettes.gray[400],                     // Disabled state
      inverse: '#ffffff',                                // Inverse of primary (light text for dark backgrounds)
      'inverse-secondary': 'rgba(255, 255, 255, 0.9)',  // Inverse of secondary (90% opacity)
      'inverse-tertiary': 'rgba(255, 255, 255, 0.7)',   // Inverse of tertiary (70% opacity)
      muted: palettes.gray[500],                        // Muted text
      placeholder: palettes.gray[400],                  // Placeholder text
    },
    surface: {
      primary: '#ffffff',
      secondary: palettes.gray[50],
      tertiary: palettes.gray[100],
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
      inverse: palettes.gray[900],
    },
    border: {
      primary: palettes.gray[200],
      secondary: palettes.gray[300],
      strong: palettes.gray[400],
      focus: palettes.blue[500], // Using primary color
      disabled: palettes.gray[200],
    },
    interactive: {
      hover: palettes.gray[50],
      pressed: palettes.gray[100],
      focus: palettes.blue[500], // Using primary color
      disabled: palettes.gray[100],
    },
  };
}

/**
 * Helper function to create standard dark theme resolved colors
 */
export function createDarkResolvedColors(palettes: ThemeConfig['palettes']): ThemeColorSystem {
  return {
    text: {
      primary: palettes.gray[900],                      // Light text on dark background (main)
      secondary: palettes.gray[700],                    // Medium light text
      tertiary: palettes.gray[600],                     // Lighter muted text
      disabled: palettes.gray[500],                     // Disabled gray
      inverse: palettes.gray[100],                      // Inverse of primary (dark text for light backgrounds)
      'inverse-secondary': 'rgba(10, 10, 10, 0.9)',     // Inverse of secondary (90% opacity)
      'inverse-tertiary': 'rgba(10, 10, 10, 0.7)',      // Inverse of tertiary (70% opacity)
      muted: palettes.gray[600],                        // Muted text
      placeholder: palettes.gray[500],                  // Placeholder text
    },
    surface: {
      primary: palettes.gray[50],     // Very dark primary surface
      secondary: palettes.gray[100],  // Dark secondary surface
      tertiary: palettes.gray[200],   // Medium dark tertiary surface
      elevated: palettes.gray[100],   // Elevated surface (slightly lighter)
      overlay: 'rgba(0, 0, 0, 0.8)',  // Dark overlay
      inverse: palettes.gray[900],    // Light surface (inverse)
    },
    border: {
      primary: palettes.gray[300],    // Primary border
      secondary: palettes.gray[200],  // Secondary border
      strong: palettes.gray[400],     // Strong border
      focus: palettes.blue[400],      // Focus border (primary color)
      disabled: palettes.gray[300],   // Disabled border
    },
    interactive: {
      hover: palettes.gray[100],      // Hover state
      pressed: palettes.gray[200],    // Pressed state
      focus: palettes.blue[400],      // Focus state (primary color)
      disabled: palettes.gray[100],   // Disabled state
    },
  };
}

// Default palettes and convenience functions moved to defaultThemes.ts
// This keeps the theme builder focused on core functionality

// =============================================================================
// MAIN THEME CREATION FUNCTION
// =============================================================================

/**
 * Creates a theme with fully explicit resolved colors
 * Users must provide actual hex colors, no automatic resolution
 */
export function createTheme(config: ThemeConfig): any {
  const {
    name = 'CustomTheme',
    mode = 'light',
    palettes,
    intents,
    colors,
    typography = {},
    spacing = {},
    borderRadius = {},
    shadows = {},
    transitions = {},
    custom = {},
  } = config;

  // Generate final theme - no automatic color resolution, just organization
  const theme = {
    name,
    mode,
    
    // Merge with common properties
    ...commonThemeProperties,
    
    // Override with custom properties
    ...custom,
    
    // Typography
    typography: {
      ...commonThemeProperties.typography,
      ...typography,
    },
    
    // Spacing
    spacing: {
      ...commonThemeProperties.spacing,
      ...spacing,
    },
    
    // Border radius
    borderRadius: {
      ...commonThemeProperties.borderRadius,
      ...borderRadius,
    },
    
    // Shadows
    shadows: {
      ...commonThemeProperties.shadows,
      ...shadows,
    },
    
    // Transitions
    transitions: {
      ...commonThemeProperties.transitions,
      ...transitions,
    },
    
    // Color palettes - direct access to all color palettes
    palettes,
    
    // Intent system - for actionable components (all resolved)
    intents,
    
    // Color system - for display components (all resolved)
    colors: {
      // Provided color system
      ...colors,
      
      // Status colors (references to intents)
      primary: intents.primary.main,
      success: intents.success.main,
      error: intents.error.main,
      warning: intents.warning.main,
      neutral: intents.neutral.main,
      info: intents.info.main,
      
      // Legacy colors for backward compatibility
      background: colors.surface.primary,
      textSecondary: colors.text.secondary,
      secondary: intents.neutral.main,
    },
  };

  return theme;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Extends an existing theme with new properties
 */
export function extendTheme(baseTheme: any, extensions: {
  palettes?: Partial<ThemeConfig['palettes']>;
  intents?: Partial<ThemeConfig['intents']>;
  colors?: Partial<ThemeColorSystem>;
  typography?: Partial<ThemeConfig['typography']>;
  spacing?: Record<string, number>;
  borderRadius?: Record<string, number>;
  shadows?: Record<string, any>;
  transitions?: Record<string, string>;
  custom?: Record<string, any>;
}): any {
  return {
    ...baseTheme,
    
    // Merge palettes
    palettes: {
      ...baseTheme.palettes,
      ...extensions.palettes,
    },
    
    // Merge intents
    intents: {
      ...baseTheme.intents,
      ...extensions.intents,
    },
    
    // Merge colors
    colors: {
      ...baseTheme.colors,
      text: {
        ...baseTheme.colors.text,
        ...extensions.colors?.text,
      },
      surface: {
        ...baseTheme.colors.surface,
        ...extensions.colors?.surface,
      },
      border: {
        ...baseTheme.colors.border,
        ...extensions.colors?.border,
      },
      interactive: {
        ...baseTheme.colors.interactive,
        ...extensions.colors?.interactive,
      },
    },
    
    // Merge other properties
    typography: {
      ...baseTheme.typography,
      ...extensions.typography,
    },
    
    spacing: {
      ...baseTheme.spacing,
      ...extensions.spacing,
    },
    
    borderRadius: {
      ...baseTheme.borderRadius,
      ...extensions.borderRadius,
    },
    
    shadows: {
      ...baseTheme.shadows,
      ...extensions.shadows,
    },
    
    transitions: {
      ...baseTheme.transitions,
      ...extensions.transitions,
    },
    
    custom: {
      ...baseTheme.custom,
      ...extensions.custom,
    },
  };
}

// createThemeVariant function removed - users should create themes explicitly
// using createTheme with the appropriate helper functions like createDarkPalettes(),
// createDarkIntentMappings(), and createDarkColorMappings() (found in defaultThemes.ts)

// All exports are declared inline above