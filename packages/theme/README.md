# @idealyst/theme

A comprehensive, cross-platform theming system for React and React Native applications. Built on top of [react-native-unistyles](https://github.com/jpudysz/react-native-unistyles) with a powerful color system, typography, spacing, and responsive design utilities.

## Features

- 🎨 **Comprehensive Color System**: 8 color palettes with 10 shades each (50-900)
- 🌓 **Light & Dark Themes**: Built-in light and dark theme variants
- ♿ **High Contrast Support**: Accessibility-focused high contrast themes
- 🎯 **Intent-Based Colors**: Semantic color system (primary, success, error, warning)
- 📱 **Responsive Design**: Breakpoint system for all screen sizes
- 🎭 **Component Color System**: Structured color mapping for UI components
- 🔧 **TypeScript**: Full type safety with comprehensive definitions
- 🌐 **Cross-Platform**: Works seamlessly on React and React Native
- 🎪 **Extensible**: Easy to extend and customize for your brand
- 🚀 **Production Ready**: Optimized performance and developer experience

## Installation

```bash
# Using Yarn (recommended)
yarn add @idealyst/theme

# Using npm
npm install @idealyst/theme
```

### Peer Dependencies

This library requires the following peer dependency:

```bash
# For cross-platform styling
yarn add react-native-unistyles
```

## Quick Start

### Basic Theme Usage

```tsx
import { StyleSheet } from 'react-native-unistyles';
import { defaultLightTheme, defaultDarkTheme } from '@idealyst/theme';

// Register themes with Unistyles 3.0
StyleSheet.configure({
  themes: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  },
  settings: {
    adaptiveThemes: true,
  },
});

// Use in components
const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
}));
```

### Theme Switching

```tsx
import { UnistylesRuntime } from 'react-native-unistyles';

// Switch themes programmatically
UnistylesRuntime.setTheme('dark');
UnistylesRuntime.setTheme('light');

// Get current theme
const currentTheme = UnistylesRuntime.themeName; // 'light' | 'dark'
```

## Theme Structure

### Color Palettes

The theme system includes 8 comprehensive color palettes, each with 10 carefully crafted shades:

```tsx
const palettes = {
  blue: {    // Primary brand colors
    50: '#eff6ff',   // Lightest
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Base color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Darkest
  },
  green: { /* Success colors */ },
  red: { /* Error colors */ },
  amber: { /* Warning colors */ },
  gray: { /* Neutral colors */ },
  cyan: { /* Info colors */ },
  purple: { /* Accent colors */ },
  pink: { /* Accent colors */ },
};
```

### Intent System

Semantic color mappings for consistent UX:

```tsx
const intents = {
  primary: {
    main: '#3b82f6',        // Primary action color
    on: '#ffffff',          // Text on primary
    container: '#dbeafe',   // Primary container
    onContainer: '#1e40af', // Text on container
    light: '#93c5fd',       // Light variant
    dark: '#1d4ed8',        // Dark variant
    border: '#2563eb',      // Border color
  },
  success: { /* Green palette mapping */ },
  error: { /* Red palette mapping */ },
  warning: { /* Amber palette mapping */ },
  neutral: { /* Gray palette mapping */ },
};
```

### Component Color System

Structured color mapping for UI components:

```tsx
const colors = {
  text: {
    primary: '#1f2937',     // Main text
    secondary: '#6b7280',   // Secondary text
    disabled: '#9ca3af',    // Disabled text
    inverse: '#ffffff',     // Text on dark backgrounds
    muted: '#d1d5db',       // Muted text
    placeholder: '#9ca3af', // Placeholder text
  },
  surface: {
    primary: '#ffffff',     // Main surface
    secondary: '#f9fafb',   // Secondary surface
    tertiary: '#f3f4f6',    // Tertiary surface
    elevated: '#ffffff',    // Elevated surface
    overlay: '#000000cc',   // Modal/overlay background
    inverse: '#1f2937',     // Inverse surface
  },
  border: {
    primary: '#d1d5db',     // Main borders
    secondary: '#e5e7eb',   // Subtle borders
    focus: '#3b82f6',       // Focus indicators
    error: '#ef4444',       // Error borders
    disabled: '#f3f4f6',    // Disabled borders
  },
  interactive: {
    hover: '#f3f4f6',       // Hover states
    pressed: '#e5e7eb',     // Pressed states
    focus: '#dbeafe',       // Focus states
    disabled: '#f9fafb',    // Disabled states
  },
};
```

### Typography System

Comprehensive typography scale:

```tsx
const typography = {
  fontFamily: {
    sans: 'system font, -apple-system, sans-serif',
    mono: 'SF Mono, Monaco, monospace',
  },
  fontSize: {
    xs: 12,    // Extra small
    sm: 14,    // Small
    md: 16,    // Medium (base)
    lg: 18,    // Large
    xl: 20,    // Extra large
    xxl: 24,   // Extra extra large
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing System

Consistent spacing scale based on 4px grid:

```tsx
const spacing = {
  xs: 4,     // 0.25rem
  sm: 8,     // 0.5rem
  md: 16,    // 1rem
  lg: 24,    // 1.5rem
  xl: 32,    // 2rem
  xxl: 48,   // 3rem
};
```

### Border Radius

Rounded corner scale:

```tsx
const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
```

### Responsive Breakpoints

Mobile-first breakpoint system:

```tsx
const breakpoints = {
  xs: 0,      // Mobile
  sm: 576,    // Mobile landscape
  md: 768,    // Tablet
  lg: 992,    // Desktop
  xl: 1200,   // Large desktop
  xxl: 1400,  // Extra large desktop
};
```

## Available Themes

### Default Themes

```tsx
import { 
  defaultLightTheme, 
  defaultDarkTheme,
  themePresets 
} from '@idealyst/theme';

// Individual themes
const lightTheme = defaultLightTheme;
const darkTheme = defaultDarkTheme;

// Theme presets collection
const themes = themePresets; // { light, dark }
```

### High Contrast Themes

For accessibility compliance and users with visual impairments:

```tsx
// High contrast variants (created via theme extension)
import { extendTheme } from '@idealyst/theme';

const lightHighContrast = extendTheme(defaultLightTheme, {
  colors: {
    text: {
      primary: '#000000',    // Pure black text
      secondary: '#1f2937',  // Very dark secondary
    },
    surface: {
      primary: '#ffffff',    // Pure white surface
    },
    border: {
      primary: '#000000',    // Black borders
    },
  },
});
```

## Creating Custom Themes

### Extending Existing Themes

```tsx
import { extendTheme, defaultLightTheme } from '@idealyst/theme';

const customTheme = extendTheme(defaultLightTheme, {
  palettes: {
    // Add your brand color
    brand: generateColorPalette('#8b5cf6'), // Purple brand
  },
  intents: {
    // Override primary intent with brand color
    primary: {
      main: '#8b5cf6',
      on: '#ffffff',
      container: '#f3e8ff',
      onContainer: '#581c87',
      light: '#c4b5fd',
      dark: '#7c3aed',
      border: '#a855f7',
    },
  },
  typography: {
    fontFamily: {
      sans: 'Helvetica, Arial, sans-serif', // Custom font
    },
  },
});
```

### Building Themes from Scratch

```tsx
import { createTheme, generateColorPalette } from '@idealyst/theme';

const brandTheme = createTheme({
  palettes: {
    brand: generateColorPalette('#ff6b6b'), // Coral brand color
    neutral: generateColorPalette('#64748b'), // Slate neutral
    // ... other palettes
  },
  intents: {
    primary: 'brand',    // Use brand palette for primary
    neutral: 'neutral',  // Use neutral palette for neutral
    success: 'green',
    error: 'red',
    warning: 'amber',
  },
  // Custom spacing, typography, etc.
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
});
```

### Color Palette Generation

Generate complete color palettes from a single base color:

```tsx
import { generateColorPalette } from '@idealyst/theme';

// Generate palette from brand color
const brandPalette = generateColorPalette('#8b5cf6');
// Returns: { 50: '#f7f3ff', 100: '#ede9fe', ..., 900: '#581c87' }

// Use in theme
const theme = createTheme({
  palettes: {
    brand: brandPalette,
    secondary: generateColorPalette('#06b6d4'), // Cyan
  },
});
```

## Advanced Usage

### Theme-Aware Components

```tsx
import { StyleSheet } from 'react-native-unistyles';

const ComponentStyles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    // Responsive styling
    variants: {
      size: {
        small: { padding: theme.spacing.sm },
        large: { padding: theme.spacing.xl },
      },
    },
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    variants: {
      intent: {
        primary: { color: theme.intents.primary.main },
        success: { color: theme.intents.success.main },
        error: { color: theme.intents.error.main },
      },
    },
  },
}));

