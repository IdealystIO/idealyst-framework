/**
 * Theme Variant Types
 * 
 * This file defines the type system for component styling:
 * - IntentVariant: For action-oriented components (buttons, inputs, alerts, etc.)
 * - ColorVariant: For display components (text, badges, avatars, etc.)
 */

// Intent variants for action-oriented components
// These map to semantic meanings and have contextual colors (main, on, container, etc.)
export type IntentVariant = 
  | 'primary'
  | 'success' 
  | 'error'
  | 'warning'
  | 'neutral'
  | 'info';

// Base color names - Standard color palette
type BaseColors = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'black' | 'gray' | 'white';

// Color shades available in the palette
type ColorShades = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// Generate color variants with shades using template literal types
type ColorWithShades<T extends string> = T | `${T}.${ColorShades}`;

// Color variants for display components  
// These map directly to color palette entries
// Automatically generates: 'blue' | 'blue.50' | 'blue.100' | ... | 'cyan.900'
export type ColorVariant = ColorWithShades<BaseColors>;

// Semantic color variants for text and other display elements
export type SemanticColorVariant = 
  | 'primary'    // Main text color
  | 'secondary'  // Secondary text color
  | 'disabled'   // Disabled text color
  | 'inverse'    // Inverse text color
  | 'muted';     // Muted text color

// Combined color variant type that includes both palette colors and semantic colors
export type DisplayColorVariant = ColorVariant | SemanticColorVariant;

// Helper types for theme integration
export type IntentMapping = {
  palette: ColorVariant;
  main: number;
  on: string;
  container: number;
  onContainer: number;
  light: number;
  dark: number;
  border: number;
};

export type ColorPaletteShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; 