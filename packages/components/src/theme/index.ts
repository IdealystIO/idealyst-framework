// =============================================================================
// THEME PACKAGE - Complete theming solution
// =============================================================================
// This file exports everything needed for theming in a clean, organized way

// Import everything we need first
import {
  createTheme,
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
  commonThemeProperties,
} from './defaultThemes';

import {
  extendedThemes,
  extendedColorPalettes,
  extendedDarkColorPalettes,
  type ExtendedColorVariant,
  type ExtendedIntentVariant,
} from '../examples/extendedTheme';

import { breakpoints } from './breakpoints';
// Note: Removed import from ../unistyles to prevent circular dependency
// when navigation package imports from this theme index

// Re-export standardized type definitions
export * from './variants';

// Re-export everything for external use
export {
  // Core theme building functionality
  createTheme,
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
  
  // Extended themes for examples
  extendedThemes,
  extendedColorPalettes,
  extendedDarkColorPalettes,
  type ExtendedColorVariant,
  type ExtendedIntentVariant,
  
  // Breakpoints for responsive design
  breakpoints,
  
  // Legacy theme exports for backward compatibility (avoiding circular dependency)
  extendedThemes as legacyThemes,
};

// Individual theme exports for backward compatibility
export const lightTheme = extendedThemes.light;
export const darkTheme = extendedThemes.dark;

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
  
  // Extended themes with additional colors
  lightExtended: extendedThemes.light,
  darkExtended: extendedThemes.dark,
} as const;

/**
 * Theme creation utilities
 */
export const themeUtils = {
  // Color palette generation
  generateColorPalette,
  lighten,
  darken,
  
  // Theme creation
  createTheme,
  extendTheme,
  
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
export type AppTheme = typeof extendedThemes.light; // Define AppTheme to avoid circular dependency

// =============================================================================
// CONVENIENCE EXPORTS - For common use cases
// =============================================================================

/**
 * Quick access to commonly used themes
 */
export const quickThemes = {
  light: extendedThemes.light,
  dark: extendedThemes.dark,
} as const;

/**
 * All available color palettes (standard + extended)
 */
export const allColorPalettes = {
  ...createStandardPalettes(),
  ...extendedColorPalettes,
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