const MyComponent = ({ size, intent }) => {
  return (
    <View style={ComponentStyles.container({ size })}>
      <Text style={ComponentStyles.text({ intent })}>Themed Component</Text>
    </View>
  );
};
```

### Responsive Design

```tsx
const responsiveStyles = StyleSheet.create((theme, rt) => ({
  container: {
    padding: theme.spacing.md,
    // Responsive breakpoints
    [rt.breakpoint]: {
      xs: { padding: theme.spacing.sm },
      md: { padding: theme.spacing.lg },
      xl: { padding: theme.spacing.xl },
    },
  },
}));
```

### Dynamic Theme Switching

```tsx
import React, { useState } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    UnistylesRuntime.setTheme(newTheme);
    setIsDark(!isDark);
  };

  return (
    <Button onPress={toggleTheme}>
      Switch to {isDark ? 'Light' : 'Dark'} Theme
    </Button>
  );
};
```

## Theme Integration with Components

### Using Intent Colors

```tsx
// Component automatically uses theme intents
<Button intent="primary">Primary Action</Button>
<Button intent="success">Save Changes</Button>
<Button intent="error">Delete Item</Button>
<Button intent="warning">Proceed with Caution</Button>
```

### Using Component Color System

```tsx
const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  cardText: {
    color: theme.colors.text.primary,
  },
  mutedText: {
    color: theme.colors.text.secondary,
  },
}));
```

## TypeScript Support

Full type safety throughout the theme system:

```tsx
import type { 
  AppTheme,
  ThemeConfig,
  ThemeColorPalette,
  ResolvedIntent,
  ThemeColorSystem 
} from '@idealyst/theme';

