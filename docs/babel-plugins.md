# Idealyst Babel Plugins

This document explains the Babel plugins used in the Idealyst framework, their purpose, configuration, and execution order.

## Overview

Idealyst uses two main Babel plugins that work together during the build process:

| Plugin | Location | Purpose |
|--------|----------|---------|
| **Idealyst Styles Plugin** | `@idealyst/theme/plugin` | Expands `$iterator` patterns and transforms `defineStyle` to `StyleSheet.create` |
| **MDI Registry Plugin** | `@idealyst/components/plugin/web` | Scans for icon names and registers them with the IconRegistry |

These plugins **must run in a specific order** for correct behavior.

---

## Plugin 1: Idealyst Styles Plugin

**Location:** `packages/theme/src/babel/plugin.js`

### Purpose

This plugin handles the style system transformations:

1. **Transforms `defineStyle`** → `StyleSheet.create` (Unistyles)
2. **Expands `$iterator` patterns** for theme-aware variant generation
3. **Merges style extensions** from `extendStyle` and `overrideStyle` calls

### How $iterator Expansion Works

The `$iterator` pattern allows you to write variant styles once and have them automatically expanded for all theme keys.

**Before (source code):**
```typescript
export const buttonStyles = defineStyle('Button', (theme) => ({
  button: {
    variants: {
      type: {
        contained: { backgroundColor: theme.$intents.primary },
        outlined: { borderColor: theme.$intents.primary },
      },
      size: {
        width: theme.sizes.$button.minWidth,
        height: theme.sizes.$button.minHeight,
      },
    },
  },
}));
```

**After (transformed):**
```typescript
StyleSheet.create((theme) => ({
  button: {
    variants: {
      type: {
        primary: {
          contained: { backgroundColor: theme.intents.primary.primary },
          outlined: { borderColor: theme.intents.primary.primary },
        },
        success: {
          contained: { backgroundColor: theme.intents.success.primary },
          outlined: { borderColor: theme.intents.success.primary },
        },
        danger: { /* ... */ },
        warning: { /* ... */ },
        neutral: { /* ... */ },
        info: { /* ... */ },
      },
      size: {
        xs: { width: theme.sizes.button.xs.minWidth, height: theme.sizes.button.xs.minHeight },
        sm: { width: theme.sizes.button.sm.minWidth, height: theme.sizes.button.sm.minHeight },
        md: { width: theme.sizes.button.md.minWidth, height: theme.sizes.button.md.minHeight },
        lg: { width: theme.sizes.button.lg.minWidth, height: theme.sizes.button.lg.minHeight },
        xl: { width: theme.sizes.button.xl.minWidth, height: theme.sizes.button.xl.minHeight },
      },
    },
  },
}));
```

### Iterator Patterns

| Pattern | Expands To | Example |
|---------|------------|---------|
| `theme.$intents.property` | All intent keys (primary, success, danger, etc.) | `theme.$intents.primary` → `theme.intents.{key}.primary` |
| `theme.sizes.$component.property` | All size keys for component (xs, sm, md, lg, xl) | `theme.sizes.$button.minHeight` → `theme.sizes.button.{key}.minHeight` |
| `theme.sizes.$typography.property` | All typography keys (h1, h2, body1, etc.) | `theme.sizes.$typography.fontSize` → `theme.sizes.typography.{key}.fontSize` |

### Configuration

```javascript
// vite.config.ts or babel.config.js
[
  "@idealyst/theme/plugin",
  // or path.resolve(__dirname, "packages/theme/src/babel/plugin.js")
  {
    // REQUIRED: Path to your theme configuration file
    themePath: "./src/theme.ts",

    // REQUIRED: Paths that should be processed
    autoProcessPaths: [
      "packages/components",
      "packages/shared",
      "@idealyst/components",
      "@idealyst/navigation",
    ],

    // Enables dynamic theme analysis instead of hardcoded defaults
    aliases: {
      "@idealyst/theme": "/path/to/packages/theme",
      "@idealyst/components": "/path/to/packages/components",
    },

    // Optional: Enable verbose logging
    verbose: false,

    // Optional: Enable debug logging
    debug: false,
  }
]
```

### How Theme Keys Are Extracted

The plugin extracts theme keys (intents, sizes, etc.) to know what to expand `$iterator` patterns into.

