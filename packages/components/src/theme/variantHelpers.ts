/**
 * Variant Helper Functions
 * 
 * These functions dynamically generate style variants from theme configuration,
 * making the system extensible when new colors or intents are added.
 */

import type { ColorVariant, IntentVariant, ColorPaletteShade } from './variants';

// Validation and logging functions
const shouldWarn = () => {
  // Always warn in development for better developer experience
  // Production builds can disable this by setting a global flag
  try {
    return (globalThis as any)?.__IDEALIST_DISABLE_WARNINGS !== true;
  } catch {
    return true; // Default to showing warnings
  }
};

/**
 * Validates if a color exists in the theme palette
 */
export function validateColor(theme: ThemeContext, color: string): boolean {
  const isSemanticColor = ['primary', 'secondary', 'disabled', 'inverse', 'muted'].includes(color);
  const isPaletteColor = theme.palettes && Object.keys(theme.palettes).includes(color);
  
  return isSemanticColor || isPaletteColor;
}

/**
 * Validates if an intent exists in the theme
 */
export function validateIntent(theme: ThemeContext, intent: string): boolean {
  return theme.intents ? Object.keys(theme.intents).includes(intent) : false;
}

/**
 * Logs a warning for invalid color usage
 */
export function warnInvalidColor(color: string, componentName?: string): void {
  if (shouldWarn()) {
    const component = componentName ? ` in ${componentName}` : '';
    console.warn(
      `🎨 Invalid color variant "${color}"${component}. ` +
      `Available colors are determined by your theme palette. ` +
      `Check your theme configuration or ensure the color is properly defined.`
    );
  }
}

/**
 * Logs a warning for invalid intent usage
 */
export function warnInvalidIntent(intent: string, componentName?: string): void {
  if (shouldWarn()) {
    const component = componentName ? ` in ${componentName}` : '';
    console.warn(
      `🎯 Invalid intent variant "${intent}"${component}. ` +
      `Available intents are determined by your theme configuration. ` +
      `Check your theme.intents or ensure the intent is properly defined.`
    );
  }
}

// Type definitions for theme structure
type ThemeContext = {
  palettes?: Record<string, Record<number, string>>;
  intents?: Record<string, {
    main: string;
    on: string;
    container: string;
    onContainer: string;
    light: string;
    dark: string;
    border: string;
  }>;
  colors?: {
    text?: {
      primary?: string;
      secondary?: string;
      disabled?: string;
      inverse?: string;
      muted?: string;
    };
  };
};

/**
 * Parses a color variant string and returns the color name and shade
 * Examples: 'blue' -> { color: 'blue', shade: 500 }
 *          'blue.300' -> { color: 'blue', shade: 300 }
 */
function parseColorVariant(colorVariant: string): { color: string; shade: number } {
  const parts = colorVariant.split('.');
  const color = parts[0];
  const shade = parts[1] ? parseInt(parts[1], 10) : 500; // Default to 500
  return { color, shade };
}

/**
 * Generate color variants for display components
 * Supports both simple colors ('blue') and shade-specific colors ('blue.300')
 */