// Theme creation is fully typed
const myTheme: AppTheme = createTheme({
  palettes: {
    brand: generateColorPalette('#8b5cf6'), // TypeScript validates structure
  },
  // All theme properties are type-checked
});

// Style functions receive typed theme
const styles = StyleSheet.create((theme: AppTheme) => ({
  container: {
    backgroundColor: theme.colors.surface.primary, // Autocomplete and validation
    color: theme.intents.primary.main,
  },
}));
```

## Accessibility

### High Contrast Support

```tsx
// High contrast themes for accessibility
const highContrastLight = extendTheme(defaultLightTheme, {
  colors: {
    text: {
      primary: '#000000',    // Pure black for maximum contrast
      secondary: '#1f2937',
    },
    border: {
      primary: '#000000',    // Black borders
      focus: '#0066cc',      // High contrast focus
    },
  },
});
```

### WCAG Compliance

All default themes meet WCAG AA contrast requirements:
- Text contrast ratios ≥ 4.5:1
- Large text contrast ratios ≥ 3:1
- Focus indicators clearly visible
- Color not used as sole information source

## Performance

### Optimizations

- **Theme Caching**: Themes are computed once and cached
- **Minimal Re-renders**: Only style-dependent components re-render on theme change
- **Tree Shaking**: Import only the utilities you need
- **Efficient Color Generation**: Optimized color palette algorithms

### Bundle Size

- Core theme: ~8KB gzipped
- Color utilities: ~2KB gzipped
- Full theme with all utilities: ~12KB gzipped

## API Reference

### Theme Creation

| Function | Description | Parameters |
|----------|-------------|------------|
| `createTheme(config)` | Create a complete theme from configuration | `ThemeConfig` |
| `extendTheme(base, overrides)` | Extend an existing theme | `AppTheme`, `Partial<ThemeConfig>` |
| `generateColorPalette(color)` | Generate 10-shade palette from base color | `string` (hex color) |

### Theme Utilities

| Function | Description | Returns |
|----------|-------------|---------|
| `createStandardPalettes()` | Create default color palettes | `ThemeConfig['palettes']` |
| `createDarkPalettes()` | Create dark-optimized palettes | `ThemeConfig['palettes']` |
| `createLightIntentMappings()` | Create light theme intent mappings | Intent mappings |
| `createDarkIntentMappings()` | Create dark theme intent mappings | Intent mappings |

### Color Utilities

| Function | Description | Parameters |
|----------|-------------|------------|
| `lighten(color, amount)` | Lighten a color by percentage | `string`, `number` |
| `darken(color, amount)` | Darken a color by percentage | `string`, `number` |

## Development

### Building the Theme

```bash
# Build the library
yarn build

# Watch for changes during development
yarn dev
```

### Project Structure

```
packages/theme/
├── src/
│   ├── index.ts              # Main exports
│   ├── themeBuilder.ts       # Core theme creation utilities
│   ├── defaultThemes.ts      # Default light and dark themes
│   ├── colors.ts             # Color palette definitions
│   ├── colorResolver.ts      # Color resolution utilities
│   ├── variants.ts           # Color variant types
│   ├── variantHelpers.ts     # Variant utility functions
│   ├── breakpoints.ts        # Responsive breakpoints
│   ├── common.ts             # Common theme properties
│   └── unistyles.ts          # Unistyles integration
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing patterns and TypeScript conventions
4. Test theme changes across light and dark modes
5. Ensure accessibility compliance
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues, questions, or contributions, please visit our [GitHub repository](https://github.com/your-org/idealyst-framework).