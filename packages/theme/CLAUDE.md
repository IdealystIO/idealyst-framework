# @idealyst/theme - LLM Documentation

This file provides comprehensive theming documentation for LLMs working with the @idealyst/theme library.

## Library Overview

@idealyst/theme is a comprehensive theming system with:
- 8 color palettes × 10 shades each (50-900)
- Light and dark theme presets
- High contrast accessibility support
- Intent-based color system (primary, success, error, warning, neutral)
- Complete typography, spacing, and layout systems
- Cross-platform support via react-native-unistyles

## Quick Start

### Basic Setup
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
```

### Using in Components
```tsx
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
}));
```

## Core Concepts

### Color System Structure

#### Color Palettes (8 palettes × 10 shades)
```tsx
// Each palette has shades 50-900
blue: {
  50: '#eff6ff',   // Lightest
  500: '#3b82f6',  // Base color
  900: '#1e3a8a',  // Darkest
}

// Available palettes:
// blue, green, red, amber, gray, cyan, purple, pink
```

#### Intent System
Semantic color mappings for consistent UX:
```tsx
intents: {
  primary: { main, on, container, onContainer, light, dark, border },
  success: { /* Green palette mapping */ },
  error: { /* Red palette mapping */ },
  warning: { /* Amber palette mapping */ },
  neutral: { /* Gray palette mapping */ },
}
```

#### Component Color System
Structured colors for UI components:
```tsx
colors: {
  text: { primary, secondary, disabled, inverse, muted, placeholder },
  surface: { primary, secondary, tertiary, elevated, overlay, inverse },
  border: { primary, secondary, focus, error, disabled },
  interactive: { hover, pressed, focus, disabled },
}
```

### Typography System
```tsx
typography: {
  fontFamily: { sans, mono },
  fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
  fontWeight: { light: '300', regular: '400', medium: '500', semibold: '600', bold: '700' },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
}
```

### Spacing System
```tsx
spacing: {
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem  
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  xxl: 48,  // 3rem
}
```

## Default Themes

### Light Theme
- Dark text on light backgrounds
- Subtle shadows for depth
- Warm gray tones
- WCAG AA compliant

### Dark Theme  
- Light text on dark backgrounds
- Reduced shadows, emphasis on borders
- Cool gray tones
- WCAG AA compliant

```tsx
// Switch themes
import { UnistylesRuntime } from 'react-native-unistyles';
UnistylesRuntime.setTheme('dark');
UnistylesRuntime.setTheme('light');
```

## Theme Creation

### Extending Existing Themes
```tsx
import { extendTheme, defaultLightTheme } from '@idealyst/theme';

const customTheme = extendTheme(defaultLightTheme, {
  palettes: {
    brand: generateColorPalette('#8b5cf6'), // Add brand color
  },
  intents: {
    primary: 'brand', // Use brand palette for primary
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
    },
  },
});
```

### Creating from Scratch
```tsx
import { createTheme, generateColorPalette } from '@idealyst/theme';

const brandTheme = createTheme({
  palettes: {
    brand: generateColorPalette('#ff6b6b'),
    neutral: generateColorPalette('#64748b'),
    success: generateColorPalette('#22c55e'),
    error: generateColorPalette('#ef4444'),
    warning: generateColorPalette('#f59e0b'),
  },
  intents: {
    primary: 'brand',
    neutral: 'neutral',
    success: 'success',
    error: 'error',
    warning: 'warning',
  },
});
```

### Color Palette Generation
```tsx
import { generateColorPalette } from '@idealyst/theme';

// Generate complete 10-shade palette from base color
const brandPalette = generateColorPalette('#8b5cf6');
// Returns: { 50: '#f7f3ff', 100: '#ede9fe', ..., 900: '#581c87' }
```

## Common Usage Patterns

### Intent-Based Styling
```tsx
const styles = StyleSheet.create((theme) => ({
  primaryButton: {
    backgroundColor: theme.intents.primary.main,
    color: theme.intents.primary.on,
  },
  successButton: {
    backgroundColor: theme.intents.success.main,
    color: theme.intents.success.on,
  },
  errorText: {
    color: theme.intents.error.main,
  },
}));
```

### Component Color System
```tsx
const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface.elevated,
    borderColor: theme.colors.border.primary,
    borderWidth: 1,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
}));
```

### Responsive Styling
```tsx
const styles = StyleSheet.create((theme, rt) => ({
  container: {
    padding: theme.spacing.md,
    [rt.breakpoint]: {
      xs: { padding: theme.spacing.sm },
      md: { padding: theme.spacing.lg },
      xl: { padding: theme.spacing.xl },
    },
  },
}));
```

### Variants and States
```tsx
const styles = StyleSheet.create((theme) => ({
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    variants: {
      intent: {
        primary: {
          backgroundColor: theme.intents.primary.main,
          color: theme.intents.primary.on,
        },
        success: {
          backgroundColor: theme.intents.success.main,
          color: theme.intents.success.on,
        },
      },
      size: {
        small: { padding: theme.spacing.sm },
        large: { padding: theme.spacing.lg },
      },
    },
  },
}));
```

## Accessibility and High Contrast

### High Contrast Themes
```tsx
const highContrastLight = extendTheme(defaultLightTheme, {
  colors: {
    text: {
      primary: '#000000',    // Pure black
      secondary: '#1a1a1a',  // Near black
    },
    border: {
      primary: '#000000',    // Black borders
      focus: '#0066cc',      // High contrast focus
    },
  },
});
```

### WCAG Compliance
- All default themes meet WCAG AA standards
- Text contrast ≥ 4.5:1 for normal text
- Text contrast ≥ 3:1 for large text (18pt+)
- UI element contrast ≥ 3:1

## Color Utilities

### Color Manipulation
```tsx
import { lighten, darken } from '@idealyst/theme';

