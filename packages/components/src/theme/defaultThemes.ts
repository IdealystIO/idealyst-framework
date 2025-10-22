import { 
  createTheme, 
  generateColorPalette,
  createLightResolvedIntents, 
  createDarkResolvedIntents, 
  createLightResolvedColors, 
  createDarkResolvedColors,
  type ThemeConfig
} from './themeBuilder';

// Common theme properties shared across all themes
export const commonThemeProperties = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
    xxxxl: 64,
  },
  
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
  },
  
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      xxxxl: 40,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease',
    button: 'all 0.2s ease',
    fade: 'opacity 0.2s ease',
    slide: 'transform 0.3s ease',
  },
  
  // Dynamic helper functions
  gap: (value: number) => value * 8,
  scale: (value: number) => value * 1.2,
  alpha: (color: string, alpha: number) => `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
};

// =============================================================================
// DEFAULT PALETTES
// =============================================================================

/**
 * Helper function to create standard color palettes
 */
export function createStandardPalettes(): ThemeConfig['palettes'] {
  return {
    red: generateColorPalette('#ef4444'),
    orange: generateColorPalette('#f97316'),
    yellow: generateColorPalette('#eab308'),
    green: generateColorPalette('#22c55e'),
    blue: generateColorPalette('#3b82f6'),
    purple: generateColorPalette('#a855f7'),
    black: generateColorPalette('#000000'),
    gray: generateColorPalette('#6b7280'),
    white: generateColorPalette('#ffffff'),
  };
}

/**
 * Helper function to create dark theme palettes with proper dark mode colors
 */
export function createDarkPalettes(): ThemeConfig['palettes'] {
  const basePalettes = createStandardPalettes();
  
  return {
    ...basePalettes,
    // Adjusted gray palette for dark theme
    gray: {
      50: '#18181b',    // Very dark background
      100: '#27272a',   // Dark surface
      200: '#3f3f46',   // Medium dark
      300: '#52525b',   // Medium
      400: '#71717a',   // Medium light
      500: '#a1a1aa',   // Light gray
      600: '#d4d4d8',   // Lighter gray
      700: '#e4e4e7',   // Very light gray
      800: '#f4f4f5',   // Nearly white
      900: '#fafafa',   // White
    },
    // Adjusted black palette for dark theme
    black: {
      50: '#000000',    // Pure black
      100: '#0a0a0a',   // Very dark
      200: '#141414',   // Dark
      300: '#1f1f1f',   // Medium dark
      400: '#2a2a2a',   // Medium
      500: '#3c3c3c',   // Medium light
      600: '#525252',   // Light
      700: '#737373',   // Lighter
      800: '#a3a3a3',   // Very light
      900: '#d4d4d4',   // Nearly white
    },
    // Adjusted white palette for dark theme
    white: {
      50: '#0c0c0c',    // Very dark (inverted)
      100: '#171717',   // Dark
      200: '#262626',   // Medium dark
      300: '#404040',   // Medium
      400: '#525252',   // Medium light
      500: '#737373',   // Light
      600: '#a3a3a3',   // Lighter
      700: '#d4d4d4',   // Very light
      800: '#f5f5f5',   // Nearly white
      900: '#ffffff',   // Pure white
    },
  };
}

// Convenience functions for complete theme creation
export function createLightIntentMappings(): ThemeConfig['intents'] {
  const palettes = createStandardPalettes();
  return createLightResolvedIntents(palettes);
}

export function createDarkIntentMappings(): ThemeConfig['intents'] {
  const palettes = createDarkPalettes();
  return createDarkResolvedIntents(palettes);
}

export function createLightColorMappings(): ThemeConfig['colors'] {
  const palettes = createStandardPalettes();
  return createLightResolvedColors(palettes);
}

export function createDarkColorMappings(): ThemeConfig['colors'] {
  const palettes = createDarkPalettes();
  return createDarkResolvedColors(palettes);
}

// Create default light theme using the explicit theme builder
export function createDefaultLightTheme() {
  return createTheme({
    
    name: 'DefaultLight',
    mode: 'light',
    palettes: createStandardPalettes(),
    intents: createLightIntentMappings(),
    colors: createLightColorMappings(),
    
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      xxl: 20,
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 40,
      xxxl: 48,
    },
    
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      },
    },
    
    transitions: {
      fast: '0.15s ease',
      base: '0.2s ease',
      slow: '0.3s ease',
      button: 'all 0.2s ease',
      fade: 'opacity 0.2s ease',
      slide: 'transform 0.3s ease',
    },
  });
}

// Create default dark theme using the explicit theme builder
export function createDefaultDarkTheme() {
  return createTheme({
    name: 'DefaultDark',
    mode: 'dark',
    palettes: createDarkPalettes(),
    intents: createDarkIntentMappings(),
    colors: createDarkColorMappings(),
    
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      xxl: 20,
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 40,
      xxxl: 48,
    },
    
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
      },
    },
    
    transitions: {
      fast: '0.15s ease',
      base: '0.2s ease',
      slow: '0.3s ease',
      button: 'all 0.2s ease',
      fade: 'opacity 0.2s ease',
      slide: 'transform 0.3s ease',
    },
  });
}

// Export the created themes
export const defaultLightTheme = createDefaultLightTheme();
export const defaultDarkTheme = createDefaultDarkTheme();