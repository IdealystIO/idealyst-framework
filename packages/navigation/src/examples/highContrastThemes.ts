import { 
  createTheme, 
} from '@idealyst/theme';

// High contrast color palettes - designed for maximum accessibility
export const highContrastLightPalettes = {
  // Pure high contrast colors
  red: {
    50: '#ffffff',
    100: '#ffe5e5',
    200: '#ffcccc',
    300: '#ff9999',
    400: '#ff6666',
    500: '#ff0000',    // Pure red
    600: '#cc0000',
    700: '#990000',
    800: '#660000',
    900: '#330000',
  },
  
  orange: {
    50: '#ffffff',
    100: '#fff3e0',
    200: '#ffe0b3',
    300: '#ffcc80',
    400: '#ffb74d',
    500: '#ff8f00',    // High contrast orange
    600: '#cc7200',
    700: '#995500',
    800: '#663900',
    900: '#331c00',
  },
  
  yellow: {
    50: '#ffffff',
    100: '#fffde7',
    200: '#fff9c4',
    300: '#fff59d',
    400: '#fff176',
    500: '#ffeb3b',    // High contrast yellow
    600: '#ccbc2e',
    700: '#998d22',
    800: '#665e17',
    900: '#332f0b',
  },
  
  green: {
    50: '#ffffff',
    100: '#e8f5e8',
    200: '#c8e6c8',
    300: '#a5d6a5',
    400: '#81c784',
    500: '#4caf50',    // High contrast green
    600: '#388e3c',
    700: '#2e7d32',
    800: '#1b5e20',
    900: '#0d2f10',
  },
  
  blue: {
    50: '#ffffff',
    100: '#e3f2fd',
    200: '#bbdefb',
    300: '#90caf9',
    400: '#64b5f6',
    500: '#2196f3',    // High contrast blue
    600: '#1976d2',
    700: '#1565c0',
    800: '#0d47a1',
    900: '#0a2472',
  },
  
  purple: {
    50: '#ffffff',
    100: '#f3e5f5',
    200: '#e1bee7',
    300: '#ce93d8',
    400: '#ba68c8',
    500: '#9c27b0',    // High contrast purple
    600: '#7b1fa2',
    700: '#6a1b9a',
    800: '#4a148c',
    900: '#3d1178',
  },
  
  black: {
    50: '#ffffff',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#000000',    // Pure black
  },
  
  gray: {
    50: '#ffffff',    // Pure white
    100: '#f8f8f8',
    200: '#e8e8e8',
    300: '#d0d0d0',
    400: '#b0b0b0',
    500: '#808080',
    600: '#606060',
    700: '#404040',
    800: '#202020',
    900: '#000000',    // Pure black
  },
  
  white: {
    50: '#ffffff',    // Pure white
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#ffffff',
    700: '#ffffff',
    800: '#ffffff',
    900: '#ffffff',
  },
} as const;

