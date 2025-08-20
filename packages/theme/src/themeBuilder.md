# Theme Builder

The core theme creation and extension utilities for building comprehensive theme objects.

## Overview

The theme builder provides the fundamental functions for creating, extending, and customizing themes. It handles color resolution, intent mapping, and theme structure generation.

## Key Functions

### createTheme

Creates a complete theme from a configuration object.

```tsx
import { createTheme, generateColorPalette } from './themeBuilder';

const theme = createTheme({
  palettes: {
    blue: generateColorPalette('#3b82f6'),
    green: generateColorPalette('#22c55e'),
    red: generateColorPalette('#ef4444'),
    gray: generateColorPalette('#6b7280'),
  },
  intents: {
    primary: 'blue',
    success: 'green',
    error: 'red',
    neutral: 'gray',
  },
  // Optional: custom typography, spacing, etc.
});
```

**Parameters:**
- `config: ThemeConfig` - Theme configuration object

**Returns:**
- Complete `AppTheme` object with all theme properties

### extendTheme

Extends an existing theme with new or modified properties.

```tsx
import { extendTheme, defaultLightTheme } from './themeBuilder';

const customTheme = extendTheme(defaultLightTheme, {
  palettes: {
    brand: generateColorPalette('#8b5cf6'), // Add brand color
  },
  intents: {
    primary: 'brand', // Override primary intent
  },
  typography: {
    fontFamily: {
      sans: 'Helvetica, Arial, sans-serif', // Custom font
    },
  },
});
```

**Parameters:**
- `baseTheme: AppTheme` - Base theme to extend
- `overrides: Partial<ThemeConfig>` - Properties to override

**Returns:**
- Extended `AppTheme` with merged properties

### generateColorPalette

Generates a complete 10-shade color palette from a single base color.

```tsx
import { generateColorPalette } from './themeBuilder';

const brandPalette = generateColorPalette('#8b5cf6');
// Returns:
// {
//   50: '#faf7ff',   // Lightest
//   100: '#f3e8ff',
//   200: '#e9d5ff',
//   300: '#d8b4fe',
//   400: '#c084fc',
//   500: '#8b5cf6',  // Base color (input)
//   600: '#7c3aed',
//   700: '#6d28d9',
//   800: '#5b21b6',
//   900: '#581c87',  // Darkest
// }
```

**Parameters:**
- `baseColor: string` - Hex color string (e.g., '#8b5cf6')

**Returns:**
- `ThemeColorPalette` object with shades 50-900

## Color Resolution Functions

### createLightResolvedIntents

Creates intent color mappings optimized for light themes.

```tsx
import { createLightResolvedIntents } from './themeBuilder';

const lightIntents = createLightResolvedIntents({
  blue: generateColorPalette('#3b82f6'),
  green: generateColorPalette('#22c55e'),
  red: generateColorPalette('#ef4444'),
  amber: generateColorPalette('#f59e0b'),
  gray: generateColorPalette('#6b7280'),
});
```

### createDarkResolvedIntents

Creates intent color mappings optimized for dark themes.

```tsx
import { createDarkResolvedIntents } from './themeBuilder';

const darkIntents = createDarkResolvedIntents({
  blue: generateColorPalette('#3b82f6'),
  green: generateColorPalette('#22c55e'),
  red: generateColorPalette('#ef4444'),
  amber: generateColorPalette('#f59e0b'),
  gray: generateColorPalette('#374151'), // Darker gray for dark theme
});
```

### createLightResolvedColors

Creates component color system for light themes.

```tsx
const lightColors = createLightResolvedColors(palettes, intents);
// Returns structured color system for text, surface, border, interactive
```

### createDarkResolvedColors

Creates component color system for dark themes.

```tsx
const darkColors = createDarkResolvedColors(palettes, intents);
// Returns structured color system optimized for dark backgrounds
```

## Theme Configuration Types

### ThemeConfig

Configuration object for creating themes:

```tsx
interface ThemeConfig {
  palettes: Record<string, ThemeColorPalette>;
  intents: Record<string, string>; // Maps intent names to palette names
  
  // Optional overrides
  typography?: Partial<TypographySystem>;
  spacing?: Partial<SpacingSystem>;
  borderRadius?: Partial<BorderRadiusSystem>;
  shadows?: Partial<ShadowSystem>;
  transitions?: Partial<TransitionSystem>;
}
```

### ThemeColorPalette

10-shade color palette structure:

