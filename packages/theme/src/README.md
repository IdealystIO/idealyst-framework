# Theme System Components

This directory contains the core components of the @idealyst/theme system. Each file serves a specific purpose in the theming architecture.

## File Overview

| File | Purpose | Key Exports |
|------|---------|-------------|
| **[themeBuilder.ts](themeBuilder.md)** | Core theme creation utilities | `createTheme`, `extendTheme`, `generateColorPalette` |
| **[defaultThemes.ts](defaultThemes.md)** | Pre-built light and dark themes | `defaultLightTheme`, `defaultDarkTheme` |
| **[colors.ts](colors.md)** | Base color palette definitions | `colorPalettes` (8 palettes × 10 shades) |
| **[colorResolver.ts](colorResolver.md)** | Color resolution and utilities | Color manipulation functions |
| **[variants.ts](variants.md)** | Type definitions for color variants | `ColorVariant`, `IntentVariant` types |
| **[variantHelpers.ts](variantHelpers.md)** | Variant utility functions | Helper functions for variants |
| **[breakpoints.ts](breakpoints.md)** | Responsive design breakpoints | `breakpoints` object |
| **[common.ts](common.md)** | Shared theme properties | Typography, spacing, shadows |
| **[unistyles.ts](unistyles.md)** | Unistyles integration | Theme registration utilities |

## Architecture Overview

### Core Theme Creation Flow

1. **Color Palettes** (`colors.ts`) - Base color definitions
2. **Color Resolution** (`colorResolver.ts`) - Color manipulation and generation
3. **Theme Builder** (`themeBuilder.ts`) - Combines palettes into complete themes
4. **Default Themes** (`defaultThemes.ts`) - Pre-configured light/dark themes
5. **Unistyles Integration** (`unistyles.ts`) - Registration with styling system

### Type System

1. **Variants** (`variants.ts`) - Core type definitions
2. **Variant Helpers** (`variantHelpers.ts`) - Utility functions for types
3. **Common Properties** (`common.ts`) - Shared theme structure

### Responsive System

1. **Breakpoints** (`breakpoints.ts`) - Screen size definitions
2. **Theme Builder** - Integrates breakpoints into themes

## Usage Patterns

### Creating a Custom Theme

```tsx
import { createTheme, generateColorPalette } from './themeBuilder';

const customTheme = createTheme({
  palettes: {
    brand: generateColorPalette('#8b5cf6'),
    // ... other palettes
  },
  intents: {
    primary: 'brand',
    // ... other intents
  },
});
```

### Extending Existing Themes

```tsx
import { extendTheme } from './themeBuilder';
import { defaultLightTheme } from './defaultThemes';

const brandedTheme = extendTheme(defaultLightTheme, {
  palettes: {
    brand: generateColorPalette('#8b5cf6'),
  },
});
```

### Using Color Utilities

```tsx
import { lighten, darken } from './colorResolver';

const lighterBlue = lighten('#3b82f6', 0.2);
const darkerBlue = darken('#3b82f6', 0.2);
```

## Key Concepts

### Color Palettes
Each color palette contains 10 shades (50-900) with 500 being the base color.

### Intent System
Semantic color mappings that provide consistent meaning across components:
- `primary` - Main brand actions
- `success` - Positive actions
- `error` - Destructive actions
- `warning` - Caution actions
- `neutral` - Secondary actions

### Component Color System
Structured color mapping for UI components:
- `text` - Text colors for different contexts
- `surface` - Background colors for surfaces
- `border` - Border colors for different states
- `interactive` - Colors for interactive states

### Theme Structure
```tsx
interface AppTheme {
  palettes: Record<string, ThemeColorPalette>;
  intents: Record<string, ResolvedIntent>;
  colors: ThemeColorSystem;
  typography: TypographySystem;
  spacing: SpacingSystem;
  borderRadius: BorderRadiusSystem;
  shadows: ShadowSystem;
  transitions: TransitionSystem;
  breakpoints: BreakpointSystem;
}
```

## Best Practices

1. **Use Intent Colors**: Prefer intent-based colors over direct palette access
2. **Leverage Color Generation**: Use `generateColorPalette` for consistent color scales
3. **Extend Don't Replace**: Use `extendTheme` to modify existing themes
4. **Type Safety**: Leverage TypeScript for theme validation
5. **Responsive Design**: Use breakpoints for screen-size adaptations
6. **Accessibility**: Ensure sufficient contrast ratios in custom themes

## Performance Considerations

- Themes are computed once and cached
- Color generation is optimized for minimal computation
- Type checking happens at build time, not runtime
- Unistyles provides efficient style updates

## Development Workflow

1. **Theme Creation**: Start with `themeBuilder.ts` functions
2. **Color Customization**: Modify palettes in `colors.ts` or use generators
3. **Component Integration**: Use structured color system from themes
4. **Responsive Design**: Leverage breakpoints for adaptive layouts
5. **Testing**: Validate themes in both light and dark modes