export function generateColorVariants(
  theme: ThemeContext,
  defaultShade: ColorPaletteShade = 500,
  fallbacks: Record<string, string> = {
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    black: '#202124',
    gray: '#6b7280',
    white: '#f8f8f8',
  }
) {
  const variants: Record<string, { color: string }> = {};
  
  // Add semantic color variants
  if (theme.colors?.text) {
    if (theme.colors.text.primary) {
      variants.primary = { color: theme.colors.text.primary };
    }
    if (theme.colors.text.secondary) {
      variants.secondary = { color: theme.colors.text.secondary };
    }
    if (theme.colors.text.disabled) {
      variants.disabled = { color: theme.colors.text.disabled };
    }
    if (theme.colors.text.inverse) {
      variants.inverse = { color: theme.colors.text.inverse };
    }
    if (theme.colors.text.muted) {
      variants.muted = { color: theme.colors.text.muted };
    }
  }
  
  // Add palette color variants (both simple and shade-specific)
  if (theme.palettes) {
    Object.keys(theme.palettes).forEach((colorKey) => {
      const palette = theme.palettes![colorKey];
      if (palette) {
        // Add simple color variant (defaults to defaultShade)
        if (palette[defaultShade]) {
          variants[colorKey] = { color: palette[defaultShade] };
        } else if (fallbacks[colorKey]) {
          variants[colorKey] = { color: fallbacks[colorKey] };
        }
        
        // Add all shade-specific variants
        Object.keys(palette).forEach((shadeKey) => {
          const shade = parseInt(shadeKey, 10);
          if (!isNaN(shade)) {
            variants[`${colorKey}.${shade}`] = { color: palette[shade] };
          }
        });
      }
    });
  } else {
    // Fallback to default colors if no palettes
    Object.entries(fallbacks).forEach(([colorKey, color]) => {
      variants[colorKey] = { color };
    });
  }
  
  return variants;
}

/**
 * Generate intent variants for action components
 * Uses the intent system (primary.main, success.main, etc.)
 */
export function generateIntentVariants(
  theme: ThemeContext,
  fallbacks: Record<IntentVariant, string> = {
    primary: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444', 
    warning: '#f59e0b',
    neutral: '#6b7280',
    info: '#06b6d4',
  }
) {
  const variants: Record<string, { backgroundColor: string; color: string }> = {};
  
  if (theme.intents) {
    Object.entries(theme.intents).forEach(([intentKey, intent]) => {
      if (intent && intent.main && intent.on) {
        variants[intentKey] = {
          backgroundColor: intent.main,
          color: intent.on,
        };
      }
    });
  } else {
    // Fallback to default colors if no intents
    Object.entries(fallbacks).forEach(([intentKey, backgroundColor]) => {
      variants[intentKey] = {
        backgroundColor,
        color: '#ffffff',
      };
    });
  }
  
  return variants;
}

/**
 * Generate background variants for display components
 * Uses palette colors for backgrounds
 */
export function generateBackgroundVariants(
  theme: ThemeContext,
  shade: ColorPaletteShade = 500,
  fallbacks: Record<string, string> = {
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    black: '#202124',
    gray: '#6b7280',
    white: '#f8f8f8',
  }
) {
  const variants: Record<string, { backgroundColor: string }> = {};
  
  if (theme.palettes) {
    Object.keys(theme.palettes).forEach((colorKey) => {
      const palette = theme.palettes![colorKey];
      if (palette && palette[shade]) {
        variants[colorKey] = { backgroundColor: palette[shade] };
      } else if (fallbacks[colorKey as ColorVariant]) {
        variants[colorKey] = { backgroundColor: fallbacks[colorKey as ColorVariant] };
        // Warn if color exists in theme but shade is missing
        if (palette) {
          warnInvalidColor(`${colorKey}.${shade}`, 'background variant generation');
        }
      }
    });
  } else {
    // Fallback to default colors if no palettes
    Object.entries(fallbacks).forEach(([colorKey, backgroundColor]) => {
      variants[colorKey] = { backgroundColor };
    });
  }
  
  return variants;
}

/**
 * Generate border variants for display components
 * Uses palette colors for borders
 */
export function generateBorderVariants(
  theme: ThemeContext,
  shade: ColorPaletteShade = 500,
  fallbacks: Record<string, string> = {
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    black: '#202124',
    gray: '#6b7280',
    white: '#f8f8f8',
  }
) {
  const variants: Record<string, { borderColor: string; _web?: { border: string; color: string } }> = {};
  
  if (theme.palettes) {
    Object.keys(theme.palettes).forEach((colorKey) => {
      const palette = theme.palettes![colorKey];
      const color = palette?.[shade] || fallbacks[colorKey as ColorVariant];
      if (color) {
        variants[colorKey] = {
          borderColor: color,
          _web: {
            border: `1px solid ${color}`,
            color: color,
          },
        };
      }
    });
  } else {
    // Fallback to default colors if no palettes
    Object.entries(fallbacks).forEach(([colorKey, color]) => {
      variants[colorKey] = {
        borderColor: color,
        _web: {
          border: `1px solid ${color}`,
          color: color,
        },
      };
    });
  }
  
  return variants;
}