// High contrast dark palettes
export const highContrastDarkPalettes = {
  // Pure high contrast colors for dark mode
  red: {
    50: '#000000',
    100: '#330000',
    200: '#660000',
    300: '#990000',
    400: '#cc0000',
    500: '#ff0000',    // Pure red
    600: '#ff3333',
    700: '#ff6666',
    800: '#ff9999',
    900: '#ffffff',
  },
  
  orange: {
    50: '#000000',
    100: '#331c00',
    200: '#663900',
    300: '#995500',
    400: '#cc7200',
    500: '#ff8f00',    // High contrast orange
    600: '#ffab40',
    700: '#ffcc80',
    800: '#ffe0b3',
    900: '#ffffff',
  },
  
  yellow: {
    50: '#000000',
    100: '#332f0b',
    200: '#665e17',
    300: '#998d22',
    400: '#ccbc2e',
    500: '#ffeb3b',    // High contrast yellow
    600: '#fff176',
    700: '#fff59d',
    800: '#fff9c4',
    900: '#ffffff',
  },
  
  green: {
    50: '#000000',
    100: '#0d2f10',
    200: '#1b5e20',
    300: '#2e7d32',
    400: '#388e3c',
    500: '#4caf50',    // High contrast green
    600: '#81c784',
    700: '#a5d6a5',
    800: '#c8e6c8',
    900: '#ffffff',
  },
  
  blue: {
    50: '#000000',
    100: '#0a2472',
    200: '#0d47a1',
    300: '#1565c0',
    400: '#1976d2',
    500: '#2196f3',    // High contrast blue
    600: '#64b5f6',
    700: '#90caf9',
    800: '#bbdefb',
    900: '#ffffff',
  },
  
  purple: {
    50: '#000000',
    100: '#3d1178',
    200: '#4a148c',
    300: '#6a1b9a',
    400: '#7b1fa2',
    500: '#9c27b0',    // High contrast purple
    600: '#ba68c8',
    700: '#ce93d8',
    800: '#e1bee7',
    900: '#ffffff',
  },
  
  black: {
    50: '#000000',    // Pure black
    100: '#000000',
    200: '#000000',
    300: '#000000',
    400: '#000000',
    500: '#000000',
    600: '#000000',
    700: '#000000',
    800: '#000000',
    900: '#000000',
  },
  
  gray: {
    50: '#000000',    // Pure black
    100: '#111111',
    200: '#222222',
    300: '#333333',
    400: '#555555',
    500: '#777777',
    600: '#aaaaaa',
    700: '#cccccc',
    800: '#eeeeee',
    900: '#ffffff',    // Pure white
  },
  
  white: {
    50: '#000000',
    100: '#202020',
    200: '#404040',
    300: '#606060',
    400: '#808080',
    500: '#a0a0a0',
    600: '#c0c0c0',
    700: '#e0e0e0',
    800: '#f0f0f0',
    900: '#ffffff',    // Pure white
  },
} as const;

// High contrast light intents
function createHighContrastLightIntents(palettes: typeof highContrastLightPalettes) {
  return {
    primary: {
      main: palettes.blue[500],     // Pure blue
      on: '#ffffff',                // Pure white text
      container: palettes.blue[50], // White container
      onContainer: palettes.blue[900], // Very dark blue text
      light: palettes.blue[200],
      dark: palettes.blue[800],
      border: palettes.blue[500],   // Strong border
    },
    success: {
      main: palettes.green[500],    // Pure green
      on: '#ffffff',                // Pure white text
      container: palettes.green[50], // White container
      onContainer: palettes.green[900], // Very dark green text
      light: palettes.green[200],
      dark: palettes.green[800],
      border: palettes.green[500],  // Strong border
    },
    error: {
      main: palettes.red[500],      // Pure red
      on: '#ffffff',                // Pure white text
      container: palettes.red[50],  // White container
      onContainer: palettes.red[900], // Very dark red text
      light: palettes.red[200],
      dark: palettes.red[800],
      border: palettes.red[500],    // Strong border
    },
    warning: {
      main: palettes.orange[500],   // High contrast orange
      on: '#000000',                // Black text for better contrast
      container: palettes.orange[50], // White container
      onContainer: palettes.orange[900], // Very dark orange text
      light: palettes.orange[200],
      dark: palettes.orange[800],
      border: palettes.orange[500], // Strong border
    },
    neutral: {
      main: palettes.gray[500],     // Medium gray
      on: '#ffffff',                // Pure white text
      container: palettes.gray[50], // White container
      onContainer: palettes.gray[900], // Pure black text
      light: palettes.gray[200],
      dark: palettes.gray[800],
      border: palettes.gray[500],   // Strong border
    },
    info: {
      main: palettes.blue[500],     // Pure blue
      on: '#ffffff',                // Pure white text
      container: palettes.blue[50], // White container
      onContainer: palettes.blue[900], // Very dark blue text
      light: palettes.blue[200],
      dark: palettes.blue[800],
      border: palettes.blue[500],   // Strong border
    },
  } as any;
}

