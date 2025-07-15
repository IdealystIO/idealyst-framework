// =============================================================================
// THEME PACKAGE - Complete theming solution
// =============================================================================

// Import everything we need first
import {
  generateColorPalette,
  lighten,
  darken,
  createLightResolvedIntents,
  createDarkResolvedIntents,
  createLightResolvedColors,
  createDarkResolvedColors,
  extendTheme,
  type ThemeConfig,
  type ThemeColorPalette,
  type ResolvedIntent,
  type ThemeColorSystem,
  createTheme,
} from './themeBuilder';

import {
  createDefaultLightTheme,
  createDefaultDarkTheme,
  createStandardPalettes,
  createDarkPalettes,
  createLightIntentMappings,
  createDarkIntentMappings,
  createLightColorMappings,
  createDarkColorMappings,
  defaultLightTheme,
  defaultDarkTheme,
} from './defaultThemes';

import { commonThemeProperties } from './common';

import { breakpoints } from './breakpoints';
// Note: Removed import from ../unistyles to prevent circular dependency
// when navigation package imports from this theme index

// Re-export everything for external use
export {
  // Primary theme creation functions - exported directly
  createTheme,
  extendTheme,
  
  // Core theme building functionality
  generateColorPalette,
  lighten,
  darken,
  createLightResolvedIntents,
  createDarkResolvedIntents,
  createLightResolvedColors,
  createDarkResolvedColors,
  
  // Type definitions
  type ThemeConfig,
  type ThemeColorPalette,
  type ResolvedIntent,
  type ThemeColorSystem,
  
  // Default themes and palettes
  createDefaultLightTheme,
  createDefaultDarkTheme,
  createStandardPalettes,
  createDarkPalettes,
  createLightIntentMappings,
  createDarkIntentMappings,
  createLightColorMappings,
  createDarkColorMappings,
  defaultLightTheme,
  defaultDarkTheme,
  commonThemeProperties,
  
  // Breakpoints for responsive design
  breakpoints,
};

// Individual theme exports for backward compatibility
export const lightTheme = defaultLightTheme;
export const darkTheme = defaultDarkTheme;

// =============================================================================
// THEME PRESETS - Ready-to-use theme configurations
// =============================================================================

/**
 * Complete theme presets ready for immediate use
 */
export const themePresets = {
  // Standard themes
  light: defaultLightTheme,
  dark: defaultDarkTheme,
} as const;

/**
 * Theme creation utilities
 */
export const themeUtils = {
  // Color palette generation
  generateColorPalette,
  lighten,
  darken,
  
  // Palette creators
  createStandardPalettes,
  createDarkPalettes,
  
  // Intent creators
  createLightIntentMappings,
  createDarkIntentMappings,
  
  // Color system creators
  createLightColorMappings,
  createDarkColorMappings,
} as const;

/**
 * Type definitions for theme-related interfaces
 */
export type ThemePreset = keyof typeof themePresets;
export type ThemeMode = 'light' | 'dark';
export type AppTheme = typeof defaultLightTheme; // Define AppTheme to avoid circular dependency

// =============================================================================
// CONVENIENCE EXPORTS - For common use cases
// =============================================================================

/**
 * Quick access to commonly used themes
 */
export const quickThemes = {
  light: defaultLightTheme,
  dark: defaultDarkTheme,
} as const;

/**
 * All available color palettes (standard + extended)
 */
export const allColorPalettes = {
  ...createStandardPalettes(),
  ...createDarkPalettes(),
} as const;

// =============================================================================
// DOCUMENTATION HELPERS
// =============================================================================

/**
 * Theme documentation and examples
 */
export const themeDocumentation = {
  description: 'Complete theming system for cross-platform React components',
  availableThemes: Object.keys(themePresets),
  availablePalettes: Object.keys(allColorPalettes),
  themeStructure: {
    palettes: 'Color palettes with 50-900 shades',
    intents: 'Semantic color mappings (primary, success, error, etc.)',
    colors: 'Component color system (text, surface, border, interactive)',
    typography: 'Font families, sizes, weights, and line heights',
    spacing: 'Consistent spacing scale',
    borderRadius: 'Border radius scale',
    shadows: 'Shadow definitions for elevation',
    transitions: 'Animation timing definitions',
  },
} as const; 
