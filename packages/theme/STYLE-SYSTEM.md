# Idealyst Style System

This document describes the complete styling architecture for Idealyst, a cross-platform design system built on React Native Unistyles.

## Table of Contents

1. [Overview](#overview)
2. [Theme Builder API](#theme-builder-api)
3. [Style Definition API](#style-definition-api)
4. [Style Extensions](#style-extensions)
5. [Babel Plugin Configuration](#babel-plugin-configuration)
6. [The $iterator Pattern](#the-iterator-pattern)
7. [Dynamic vs Static Styles](#dynamic-vs-static-styles)
8. [Platform-Specific Styles](#platform-specific-styles)
9. [Component Style Registration](#component-style-registration)
10. [Best Practices](#best-practices)

---

## Overview

Idealyst's style system provides:

- **Theme-reactive styling** via React Native Unistyles
- **Build-time style transformations** via Babel plugin
- **Type-safe theme definitions** with automatic inference
- **Style extension system** for consumer customization
- **Cross-platform support** with platform-specific overrides

The architecture consists of three main layers:

```
┌─────────────────────────────────────────────────────────┐
│  Theme Layer (builder.ts)                               │
│  createTheme() → addIntent() → setSizes() → build()    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Style Layer (styleBuilder.ts)                          │
│  defineStyle() / extendStyle() / overrideStyle()       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Babel Plugin (babel/plugin.js)                         │
│  Transforms to StyleSheet.create(), expands $iterators │
└─────────────────────────────────────────────────────────┘
```

---

## Theme Builder API

Themes are created using a fluent builder pattern that provides full TypeScript inference.

### Creating a Theme

```typescript
import { createTheme } from '@idealyst/theme';

export const myTheme = createTheme()
    // Add semantic intents
    .addIntent('primary', {
        primary: '#3b82f6',    // Main color
        contrast: '#ffffff',   // Text on primary
        light: '#bfdbfe',      // Lighter variant
        dark: '#1e40af',       // Darker variant
    })
    .addIntent('success', {
        primary: '#22c55e',
        contrast: '#ffffff',
        light: '#a7f3d0',
        dark: '#165e29',
    })

    // Add border radii
    .addRadius('none', 0)
    .addRadius('sm', 4)
    .addRadius('md', 8)
    .addRadius('lg', 12)

    // Add shadows (cross-platform)
    .addShadow('sm', {
        elevation: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',  // web-only
    })

    // Set colors
    .setColors({
        pallet: { /* color palette */ },
        surface: { primary: '#ffffff', secondary: '#f5f5f5' },
        text: { primary: '#000000', secondary: '#333333' },
        border: { primary: '#e0e0e0', disabled: '#f0f0f0' },
    })

    // Set component sizes
    .setSizes({
        button: {
            xs: { paddingVertical: 4, paddingHorizontal: 8, minHeight: 24, fontSize: 12 },
            sm: { paddingVertical: 6, paddingHorizontal: 12, minHeight: 32, fontSize: 14 },
            md: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 40, fontSize: 16 },
            lg: { paddingVertical: 10, paddingHorizontal: 20, minHeight: 48, fontSize: 18 },
            xl: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 56, fontSize: 20 },
        },
        // ... other components
    })

    // Set interaction styles
    .setInteraction({
        focusedBackground: 'rgba(59, 130, 246, 0.08)',
        focusBorder: 'rgba(59, 130, 246, 0.3)',
        opacity: { hover: 0.9, active: 0.75, disabled: 0.5 },
    })

    .build();
```

### Intent Structure

Each intent defines four color values:

| Property   | Purpose                           |
|------------|-----------------------------------|
| `primary`  | Main color used for backgrounds   |
| `contrast` | Text color on primary background  |
| `light`    | Lighter tint for subtle states    |
| `dark`     | Darker shade for pressed states   |

### Extending an Existing Theme

Use `fromTheme()` to extend a base theme:

```typescript
import { fromTheme, lightTheme } from '@idealyst/theme';

export const myTheme = fromTheme(lightTheme)
    .addIntent('brand', {
        primary: '#6366f1',
        contrast: '#ffffff',
        light: '#818cf8',
        dark: '#4f46e5',
    })
    .build();
```

### Registering Your Theme

For full type inference across your app:

```typescript
// src/theme/styles.ts
export const myTheme = createTheme()
    // ... builder chain
    .build();

// Register the theme type
declare module '@idealyst/theme' {
    interface RegisteredTheme {
        theme: typeof myTheme;
    }
}
```

---

## Style Definition API

### defineStyle()

Define base styles for a component. The Babel plugin transforms this to `StyleSheet.create()`.

```typescript
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
    button: {
        borderRadius: theme.radii.md,
        backgroundColor: theme.intents.primary.primary,

        variants: {
            size: {
                // $iterator expands to all size keys (xs, sm, md, lg, xl)
                paddingVertical: theme.sizes.$button.paddingVertical,
                paddingHorizontal: theme.sizes.$button.paddingHorizontal,
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
    },
    text: {
        color: theme.intents.primary.contrast,
        variants: {
            size: {
                fontSize: theme.sizes.$button.fontSize,
            },
        },
    },
}));
```

### Dynamic Style Functions

For styles that depend on runtime props:

```typescript
export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
    button: ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => ({
        backgroundColor: type === 'contained'
            ? theme.intents[intent].primary
            : 'transparent',
        borderColor: type === 'outlined'
            ? theme.intents[intent].primary
            : 'transparent',
    }),
}));
```

### Using Styles in Components

```typescript
import { buttonStyles } from './Button.styles';

const Button = ({ size = 'md', disabled = false, intent, type }) => {
    // Apply variants
    buttonStyles.useVariants({ size, disabled });

    // Static styles - no function call
    const staticStyle = buttonStyles.button;

    // Dynamic styles - function call with props
    const dynamicStyle = (buttonStyles.button as any)({ intent, type });

    return (
        <TouchableOpacity style={dynamicStyle}>
            <Text style={buttonStyles.text}>Click me</Text>
        </TouchableOpacity>
    );
};
```

---

## Style Extensions

Consumers can customize component styles without modifying source code.

### extendStyle()

Merge additional styles with base styles:

```typescript
// style-extensions.ts
import { extendStyle } from '@idealyst/theme';

extendStyle('Button', (theme) => ({
    button: {
        borderRadius: 9999,  // Make all buttons pill-shaped
    },
    text: {
        fontFamily: 'CustomFont',
    },
}));
```

### overrideStyle()

Completely replace base styles:

```typescript
import { overrideStyle } from '@idealyst/theme';

overrideStyle('Button', (theme) => ({
    button: {
        // Your complete custom implementation
        backgroundColor: theme.colors.surface.primary,
        borderWidth: 2,
        borderColor: theme.intents.primary.primary,
    },
    text: {
        color: theme.intents.primary.primary,
    },
}));
```

### Import Order Matters

Extensions must be imported **before** components:

```typescript
// App.tsx
import './style-extensions';           // FIRST - registers extensions
import { Button } from '@idealyst/components';  // SECOND - uses extensions
```

---

## Babel Plugin Configuration

### Installation

```javascript
// babel.config.js
module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        ['@idealyst/theme/plugin', {
            // REQUIRED: Path to your theme file
            themePath: './src/theme/styles.ts',

            // Optional: Enable debug logging
            debug: false,
            verbose: false,

            // Optional: Auto-process paths (default includes @idealyst packages)
            autoProcessPaths: [
                '@idealyst/components',
                '@idealyst/datepicker',
                'src/',
            ],
        }],
    ],
};
```

### What the Plugin Does

1. **Transforms `defineStyle()`** → `StyleSheet.create()`
2. **Expands `$iterator` patterns** → Multiple variant keys
3. **Merges extensions** with base styles at build time
4. **Removes `extendStyle()`/`overrideStyle()` calls** after capturing them

### Example Transformation

**Input:**
```typescript
defineStyle('Button', (theme) => ({
    button: {
        variants: {
            size: {
                paddingVertical: theme.sizes.$button.paddingVertical,
            },
        },
    },
}));
```

**Output:**
```typescript
StyleSheet.create((theme) => ({
    button: {
        variants: {
            size: {
                xs: { paddingVertical: theme.sizes.button.xs.paddingVertical },
                sm: { paddingVertical: theme.sizes.button.sm.paddingVertical },
                md: { paddingVertical: theme.sizes.button.md.paddingVertical },
                lg: { paddingVertical: theme.sizes.button.lg.paddingVertical },
                xl: { paddingVertical: theme.sizes.button.xl.paddingVertical },
            },
        },
    },
}));
```

---

## The $iterator Pattern

The `$iterator` pattern allows you to define styles once that expand to all keys of a theme object.

### ThemeStyleWrapper

Wrap your theme type to enable `$iterator` properties:

```typescript
import { ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

type Theme = ThemeStyleWrapper<BaseTheme>;
```

This adds `$property` versions of all iterable theme properties:

| Original Path           | $iterator Path              |
|------------------------|-----------------------------|
| `theme.intents.primary` | `theme.$intents.primary`   |
| `theme.sizes.button.md` | `theme.sizes.$button.md`   |

### Usage Examples

**Expand intents:**
```typescript
// Single definition
variants: {
    intent: {
        backgroundColor: theme.$intents.light,
        borderColor: theme.$intents.primary,
    },
}

// Expands to all intent keys (primary, success, error, warning, etc.)
```

**Expand sizes:**
```typescript
// Single definition
variants: {
    size: {
        paddingVertical: theme.sizes.$button.paddingVertical,
        fontSize: theme.sizes.$button.fontSize,
    },
}

// Expands to all size keys (xs, sm, md, lg, xl)
```

### createIteratorStyles()

Helper function that accepts `IteratorTheme`:

```typescript
import { createIteratorStyles } from '@idealyst/theme';

export const styles = createIteratorStyles((theme) => ({
    box: {
        variants: {
            intent: {
                backgroundColor: theme.$intents.light,
            },
        },
    },
}));
```

---

## Dynamic vs Static Styles

### Static Styles (Preferred)

Use Unistyles variants for conditional styling:

```typescript
// Style definition
export const cardStyles = defineStyle('Card', (theme) => ({
    card: {
        padding: 16,
        variants: {
            elevated: {
                true: { ...theme.shadows.md },
                false: {},
            },
        },
    },
}));

// Component usage
cardStyles.useVariants({ elevated: isElevated });
return <View style={cardStyles.card} />;
```

### Dynamic Styles (When Necessary)

Use dynamic functions when style values depend on complex prop combinations:

```typescript
// Style definition
export const buttonStyles = defineStyle('Button', (theme) => ({
    button: ({ intent = 'primary', type = 'contained' }) => ({
        backgroundColor: type === 'contained'
            ? theme.intents[intent].primary
            : 'transparent',
    }),
}));

// Component usage
const style = (buttonStyles.button as any)({ intent, type });
return <TouchableOpacity style={style} />;
```

### When to Use Each

| Use Static Styles When... | Use Dynamic Styles When... |
|---------------------------|----------------------------|
| Boolean toggles (enabled/disabled) | Prop-dependent color lookups |
| Enumerated variants (size, type) | Complex conditional logic |
| Theme values are fixed | Style depends on multiple props |

---

## Platform-Specific Styles

### Using _web and _native

```typescript
export const buttonStyles = defineStyle('Button', (theme) => ({
    button: {
        padding: 16,

        _web: {
            cursor: 'pointer',
            transition: 'all 0.1s ease',
            _hover: { opacity: 0.9 },
            _active: { opacity: 0.75 },
        },

        _native: {
            // Native-specific styles
        },
    },
}));
```

### Platform-Specific Component Files

For significant differences, use separate files:

```
Component/
├── Component.web.tsx     # Web implementation
├── Component.native.tsx  # React Native implementation
├── Component.styles.tsx  # Shared styles
├── types.ts              # Shared types
└── index.ts              # Platform exports
```

---

## Component Style Registration

Register your component's style types for type-safe extensions:

```typescript
// Button.styles.tsx
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle } from '@idealyst/theme';

export type ButtonStyleDef = {
    button: (props: ButtonDynamicProps) => ButtonStyleObject;
    text: (props: ButtonDynamicProps) => TextStyleObject;
};

export const buttonStyles = defineStyle('Button', (theme) => ({
    // ... styles
}));

// Register types
declare module '@idealyst/theme' {
    interface ComponentStyleRegistry {
        Button: ButtonStyleDef;
    }
}
```

This enables type checking in `extendStyle()` and `overrideStyle()`:

```typescript
// Consumer code gets autocomplete and type errors
extendStyle('Button', (theme) => ({
    button: {}, // TypeScript knows the shape
    unknownKey: {}, // Error: Property 'unknownKey' does not exist
}));
```

---

## Best Practices

### 1. Use $iterator for Size/Intent Variants

```typescript
// Good - single source of truth
variants: {
    size: {
        padding: theme.sizes.$component.padding,
    },
}

// Avoid - hardcoded repetition
variants: {
    size: {
        xs: { padding: theme.sizes.component.xs.padding },
        sm: { padding: theme.sizes.component.sm.padding },
        // ...
    },
}
```

### 2. Keep Dynamic Props Minimal

```typescript
// Good - only what's needed
({ intent = 'primary' }) => ({
    backgroundColor: theme.intents[intent].primary,
})

// Avoid - too many props
({ intent, size, disabled, type, variant, state }) => ({
    // Complex logic
})
```

### 3. Use Variants for Boolean/Enum States

```typescript
// Good
variants: {
    disabled: {
        true: { opacity: 0.5 },
        false: { opacity: 1 },
    },
}

// Avoid - inline conditionals
({ disabled }) => ({
    opacity: disabled ? 0.5 : 1,
})
```

### 4. Avoid Invalid Style Values

```typescript
// borderStyle: 'none' is INVALID
// Use this instead:
borderWidth: 0,
borderStyle: undefined,
```

### 5. Import Extensions First

```typescript
// App.tsx
import './style-extensions';  // Always first
import { ... } from '@idealyst/components';
```

### 6. Use void StyleSheet Marker

Ensure Unistyles processes your style files:

```typescript
import { StyleSheet } from 'react-native-unistyles';

// Required marker - Unistyles scans for StyleSheet usage
void StyleSheet;
```

---

## Troubleshooting

### Styles Not Applying

1. Check `themePath` in babel.config.js points to your theme file
2. Ensure `void StyleSheet;` marker exists in style files
3. Verify import order (extensions before components)
4. Clear Metro/bundler cache: `yarn start --reset-cache`

### Theme Changes Not Reflected

1. Restart Metro bundler (Babel plugin caches theme analysis)
2. Check theme file exports the theme correctly
3. Verify `RegisteredTheme` declaration

### Type Errors in Extensions

1. Ensure `ComponentStyleRegistry` is augmented in style files
2. Use correct function signatures for dynamic style functions
3. Check `ThemeStyleWrapper` is applied to theme type

---

## API Reference

### Theme Builder

| Method | Description |
|--------|-------------|
| `createTheme()` | Create a new theme builder |
| `fromTheme(base)` | Extend an existing theme |
| `.addIntent(name, value)` | Add a semantic intent |
| `.addRadius(name, value)` | Add a border radius |
| `.addShadow(name, value)` | Add a shadow definition |
| `.setColors(config)` | Set color palette |
| `.setSizes(config)` | Set component sizes |
| `.setInteraction(config)` | Set interaction styles |
| `.build()` | Create the theme object |

### Style Definition

| Function | Description |
|----------|-------------|
| `defineStyle(name, callback)` | Define component styles |
| `extendStyle(name, callback)` | Extend component styles |
| `overrideStyle(name, callback)` | Replace component styles |

### Types

| Type | Description |
|------|-------------|
| `ThemeStyleWrapper<T>` | Add $iterator properties to theme |
| `IteratorTheme` | Pre-wrapped theme type |
| `ComponentStyleRegistry` | Augmentable style type registry |
| `ExtendStyleDef<K>` | Type for extendStyle callback return |
| `OverrideStyleDef<K>` | Type for overrideStyle callback return |