**Resolution order:**

1. **With aliases configured:** Uses `analyzeThemeSource` to read values directly from TypeScript source files (e.g., `lightTheme.ts`)
2. **Without aliases:** Falls back to hardcoded default values

**Recommendation:** Always configure `aliases` when developing with the framework source to ensure new theme values are automatically discovered.

### Style Extension System

The plugin supports extending base component styles:

```typescript
// Extend Button styles (merges with base)
extendStyle('Button', (theme) => ({
  button: {
    borderRadius: theme.radii.lg,
  },
}));

// Override Button styles (replaces base entirely)
overrideStyle('Button', (theme) => ({
  button: { /* complete replacement */ },
}));
```

**Important:** Extension files must be imported BEFORE the components that use them.

---

## Plugin 2: MDI Registry Plugin

**Location:** `packages/components/plugin/web.js`

### Purpose

This plugin handles Material Design Icon registration:

1. **Scans JSX** for icon name usage in components
2. **Validates icons** against `@mdi/js` exports
3. **Generates registration code** to populate the IconRegistry at build time

### How It Works

**Before (source code):**
```tsx
function MyComponent() {
  return (
    <Button leftIcon="home" rightIcon="arrow-right">
      Click me
    </Button>
  );
}
```

**After (transformed):**
```tsx
import { IconRegistry } from '@idealyst/components';
import { mdiHome as _mdiHome, mdiArrowRight as _mdiArrowRight } from '@mdi/js';

IconRegistry.registerMany({
  'home': _mdiHome,
  'arrow-right': _mdiArrowRight,
});

function MyComponent() {
  return (
    <Button leftIcon="home" rightIcon="arrow-right">
      Click me
    </Button>
  );
}
```

### Supported Components and Props

The plugin scans these components for icon names:

| Component | Icon Props |
|-----------|------------|
| `Icon` | `name` |
| `IconSvg` | `name` |
| `Button` | `leftIcon`, `rightIcon` |
| `IconButton` | `icon` |
| `Badge` | `icon` |
| `Breadcrumb` | `icon` |
| `Menu`, `MenuItem` | `icon` |
| `ListItem` | `leading`, `trailing` |
| `Alert` | `icon` |
| `Chip` | `icon`, `deleteIcon` |
| `Input`, `TextInput` | `leftIcon`, `rightIcon` |

### Static Analysis Capabilities

The plugin can extract icon names from:

```tsx
// String literals
<Icon name="home" />

// JSX expressions with strings
<Icon name={"home"} />

// Ternary expressions
<Icon name={isActive ? "check" : "close"} />

// Logical expressions
<Icon name={hasIcon && "home"} />

// Variable references (limited)
const iconName = "home";
<Icon name={iconName} />

// Object properties
const menuItem = { icon: "settings" };
```

### Configuration

```javascript
[
  "@idealyst/components/plugin/web",
  // or path.resolve(__dirname, "packages/components/plugin/web.js")
  {
    // Optional: Enable debug logging
    debug: false,

    // Optional: Force-include icons (useful for dynamically loaded icons)
    icons: ["menu", "close", "chevron-down"],
  }
]
```

### Handling Dynamic Icons

For icons that can't be statically analyzed (e.g., from API responses), use the `icons` config option:

```javascript
{
  icons: ["custom-icon-1", "custom-icon-2"]
}
```

---

## Plugin Execution Order

**Critical:** The plugins must execute in this specific order:

```javascript
plugins: [
  // 1. FIRST: Idealyst Styles Plugin
  //    - Expands $iterator patterns
  //    - Transforms defineStyle → StyleSheet.create
  ["@idealyst/theme/plugin", { /* options */ }],

  // 2. SECOND: Unistyles Plugin
  //    - Processes StyleSheet.create for runtime
  ["react-native-unistyles/plugin", { /* options */ }],

  // 3. THIRD: MDI Registry Plugin
  //    - Scans for icon names
  //    - Generates registration code
  ["@idealyst/components/plugin/web", { /* options */ }],
]
```

### Why Order Matters

1. **Idealyst plugin first:** Must expand `$iterator` patterns BEFORE Unistyles processes the styles
2. **Unistyles second:** Needs the fully expanded `StyleSheet.create` calls
3. **MDI plugin last:** Can run anytime but conventionally runs after style processing