const lightBlue = lighten('#3b82f6', 0.2); // 20% lighter
const darkBlue = darken('#3b82f6', 0.2);   // 20% darker
```

### Palette Creation
```tsx
import { 
  createStandardPalettes,
  createDarkPalettes,
  createLightIntentMappings,
  createDarkIntentMappings 
} from '@idealyst/theme';

const standardPalettes = createStandardPalettes();
const darkPalettes = createDarkPalettes();
const lightIntents = createLightIntentMappings(standardPalettes);
const darkIntents = createDarkIntentMappings(darkPalettes);
```

## Breakpoint System

```tsx
breakpoints: {
  xs: 0,      // Mobile
  sm: 576,    // Mobile landscape  
  md: 768,    // Tablet
  lg: 992,    // Desktop
  xl: 1200,   // Large desktop
  xxl: 1400,  // Extra large desktop
}

// Usage in styles
[miniRuntime.breakpoint]: {
  md: { /* tablet and up */ },
  lg: { /* desktop and up */ },
}
```

## Theme Structure

Complete theme object structure:
```tsx
interface AppTheme {
  palettes: Record<string, ThemeColorPalette>;     // 8 palettes × 10 shades
  intents: Record<string, ResolvedIntent>;         // Semantic color mappings
  colors: ThemeColorSystem;                        // Component color system
  typography: TypographySystem;                    // Font system
  spacing: SpacingSystem;                          // Spacing scale
  borderRadius: BorderRadiusSystem;                // Border radius scale
  shadows: ShadowSystem;                          // Shadow definitions
  transitions: TransitionSystem;                   // Animation timings
  breakpoints: BreakpointSystem;                  // Responsive breakpoints
}
```

## Best Practices for LLMs

1. **Use intent colors** - Prefer `theme.intents.primary.main` over direct palette access
2. **Component color system** - Use `theme.colors.text.primary` for consistent text colors
3. **Spacing consistency** - Use `theme.spacing.*` for consistent spacing
4. **Typography scale** - Use `theme.typography.fontSize.*` for consistent text sizes
5. **Responsive design** - Leverage breakpoints for adaptive layouts
6. **Accessibility** - Always consider contrast and readability
7. **Theme extension** - Use `extendTheme()` to customize existing themes
8. **Color generation** - Use `generateColorPalette()` for brand colors

## File-Based Documentation Access

Complete documentation is available as markdown files:

```bash
# Main overview
README.md

# Component-specific documentation
src/README.md              # Theme system overview
src/themeBuilder.md         # Core theme creation utilities
src/colors.md              # Color palette definitions
src/defaultThemes.md        # Default light and dark themes

# LLM-optimized reference
CLAUDE.md                   # This file
```

## Import Patterns

```tsx
// Core theme functions
import { createTheme, extendTheme, generateColorPalette } from '@idealyst/theme';

// Default themes
import { defaultLightTheme, defaultDarkTheme } from '@idealyst/theme';

// Theme presets
import { themePresets } from '@idealyst/theme';

// Color utilities
import { lighten, darken } from '@idealyst/theme';

// Breakpoints
import { breakpoints } from '@idealyst/theme';

// Unistyles integration
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
```

## Quick Reference

### Essential Setup
```tsx
import { StyleSheet } from 'react-native-unistyles';
import { defaultLightTheme, defaultDarkTheme } from '@idealyst/theme';

StyleSheet.configure({
  themes: { light: defaultLightTheme, dark: defaultDarkTheme },
  settings: { adaptiveThemes: true },
});
```

### Theme Usage
```tsx
const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing.md,
  },
}));
```

### Color Access
```tsx
// Intent colors (recommended)
theme.intents.primary.main
theme.intents.success.container

// Component colors
theme.colors.text.primary
theme.colors.surface.elevated
theme.colors.border.focus

// Direct palette access
theme.palettes.blue[500]
```

### Theme Creation
```tsx
const customTheme = extendTheme(defaultLightTheme, {
  palettes: { brand: generateColorPalette('#8b5cf6') },
  intents: { primary: 'brand' },
});
```

This provides a complete theming system for building consistent, accessible, and visually appealing user interfaces across React and React Native platforms.