/**
 * Generate compound variants for combinations like variant + color
 */
export function generateCompoundVariants<T extends Record<string, any>>(
  combinations: Array<{
    conditions: Record<string, string>;
    styles: T;
  }>
) {
  return combinations.map(({ conditions, styles }) => ({
    ...conditions,
    styles,
  }));
}

/**
 * Resolves a color variant to its actual color value
 * Supports both simple colors ('blue') and shade-specific colors ('blue.300')
 */
function resolveColorVariant(colorVariant: string, theme: ThemeContext): string | null {
  const fallbacks: Record<string, string> = {
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    black: '#202124',
    gray: '#6b7280',
    white: '#f8f8f8',
  };

  // Handle semantic colors
  if (['primary', 'secondary', 'disabled', 'inverse', 'muted'].includes(colorVariant)) {
    return theme.colors?.text?.[colorVariant as keyof typeof theme.colors.text] || null;
  }

  // Parse color variant (e.g., 'blue.300' or 'blue')
  const { color, shade } = parseColorVariant(colorVariant);
  
  // Try to get from theme palette
  if (theme.palettes?.[color]?.[shade]) {
    return theme.palettes[color][shade];
  }
  
  // Fallback for simple colors
  if (shade === 500 && fallbacks[color]) {
    return fallbacks[color];
  }
  
  return null;
}

/**
 * Generate compound variants for badge-like components
 * Combines variant type (filled, outlined, dot) with color (including shade-specific and intents)
 */
export function generateBadgeCompoundVariants(theme: ThemeContext) {
  const variants: Array<{
    variant: string;
    color: string;
    styles: Record<string, any>;
  }> = [];

  // Get all color variants from the generated color variants
  const colorVariants = generateColorVariants(theme);

  Object.keys(colorVariants).forEach((colorKey) => {
    const resolvedColor = resolveColorVariant(colorKey, theme);

    if (resolvedColor) {
      // Filled variant
      variants.push({
        variant: 'filled',
        color: colorKey,
        styles: {
          backgroundColor: resolvedColor,
        },
      });

      // Dot variant
      variants.push({
        variant: 'dot',
        color: colorKey,
        styles: {
          backgroundColor: resolvedColor,
        },
      });

      // Outlined variant
      variants.push({
        variant: 'outlined',
        color: colorKey,
        styles: {
          borderColor: resolvedColor,
          _web: {
            border: `1px solid ${resolvedColor}`,
            color: resolvedColor,
          },
        },
      });
    }
  });

  // Also add intent colors so Badge can use color="error", color="success", etc.
  const intentKeys = theme.intents ? Object.keys(theme.intents) : [
    'primary', 'success', 'error', 'warning', 'neutral', 'info'
  ];

  const fallbacks: Record<string, string> = {
    primary: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    neutral: '#6b7280',
    info: '#06b6d4',
  };

  intentKeys.forEach((intentKey) => {
    const intent = theme.intents?.[intentKey];
    const mainColor = intent?.main || fallbacks[intentKey];
    if (mainColor) {
      // Filled variant
      variants.push({
        variant: 'filled',
        color: intentKey,
        styles: {
          backgroundColor: mainColor,
        },
      });

      // Dot variant
      variants.push({
        variant: 'dot',
        color: intentKey,
        styles: {
          backgroundColor: mainColor,
        },
      });

      // Outlined variant
      variants.push({
        variant: 'outlined',
        color: intentKey,
        styles: {
          borderColor: mainColor,
          _web: {
            border: `1px solid ${mainColor}`,
            color: mainColor,
          },
        },
      });
    }
  });

  return variants;
}

