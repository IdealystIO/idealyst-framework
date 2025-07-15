import { 
  colorPalettes, 
  intentMappings, 
  colorMappings, 
  darkThemeOverrides,
  type ColorPalette,
  type ColorShade,
  type IntentName,
  type ColorName
} from './colors';

// Type for color references
export type ColorReference = 
  | string // Direct hex color like '#ffffff'
  | `${ColorPalette}.${ColorShade}` // Palette reference like 'blue.500'
  | IntentName // Intent reference like 'primary'
  | `intent.${IntentName}.${keyof typeof intentMappings.primary}` // Intent property like 'intent.primary.main'
  | `color.${ColorName}` // Color mapping like 'color.text.primary'
  | keyof typeof colorMappings; // Direct color mapping like 'primary'

// Theme context for color resolution
export interface ThemeContext {
  isDark: boolean;
  colorPalettes: typeof colorPalettes;
  intentMappings: any; // Use any to allow theme overrides
  colorMappings: any;  // Use any to allow theme overrides
}

// Create theme context
export function createThemeContext(isDark: boolean = false): ThemeContext {
  const baseIntentMappings = isDark 
    ? { ...intentMappings, ...darkThemeOverrides.intentMappings }
    : intentMappings;
    
  const baseColorMappings = isDark
    ? { ...colorMappings, ...darkThemeOverrides.colorMappings }
    : colorMappings;

  return {
    isDark,
    colorPalettes,
    intentMappings: baseIntentMappings,
    colorMappings: baseColorMappings,
  };
}

// Resolve a color reference to a hex color
export function resolveColor(
  colorRef: ColorReference,
  context: ThemeContext
): string {
  // If it's already a hex color, return as is
  if (typeof colorRef === 'string' && colorRef.startsWith('#')) {
    return colorRef;
  }

  // Handle palette references like 'blue.500'
  if (typeof colorRef === 'string' && colorRef.includes('.')) {
    const [paletteOrCategory, property] = colorRef.split('.');
    
    // Handle palette references
    if (paletteOrCategory in context.colorPalettes) {
      const palette = context.colorPalettes[paletteOrCategory as ColorPalette];
      if (property in palette) {
        return palette[property as unknown as ColorShade];
      }
    }
    
    // Handle color mappings like 'text.primary'
    if (paletteOrCategory in context.colorMappings) {
      const colorCategory = context.colorMappings[paletteOrCategory as keyof typeof context.colorMappings];
      if (typeof colorCategory === 'object' && property in colorCategory) {
        const nestedRef = colorCategory[property as keyof typeof colorCategory];
        return resolveColor(nestedRef as ColorReference, context);
      }
    }
  }

  // Handle intent references like 'intent.primary.main'
  if (typeof colorRef === 'string' && colorRef.startsWith('intent.')) {
    const parts = colorRef.split('.');
    if (parts.length === 3) {
      const [, intentName, property] = parts;
      return resolveIntentColor(
        intentName as IntentName, 
        property as keyof typeof intentMappings.primary, 
        context
      );
    }
  }

  // Handle color mappings like 'color.text.primary'
  if (typeof colorRef === 'string' && colorRef.startsWith('color.')) {
    const path = colorRef.substring(6); // Remove 'color.' prefix
    const [category, property] = path.split('.');
    
    if (category in context.colorMappings) {
      const colorCategory = context.colorMappings[category as keyof typeof context.colorMappings];
      if (typeof colorCategory === 'object' && property in colorCategory) {
        const nestedRef = colorCategory[property as keyof typeof colorCategory];
        return resolveColor(nestedRef as ColorReference, context);
      }
    }
  }

  // Handle direct intent references like 'primary'
  if (typeof colorRef === 'string' && colorRef in context.intentMappings) {
    return resolveIntentColor(colorRef as IntentName, 'main', context);
  }

  // Handle direct color mappings like 'primary' (when it's in colorMappings)
  if (typeof colorRef === 'string' && colorRef in context.colorMappings) {
    const mapping = context.colorMappings[colorRef as keyof typeof context.colorMappings];
    return resolveColor(mapping as ColorReference, context);
  }

  // If we can't resolve it, return it as is (might be a CSS variable or other valid color)
  console.warn(`Could not resolve color reference: ${colorRef}`);
  return colorRef as string;
}

// Resolve a specific intent color property
export function resolveIntentColor(
  intentName: IntentName,
  property: keyof typeof intentMappings.primary,
  context: ThemeContext
): string {
  const intent = context.intentMappings[intentName];
  if (!intent) {
    console.warn(`Intent ${intentName} not found`);
    return '#000000'; // Fallback color
  }

  const value = intent[property];
  
  // Handle palette references
  if (typeof value === 'number') {
    const palette = context.colorPalettes[intent.palette];
    const shade = value as ColorShade;
    if (shade in palette) {
      return palette[shade];
    }
  }
  
  // Handle string references (like 'gray.900')
  if (typeof value === 'string') {
    return resolveColor(value, context);
  }

  // If we can't resolve it, return it as is
  return value as string;
}

// Helper function to get all colors for an intent
export function getIntentColors(intentName: IntentName, context: ThemeContext) {
  const intent = context.intentMappings[intentName];
  if (!intent) {
    return {};
  }

  const colors: Record<string, string> = {};
  
  // Resolve all properties of the intent
  for (const [key, value] of Object.entries(intent)) {
    if (key === 'palette') continue; // Skip the palette reference
    
    colors[key] = resolveIntentColor(
      intentName, 
      key as keyof typeof intentMappings.primary, 
      context
    );
  }

  return colors;
}

// Helper function to get all colors for a palette
export function getPaletteColors(paletteName: ColorPalette, context: ThemeContext) {
  const palette = context.colorPalettes[paletteName];
  if (!palette) {
    return {};
  }

  return { ...palette };
}

// Helper function to validate color references
export function isValidColorReference(colorRef: string, context: ThemeContext): boolean {
  try {
    const resolved = resolveColor(colorRef as ColorReference, context);
    return resolved !== colorRef || colorRef.startsWith('#');
  } catch {
    return false;
  }
}

// Helper function to get color with opacity
export function getColorWithOpacity(colorRef: ColorReference, opacity: number, context: ThemeContext): string {
  const resolvedColor = resolveColor(colorRef, context);
  
  // Convert hex to rgba
  if (resolvedColor.startsWith('#')) {
    const hex = resolvedColor.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // For non-hex colors, return as is with opacity warning
  console.warn(`Cannot add opacity to non-hex color: ${resolvedColor}`);
  return resolvedColor;
}

// Export commonly used theme contexts
export const lightThemeContext = createThemeContext(false);
export const darkThemeContext = createThemeContext(true); 