---

## Complete Vite Configuration Example

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';
import path from 'path';

export default defineConfig({
  plugins: [
    babel({
      filter: (id) =>
        id.includes("node_modules/@idealyst/") ||
        (id.includes("/packages/") && /\.(tsx?|jsx?)$/.test(id)),
      babelConfig: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }],
          ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
        ],
        plugins: [
          // 1. Idealyst Styles Plugin
          [
            path.resolve(__dirname, "packages/theme/src/babel/plugin.js"),
            {
              themePath: path.resolve(__dirname, "src/styles.ts"),
              autoProcessPaths: [
                "packages/components",
                "packages/navigation",
                "@idealyst/components",
                "@idealyst/navigation",
              ],
              aliases: {
                "@idealyst/theme": path.resolve(__dirname, "packages/theme"),
                "@idealyst/components": path.resolve(__dirname, "packages/components"),
              },
              verbose: false,
            },
          ],
          // 2. Unistyles Plugin
          [
            "react-native-unistyles/plugin",
            {
              autoProcessPaths: [
                "packages/components",
                "@idealyst/components",
              ],
            },
          ],
          // 3. MDI Registry Plugin
          [
            path.resolve(__dirname, "packages/components/plugin/web.js"),
            { debug: false },
          ],
        ],
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "react-native": path.resolve(__dirname, "node_modules/react-native-web"),
      "@idealyst/components": path.resolve(__dirname, "packages/components/src"),
      "@idealyst/theme": path.resolve(__dirname, "packages/theme/src"),
    },
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".js", ".jsx"],
  },
});
```

---

## Debugging

### Enable Verbose Logging

```javascript
// Idealyst Styles Plugin
{ verbose: true, debug: true }

// MDI Registry Plugin
{ debug: true }
```

### Common Issues

#### 1. `$iterator` not expanding

**Symptoms:** Runtime error like `Cannot read properties of undefined (reading 'size')`

**Causes:**
- Theme keys not found (check `verbose` output for "WARNING: No keys to expand")
- `autoProcessPaths` doesn't include your file's path
- `themePath` is incorrect

**Solutions:**
- Configure `aliases` to enable source analysis
- Ensure your file path matches `autoProcessPaths`
- Rebuild `@idealyst/tooling` if using published packages

#### 2. Icons not registering

**Symptoms:** Icons show as missing or broken

**Causes:**
- Icon name not statically analyzable
- Plugin not processing the file

**Solutions:**
- Use the `icons` config to force-include icons
- Check `debug` output to see which icons were found
- Ensure icon name is valid in `@mdi/js`

#### 3. Plugin order issues

**Symptoms:** Unistyles errors, styles not working

**Solution:** Ensure Idealyst plugin runs BEFORE Unistyles plugin

---

## Architecture Diagram

```
Source Code
    │
    ▼
┌─────────────────────────────────┐
│  1. Idealyst Styles Plugin      │
│  ─────────────────────────────  │
│  • Load theme keys              │
│  • Expand $iterator patterns    │
│  • Merge style extensions       │
│  • Transform defineStyle →      │
│    StyleSheet.create            │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  2. Unistyles Plugin            │
│  ─────────────────────────────  │
│  • Process StyleSheet.create    │
│  • Set up runtime theme access  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│  3. MDI Registry Plugin         │
│  ─────────────────────────────  │
│  • Scan JSX for icon names      │
│  • Generate import statements   │
│  • Register icons at build time │
└─────────────────────────────────┘
    │
    ▼
Transformed Code (ready for bundler)
```

---

## Related Files

- Theme Plugin: [packages/theme/src/babel/plugin.js](../packages/theme/src/babel/plugin.js)
- Theme Analyzer (TS): [packages/tooling/src/analyzer/theme-analyzer.ts](../packages/tooling/src/analyzer/theme-analyzer.ts)
- Theme Source Analyzer: [packages/tooling/src/analyzer/theme-source-analyzer.ts](../packages/tooling/src/analyzer/theme-source-analyzer.ts)
- MDI Plugin: [packages/components/plugin/web.js](../packages/components/plugin/web.js)
- Light Theme: [packages/theme/src/lightTheme.ts](../packages/theme/src/lightTheme.ts)