// High contrast dark intents
function createHighContrastDarkIntents(palettes: typeof highContrastDarkPalettes) {
  return {
    primary: {
      main: palettes.blue[500],     // Pure blue
      on: '#000000',                // Pure black text
      container: palettes.blue[50], // Black container
      onContainer: palettes.blue[900], // Pure white text
      light: palettes.blue[700],
      dark: palettes.blue[300],
      border: palettes.blue[500],   // Strong border
    },
    success: {
      main: palettes.green[500],    // Pure green
      on: '#000000',                // Pure black text
      container: palettes.green[50], // Black container
      onContainer: palettes.green[900], // Pure white text
      light: palettes.green[700],
      dark: palettes.green[300],
      border: palettes.green[500],  // Strong border
    },
    error: {
      main: palettes.red[500],      // Pure red
      on: '#000000',                // Pure black text
      container: palettes.red[50],  // Black container
      onContainer: palettes.red[900], // Pure white text
      light: palettes.red[700],
      dark: palettes.red[300],
      border: palettes.red[500],    // Strong border
    },
    warning: {
      main: palettes.orange[500],   // High contrast orange
      on: '#000000',                // Pure black text
      container: palettes.orange[50], // Black container
      onContainer: palettes.orange[900], // Pure white text
      light: palettes.orange[700],
      dark: palettes.orange[300],
      border: palettes.orange[500], // Strong border
    },
    neutral: {
      main: palettes.gray[500],     // Medium gray
      on: '#000000',                // Pure black text
      container: palettes.gray[50], // Black container
      onContainer: palettes.gray[900], // Pure white text
      light: palettes.gray[700],
      dark: palettes.gray[300],
      border: palettes.gray[500],   // Strong border
    },
    info: {
      main: palettes.blue[500],     // Pure blue
      on: '#000000',                // Pure black text
      container: palettes.blue[50], // Black container
      onContainer: palettes.blue[900], // Pure white text
      light: palettes.blue[700],
      dark: palettes.blue[300],
      border: palettes.blue[500],   // Strong border
    },
  } as any;
}

// High contrast light colors
function createHighContrastLightColors(palettes: typeof highContrastLightPalettes) {
  return {
    text: {
      primary: palettes.gray[900],    // Pure black text
      secondary: palettes.gray[800],  // Very dark gray
      disabled: palettes.gray[600],   // Medium gray
      inverse: palettes.gray[50],     // Pure white
      muted: palettes.gray[700],      // Dark gray
      placeholder: palettes.gray[600], // Medium gray
    },
    surface: {
      primary: palettes.gray[50],     // Pure white surface
      secondary: palettes.gray[100],  // Light gray surface
      tertiary: palettes.gray[200],   // Medium light surface
      elevated: palettes.gray[50],    // Pure white elevated
      overlay: 'rgba(0, 0, 0, 0.8)',  // Strong overlay
      inverse: palettes.gray[900],    // Pure black inverse
    },
    border: {
      primary: palettes.gray[900],    // Pure black border
      secondary: palettes.gray[800],  // Very dark border
      strong: palettes.gray[900],     // Pure black strong border
      focus: palettes.blue[500],      // Pure blue focus
      disabled: palettes.gray[600],   // Medium gray disabled
    },
    interactive: {
      hover: palettes.gray[200],      // Light gray hover
      pressed: palettes.gray[300],    // Medium light pressed
      focus: palettes.blue[500],      // Pure blue focus
      disabled: palettes.gray[200],   // Light gray disabled
    },
  };
}