```tsx
interface ThemeColorPalette {
  50: string;   // Lightest shade
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // Base color
  600: string;
  700: string;
  800: string;
  900: string;  // Darkest shade
}
```

### ResolvedIntent

Complete intent color mapping:

```tsx
interface ResolvedIntent {
  main: string;      // Primary color
  on: string;        // Text color on main
  container: string; // Container background
  onContainer: string; // Text on container
  light: string;     // Light variant
  dark: string;      // Dark variant
  border: string;    // Border color
}
```

## Advanced Usage

### Custom Theme with Brand Colors

```tsx
const brandTheme = createTheme({
  palettes: {
    brand: generateColorPalette('#ff6b6b'),    // Coral brand
    accent: generateColorPalette('#4ecdc4'),   // Teal accent
    neutral: generateColorPalette('#95a5a6'),  // Cool gray
    success: generateColorPalette('#2ecc71'),  // Green
    error: generateColorPalette('#e74c3c'),    // Red
    warning: generateColorPalette('#f39c12'),  // Orange
  },
  intents: {
    primary: 'brand',
    secondary: 'accent',
    neutral: 'neutral',
    success: 'success',
    error: 'error',
    warning: 'warning',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 19,
      xxl: 23,
    },
  },
  spacing: {
    xs: 2,
    sm: 6,
    md: 12,
    lg: 20,
    xl: 32,
    xxl: 52,
  },
});
```

### Theme Variants

```tsx
// Create base theme
const baseTheme = createTheme(baseConfig);

// Create high contrast variant
const highContrastTheme = extendTheme(baseTheme, {
  colors: {
    text: {
      primary: '#000000',    // Pure black
      secondary: '#1a1a1a',  // Near black
    },
    border: {
      primary: '#000000',    // Black borders
      focus: '#0066cc',      // High contrast blue
    },
  },
});

// Create compact variant
const compactTheme = extendTheme(baseTheme, {
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  typography: {
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
    },
  },
});
```

### Dynamic Theme Generation

```tsx
function createBrandTheme(brandColor: string, accentColor: string) {
  return createTheme({
    palettes: {
      brand: generateColorPalette(brandColor),
      accent: generateColorPalette(accentColor),
      neutral: generateColorPalette('#6b7280'),
      success: generateColorPalette('#22c55e'),
      error: generateColorPalette('#ef4444'),
      warning: generateColorPalette('#f59e0b'),
    },
    intents: {
      primary: 'brand',
      secondary: 'accent',
      neutral: 'neutral',
      success: 'success',
      error: 'error',
      warning: 'warning',
    },
  });
}

// Generate themes dynamically
const redTheme = createBrandTheme('#e53e3e', '#4299e1');
const purpleTheme = createBrandTheme('#8b5cf6', '#06b6d4');
```

## Color Utility Functions

### lighten

Lightens a color by a specified percentage:

```tsx
import { lighten } from './colorResolver';

const lightBlue = lighten('#3b82f6', 0.2); // 20% lighter
```

### darken

Darkens a color by a specified percentage:

```tsx
import { darken } from './colorResolver';

const darkBlue = darken('#3b82f6', 0.2); // 20% darker
```

## Best Practices

1. **Use generateColorPalette**: Always generate complete palettes for consistency
2. **Start with defaults**: Extend default themes rather than creating from scratch
3. **Intent mapping**: Use semantic intent names (primary, success, error, etc.)
4. **Type safety**: Leverage TypeScript for theme validation
5. **Performance**: Create themes once and reuse them
6. **Accessibility**: Ensure sufficient contrast in custom color combinations

## Common Patterns

### Corporate Branding

```tsx
const corporateTheme = extendTheme(defaultLightTheme, {
  palettes: {
    corporate: generateColorPalette('#1a365d'), // Navy corporate color
  },
  intents: {
    primary: 'corporate',
  },
  typography: {
    fontFamily: {
      sans: 'Helvetica Neue, Arial, sans-serif',
    },
  },
});
```

### Accessibility-First Theme

```tsx
const accessibleTheme = extendTheme(defaultLightTheme, {
  colors: {
    text: {
      primary: '#000000',    // Pure black for maximum contrast
      secondary: '#4a4a4a',  // Dark gray with good contrast
    },
    border: {
      focus: '#005fcc',      // High contrast focus indicator
    },
  },
  typography: {
    fontSize: {
      xs: 14,   // Minimum 14px for readability
      sm: 16,
      md: 18,
      lg: 20,
      xl: 24,
      xxl: 28,
    },
  },
});
```