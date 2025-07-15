import { 
  createTheme, 
  type ThemeConfig,
  createStandardPalettes, 
  createDarkPalettes, 
  createLightIntentMappings, 
  createDarkIntentMappings, 
  createLightColorMappings, 
  createDarkColorMappings
} from '@idealyst/theme';

// Extended color palettes - includes all base colors plus additional ones
export const extendedColorPalettes = {
  // Include all base colors
  ...createStandardPalettes(),
  
  // Add extended colors
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  
  violet: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
} as const;

// Extended color palettes for dark mode
export const extendedDarkColorPalettes = {
  // Include all base dark colors
  ...createDarkPalettes(),
  
  // Add the same extended colors (they work well in both light and dark)
  orange: extendedColorPalettes.orange,
  teal: extendedColorPalettes.teal,
  indigo: extendedColorPalettes.indigo,
  violet: extendedColorPalettes.violet,
  emerald: extendedColorPalettes.emerald,
} as const;

// Helper function to create extended light intents
function createExtendedLightIntents(palettes: typeof extendedColorPalettes) {
  return {
    // Include all base intents
    ...createLightIntentMappings(),
    
    // Add extended intents with resolved colors
    accent: {
      main: palettes.orange[500],
      on: '#ffffff',
      container: palettes.orange[100],
      onContainer: palettes.orange[800],
      light: palettes.orange[200],
      dark: palettes.orange[700],
      border: palettes.orange[300],
    },
    
    feature: {
      main: palettes.teal[500],
      on: '#ffffff',
      container: palettes.teal[100],
      onContainer: palettes.teal[800],
      light: palettes.teal[200],
      dark: palettes.teal[700],
      border: palettes.teal[300],
    },
    
    highlight: {
      main: palettes.violet[500],
      on: '#ffffff',
      container: palettes.violet[100],
      onContainer: palettes.violet[800],
      light: palettes.violet[200],
      dark: palettes.violet[700],
      border: palettes.violet[300],
    },
  } as any; // Type assertion for extended intents
}

// Helper function to create extended dark intents
function createExtendedDarkIntents(palettes: typeof extendedDarkColorPalettes) {
  return {
    // Include all base intents
    ...createDarkIntentMappings(),
    
    // Add extended intents with resolved colors
    accent: {
      main: palettes.orange[400],
      on: palettes.gray[50],
      container: palettes.orange[200],
      onContainer: palettes.orange[800],
      light: palettes.orange[300],
      dark: palettes.orange[600],
      border: palettes.orange[400],
    },
    
    feature: {
      main: palettes.teal[400],
      on: palettes.gray[50],
      container: palettes.teal[200],
      onContainer: palettes.teal[800],
      light: palettes.teal[300],
      dark: palettes.teal[600],
      border: palettes.teal[400],
    },
    
    highlight: {
      main: palettes.violet[400],
      on: palettes.gray[50],
      container: palettes.violet[200],
      onContainer: palettes.violet[800],
      light: palettes.violet[300],
      dark: palettes.violet[600],
      border: palettes.violet[400],
    },
  } as any; // Type assertion for extended intents
}

// Create extended themes using the new theme builder
export const extendedThemes = {
  light: createTheme({
    name: 'ExtendedLight',
    mode: 'light',
    palettes: extendedColorPalettes,
    intents: createExtendedLightIntents(extendedColorPalettes),
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
  }),
  
  dark: createTheme({
    name: 'ExtendedDark',
    mode: 'dark',
    palettes: extendedDarkColorPalettes,
    intents: createExtendedDarkIntents(extendedDarkColorPalettes),
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
  }),
} as const;

// Extended type definitions for TypeScript
export type ExtendedColorVariant = 
  | 'blue'
  | 'green' 
  | 'red'
  | 'amber'
  | 'gray'
  | 'purple'
  | 'pink'
  | 'cyan'
  | 'orange'
  | 'teal'
  | 'indigo'
  | 'violet'
  | 'emerald';

export type ExtendedIntentVariant = 
  | 'primary'
  | 'success' 
  | 'error'
  | 'warning'
  | 'neutral'
  | 'info'
  | 'accent'
  | 'feature'
  | 'highlight';