// High contrast dark colors
function createHighContrastDarkColors(palettes: typeof highContrastDarkPalettes) {
  return {
    text: {
      primary: palettes.gray[900],    // Pure white text
      secondary: palettes.gray[800],  // Very light gray
      disabled: palettes.gray[600],   // Medium gray
      inverse: palettes.gray[50],     // Pure black
      muted: palettes.gray[700],      // Light gray
      placeholder: palettes.gray[600], // Medium gray
    },
    surface: {
      primary: palettes.gray[50],     // Pure black surface
      secondary: palettes.gray[100],  // Very dark surface
      tertiary: palettes.gray[200],   // Dark surface
      elevated: palettes.gray[100],   // Very dark elevated
      overlay: 'rgba(0, 0, 0, 0.9)',  // Very strong overlay
      inverse: palettes.gray[900],    // Pure white inverse
    },
    border: {
      primary: palettes.gray[900],    // Pure white border
      secondary: palettes.gray[800],  // Very light border
      strong: palettes.gray[900],     // Pure white strong border
      focus: palettes.blue[500],      // Pure blue focus
      disabled: palettes.gray[600],   // Medium gray disabled
    },
    interactive: {
      hover: palettes.gray[200],      // Dark hover
      pressed: palettes.gray[300],    // Medium dark pressed
      focus: palettes.blue[500],      // Pure blue focus
      disabled: palettes.gray[200],   // Dark disabled
    },
  };
}

// Create high contrast themes
export const highContrastThemes = {
  lightHighContrast: createTheme({
    name: 'LightHighContrast',
    mode: 'light',
    palettes: highContrastLightPalettes,
    intents: createHighContrastLightIntents(highContrastLightPalettes),
    colors: createHighContrastLightColors(highContrastLightPalettes),
    
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: {
        light: '400',     // No ultra-light weights for better readability
        regular: '500',   // Slightly heavier for better contrast
        medium: '600',    // Medium weight
        semibold: '700',  // Bold
        bold: '800',      // Extra bold
        extrabold: '900', // Black
      },
    },
    
    borderRadius: {
      sm: 2,    // Sharper corners for high contrast
      md: 4,
      lg: 6,
      xl: 8,
      xxl: 12,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,    // Stronger shadows
        shadowRadius: 4,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,     // Stronger shadows
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,    // Stronger shadows
        shadowRadius: 16,
        elevation: 8,
      },
    },
    
    transitions: {
      fast: '0.1s ease',    // Faster transitions
      base: '0.15s ease',
      slow: '0.2s ease',
      button: 'all 0.15s ease',
      fade: 'opacity 0.15s ease',
      slide: 'transform 0.2s ease',
    },
  }),
  
  darkHighContrast: createTheme({
    name: 'DarkHighContrast',
    mode: 'dark',
    palettes: highContrastDarkPalettes,
    intents: createHighContrastDarkIntents(highContrastDarkPalettes),
    colors: createHighContrastDarkColors(highContrastDarkPalettes),
    
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: {
        light: '400',     // No ultra-light weights for better readability
        regular: '500',   // Slightly heavier for better contrast
        medium: '600',    // Medium weight
        semibold: '700',  // Bold
        bold: '800',      // Extra bold
        extrabold: '900', // Black
      },
    },
    
    borderRadius: {
      sm: 2,    // Sharper corners for high contrast
      md: 4,
      lg: 6,
      xl: 8,
      xxl: 12,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,     // Much stronger shadows for dark mode
        shadowRadius: 4,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,     // Much stronger shadows for dark mode
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.7,     // Much stronger shadows for dark mode
        shadowRadius: 16,
        elevation: 8,
      },
    },
    
    transitions: {
      fast: '0.1s ease',    // Faster transitions
      base: '0.15s ease',
      slow: '0.2s ease',
      button: 'all 0.15s ease',
      fade: 'opacity 0.15s ease',
      slide: 'transform 0.2s ease',
    },
  }),
} as const;

// Extended type definitions for TypeScript
export type HighContrastThemeVariant = 'lightHighContrast' | 'darkHighContrast'; 