/**
 * Generate compound variants for badge-like components using intents
 * Combines variant type (filled, outlined, dot) with intent
 */
export function generateBadgeIntentCompoundVariants(theme: ThemeContext) {
  const variants: Array<{
    variant: string;
    intent: string;
    styles: Record<string, any>;
  }> = [];
  
  const intentKeys = theme.intents ? Object.keys(theme.intents) : [
    'primary', 'success', 'error', 'warning', 'neutral', 'info'
  ];
  
  const fallbacks: Record<string, string> = {
    primary: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    neutral: '#6b7280',
    info: '#06b6d4',
  };
  
  intentKeys.forEach((intentKey) => {
    const intent = theme.intents?.[intentKey];
    const mainColor = intent?.main || fallbacks[intentKey];
    if (mainColor) {
      // Filled variant
      variants.push({
        variant: 'filled',
        intent: intentKey,
        styles: {
          backgroundColor: mainColor,
        },
      });
      
      // Dot variant
      variants.push({
        variant: 'dot',
        intent: intentKey,
        styles: {
          backgroundColor: mainColor,
        },
      });
      
      // Outlined variant
      variants.push({
        variant: 'outlined',
        intent: intentKey,
        styles: {
          borderColor: mainColor,
          _web: {
            border: `1px solid ${mainColor}`,
            color: mainColor,
          },
        },
      });
    }
  });
  
  return variants;
}

/**
 * Generate compound variants for button-like components
 * Combines variant type (contained, outlined, text) with intent
 */
export function generateButtonCompoundVariants(theme: ThemeContext) {
  const variants: Array<{
    variant: string;
    intent: string;
    styles: Record<string, any>;
  }> = [];
  
  const intentKeys = theme.intents ? Object.keys(theme.intents) : [
    'primary', 'success', 'error', 'warning', 'neutral', 'info'
  ];
  
  const fallbacks: Record<string, string> = {
    primary: '#3b82f6',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    neutral: '#6b7280',
    info: '#06b6d4',
  };
  
  intentKeys.forEach((intentKey) => {
    const intent = theme.intents?.[intentKey];
    const mainColor = intent?.main || fallbacks[intentKey];
    if (mainColor) {
      // Outlined variant
      variants.push({
        variant: 'outlined',
        intent: intentKey,
        styles: {
          backgroundColor: 'transparent',
          border: `1px solid ${mainColor}`,
          color: mainColor,
        },
      });
      
      // Text variant
      variants.push({
        variant: 'text',
        intent: intentKey,
        styles: {
          backgroundColor: 'transparent',
          color: mainColor,
        },
      });
    }
  });
  
  return variants;
} 

/**
 * Component-level validation functions
 * These should be called by components to validate their props
 */

/**
 * Validates a color prop used by a component
 */
export function validateColorProp(
  theme: ThemeContext, 
  color: string | undefined, 
  componentName: string
): boolean {
  if (!color) return true; // undefined/null is valid (uses default)
  
  const isValid = validateColor(theme, color);
  if (!isValid) {
    warnInvalidColor(color, componentName);
  }
  return isValid;
}

/**
 * Validates an intent prop used by a component
 */
export function validateIntentProp(
  theme: ThemeContext, 
  intent: string | undefined, 
  componentName: string
): boolean {
  if (!intent) return true; // undefined/null is valid (uses default)
  
  const isValid = validateIntent(theme, intent);
  if (!isValid) {
    warnInvalidIntent(intent, componentName);
  }
  return isValid;
}

/**
 * Gets available colors from theme (for error messages)
 */
export function getAvailableColors(theme: ThemeContext): string[] {
  const semanticColors = ['primary', 'secondary', 'disabled', 'inverse', 'muted'];
  const paletteColors = theme.palettes ? Object.keys(theme.palettes) : [];
  return [...semanticColors, ...paletteColors];
}

/**
 * Gets available intents from theme (for error messages)
 */
export function getAvailableIntents(theme: ThemeContext): string[] {
  return theme.intents ? Object.keys(theme.intents) : [];
} 