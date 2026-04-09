---
name: component-engineer
description: Use when modifying, improving, or creating Idealyst UI components. Enforces static-only styles (no dynamic style functions), proper theme/Unistyles integration, $iterator variant expansion, cross-platform correctness (web + native), and no react-native-web on web. Updates component examples in examples/docs and validates visually with Playwright.
---

# Component Engineer

Use this skill whenever you are modifying, improving, or creating components in `packages/components/src/`. This skill enforces the Idealyst styling conventions, theme integration, cross-platform correctness, and visual validation.

## Core Principles

### 1. Static Styles Only - No Dynamic Style Functions

**Dynamic style functions are PROHIBITED.** If you encounter a component that uses them, refactor it to use static variants and compound variants instead.

#### What is a dynamic style function?

A dynamic style function is a style definition that takes runtime props and returns styles with conditional logic:

```typescript
// BAD - Dynamic style function (DO NOT USE)
button: ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => ({
    backgroundColor: type === 'contained'
        ? theme.intents[intent].primary
        : 'transparent',
    borderColor: type === 'outlined'
        ? theme.intents[intent].primary
        : 'transparent',
})
```

#### What should be used instead?

Static variants with `$iterator` expansion and `compoundVariants` for cross-variant logic:

```typescript
// GOOD - Static variants with $iterator and compoundVariants
button: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    variants: {
        type: {
            contained: {
                backgroundColor: theme.$intents.primary,
            },
            outlined: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderStyle: 'solid' as const,
                borderColor: theme.$intents.primary,
            },
            text: {
                backgroundColor: 'transparent',
            },
        },
        intent: {
            // $iterator expands for all registered intents
            backgroundColor: theme.$intents.primary,
        },
        size: {
            paddingVertical: theme.sizes.$button.paddingVertical,
            paddingHorizontal: theme.sizes.$button.paddingHorizontal,
            minHeight: theme.sizes.$button.minHeight,
        },
        disabled: {
            true: { opacity: 0.6 },
            false: { opacity: 1 },
        },
    },
    compoundVariants: [
        // Use compoundVariants for cross-variant conditional logic
        { type: 'outlined', disabled: false, styles: { _web: { cursor: 'pointer' } } },
        { type: 'contained', disabled: false, styles: { _web: { cursor: 'pointer', _hover: { opacity: 0.90 } } } },
    ],
}
```

#### When dynamic functions MIGHT be necessary

If you believe a dynamic function is truly unavoidable (e.g., computed colors that cannot be expressed as variant combinations), **stop and ask the user** before proceeding. Explain:
- What the dynamic requirement is
- Why variants + compoundVariants cannot express it
- The proposed dynamic approach

The user must explicitly approve dynamic style functions.

### 2. Theme-Agnostic & Style System Integration

**Components must be fully theme-agnostic.** They must look correct in light mode, dark mode, and any custom theme a user registers. This means:

- **Never use hardcoded opacity hacks** like `rgba(0,0,0,0.1)` for backgrounds, borders, or overlays. A black overlay at 10% opacity looks fine on a white background but breaks on dark themes. Use semantic theme tokens instead (e.g., `theme.colors.surface.secondary`, `theme.colors.border.primary`).
- **Never assume the background is light or dark** - use `theme.colors.surface.*` and `theme.colors.text.*` which adapt to the active theme.
- **Never use raw color values** that only work in one polarity. If you need a subtle background, use a surface color (`surface.secondary`, `surface.tertiary`) or an intent's `.light` variant — these are defined per-theme to always look correct.
- **Shadows must use `theme.shadows.*`** - these include platform-appropriate values and are tuned per-theme. Don't manually construct shadow styles with hardcoded colors.
- **Test mental model**: Ask "would this look correct if the background were `#000` instead of `#fff`?" If not, you're not using the theme system correctly.

**Only exception**: Camera/media overlays where `rgba(0,0,0,0.5)` is intentional for a translucent dark overlay over live camera content. This is the only acceptable use of hardcoded opacity colors.

Every style must work within the Idealyst theme system. Understand these layers:

#### Theme structure (from `packages/theme/src/theme/extensions.ts`)

```
DefaultTheme {
    intents:    Record<string, IntentValue>       // primary, success, danger, etc.
    radii:      Record<string, number>            // none, xs, sm, md, lg, xl
    shadows:    Record<string, ShadowValue>       // none, sm, md, lg, xl
    colors: {
        pallet:  Record<string, Record<Shade, ColorValue>>  // blue.100-900
        surface: Record<string, ColorValue>       // screen, primary, secondary
        text:    Record<string, ColorValue>        // primary, secondary, inverse
        border:  Record<string, ColorValue>        // primary, secondary
    }
    sizes: {
        button:  Record<Size, ButtonSizeValue>
        chip:    Record<Size, ChipSizeValue>
        icon:    Record<Size, IconSizeValue>
        input:   Record<Size, InputSizeValue>
        // ... 20+ component size structures
        typography: Record<Typography, TypographyValue>
    }
    interaction: InteractionConfig
    breakpoints: Record<string, number>
}
```

#### Derived types (always use these, never hardcode)

| Type | Resolves from | Example values |
|------|--------------|----------------|
| `Intent` | `keyof theme.intents` | `'primary' \| 'success' \| 'danger'` |
| `Size` | `keyof theme.sizes.button` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |
| `Radius` | `keyof theme.radii` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |
| `Surface` | `keyof theme.colors.surface` | `'primary' \| 'secondary' \| 'screen'` |
| `Color` | palette + shade | `` `${Pallet}.${Shade}` `` |

#### Rules

- **Never hardcode hex colors** - always reference `theme.colors.*`, `theme.intents.*`, or `theme.colors.pallet.*`
- **Never hardcode size values** - use `theme.sizes.<component>.<size>.*` for component-specific sizes
- **Never use `theme.spacing`** - it does not exist. Use component shorthand props (`padding="md"`, `gap="md"`)
- **Use `useTheme()`** - returns the Theme directly, NOT `{ theme }`
- **Never import from `react-native`** in shared code - use `@idealyst/components`

### 3. $iterator Expansion for Variants

The `ThemeStyleWrapper<BaseTheme>` type adds `$`-prefixed properties that the Babel plugin expands at build time into all registered keys.

#### How to use $iterators

```typescript
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

type Theme = ThemeStyleWrapper<BaseTheme>;

export const myStyles = defineStyle('MyComponent', (theme: Theme) => ({
    container: {
        variants: {
            // $iterator on intents: generates a variant for each intent key
            intent: {
                backgroundColor: theme.$intents.light,
                borderColor: theme.$intents.primary,
            },
            // $iterator on sizes: generates a variant for each size key
            size: {
                padding: theme.sizes.$button.paddingVertical,
                fontSize: theme.sizes.$button.fontSize,
            },
            // $iterator on surfaces: generates a variant for each surface key
            background: {
                backgroundColor: theme.colors.$surface,
            },
        },
    },
}));
```

#### Available $iterators

- `theme.$intents` - iterates over all intent keys, value is `IntentValue` (has `.primary`, `.contrast`, `.light`, `.dark`)
- `theme.sizes.$<component>` - iterates over all size keys for that component
- `theme.colors.$surface` - iterates over all surface color keys
- `theme.colors.$text` - iterates over all text color keys
- `theme.colors.$border` - iterates over all border color keys
- `theme.$radii` - iterates over all radius keys
- `theme.$shadows` - iterates over all shadow keys

**Key insight**: `$iterators` support extending variants automatically. When a user adds a new intent via `createTheme().addIntent('brand', {...})`, all `theme.$intents` references automatically expand to include `brand` without any component changes.

### 4. Cross-Platform Implementation

Every component needs both `.web.tsx` and `.native.tsx` implementations. Both must work correctly.

#### File structure required

```
src/Component/
  Component.styles.tsx    # Shared style definitions (defineStyle)
  Component.native.tsx    # React Native implementation
  Component.web.tsx       # Web implementation (pure DOM + CSS)
  types.ts                # Shared TypeScript props/types
  index.ts                # Default exports
  index.web.ts            # Web barrel export
  index.native.ts         # Native barrel export
```

#### Platform-specific styling rules

**Web-only styles** go in the `_web` pseudoselector within the style definition:

```typescript
container: {
    flexDirection: 'row',
    // Shared styles above
    _web: {
        display: 'flex',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        _hover: { opacity: 0.9 },
        _active: { opacity: 0.75 },
    },
}
```

**Web components (`.web.tsx`):**
- Use native HTML elements (`<div>`, `<button>`, `<span>`, etc.)
- Do NOT use `react-native-web` imports (no `View`, `Text`, `TouchableOpacity` from react-native)
- Apply styles directly from the shared `defineStyle` stylesheet
- Handle web-specific interaction patterns (hover, focus, keyboard events) natively
- Use `as any` for web-only CSS properties, NOT `as React.CSSProperties`

**Native components (`.native.tsx`):**
- Use React Native primitives (`View`, `Text`, `Pressable`, etc.) from `react-native`
- Handle native-specific patterns (touch feedback, accessibility)
- Use the same shared stylesheet from `.styles.tsx`

### 5. No react-native-web on Web

The web implementations in `.web.tsx` files must **never** import from `react-native` or `react-native-web`. Web components use:
- Standard HTML elements (`div`, `button`, `input`, `span`, etc.)
- The shared Unistyles stylesheet from `.styles.tsx`
- Native browser APIs where needed

This is a hard rule with no exceptions. If a component currently imports from `react-native` in its `.web.tsx`, it must be refactored.

## Style Definition Template

When creating or modifying a component's `.styles.tsx`:

```typescript
/**
 * <Component> styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size, Radius } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type <Component>Variants = {
    size: Size;
    intent: Intent;
    // ... other variant dimensions
};

export const <component>Styles = defineStyle('<Component>', (theme: Theme) => ({
    container: {
        // Base styles (defaults before any variant is applied)
        position: 'relative' as const,
        // ...base styles

        variants: {
            // Use $iterators for theme-derived variants
            intent: {
                backgroundColor: theme.$intents.light,
                borderColor: theme.$intents.primary,
            },
            size: {
                padding: theme.sizes.$<component>.paddingVertical,
                fontSize: theme.sizes.$<component>.fontSize,
            },
            // Boolean variants with explicit true/false
            disabled: {
                true: { opacity: 0.6 },
                false: { opacity: 1 },
            },
        },
        compoundVariants: [
            // Cross-variant logic goes here instead of dynamic functions
            {
                intent: 'primary',
                disabled: false,
                styles: { /* ... */ },
            },
        ],
        _web: {
            // Web-only styles
            display: 'flex',
            boxSizing: 'border-box',
        },
    },
    // Additional style elements (text, icon, etc.)
}));
```

## Workflow

### When modifying an existing component

1. **Read the current `.styles.tsx`, `.web.tsx`, `.native.tsx`, and `types.ts` files**
2. **Check for dynamic style functions** - if present, refactor to static variants + compoundVariants
3. **Verify theme integration** - ensure no hardcoded colors/sizes, all values come from theme
4. **Check $iterator usage** - ensure variants use `$iterator` expansion where appropriate
5. **Verify both platform files** - changes must work in both `.web.tsx` and `.native.tsx`
6. **Ensure `.web.tsx` uses no react-native imports** - pure HTML elements only
7. **Update the examples/docs app** - find the component's example page in `examples/docs/packages/shared/src/pages/components/<Component>.tsx` and update it to demonstrate the changes
8. **Validate visually with Playwright** - run the docs app and use Playwright to screenshot-test the component, checking element positions, padding, and sizes

### When creating a new component

1. Create the full file set: `types.ts`, `.styles.tsx`, `.web.tsx`, `.native.tsx`, `index.ts`, `index.web.ts`, `index.native.ts`
2. Check if a size structure exists in `packages/theme/src/theme/structures.ts` for this component type - if not, add one
3. Register the component name in `ComponentName` type in `packages/theme/src/styleBuilder.ts`
4. Register component styles in `ComponentStyleRegistry` via module augmentation
5. Use static-only style definitions with `$iterator` expansion
6. Implement both platform variants
7. Add an example page in `examples/docs/packages/shared/src/pages/components/`
8. Update `examples/docs` navigation to include the new component page
9. Update MCP server documentation (`packages/mcp-server/`) to include the new component

### Visual Validation with Playwright

After making component changes, validate visually:

1. Start the docs app: `cd examples/docs/packages/web && yarn dev`
2. Use Playwright to navigate to the component's docs page
3. Screenshot the component in its various states/variants
4. Verify:
   - Element positions are correct
   - Padding between elements matches theme values
   - Sizes correspond to the theme size system
   - All variants render correctly
   - Hover/active/disabled states work (web)

### Updating MCP Server Docs

When component props, variants, or behavior changes, update:

1. **Component docs**: `packages/mcp-server/src/data/` - update the relevant component documentation
2. **Component types tool**: Ensure `get_component_types` returns accurate TypeScript types
3. **Component examples**: Ensure `get_component_examples_ts` returns working, type-checked examples
4. **Rebuild**: `cd packages/mcp-server && yarn build`

## Reference Files

- **Theme extensions**: `packages/theme/src/theme/extensions.ts` (DefaultTheme interface)
- **Value structures**: `packages/theme/src/theme/structures.ts` (all *SizeValue types)
- **Style builder**: `packages/theme/src/styleBuilder.ts` (defineStyle, extendStyle, overrideStyle)
- **Style types**: `packages/theme/src/styles.ts` (Styles, Variants, CompoundVariants)
- **Iterator types**: `packages/theme/src/extensions.ts` (ThemeStyleWrapper)
- **Component registry**: `packages/theme/src/componentStyles.ts` (ComponentStyleRegistry)
- **Example Button styles**: `packages/components/src/Button/Button.styles.tsx` (reference implementation)
- **Example Card styles**: `packages/components/src/Card/Card.styles.tsx` (reference implementation)
- **Docs example pages**: `examples/docs/packages/shared/src/pages/components/`

## Common Mistakes to Avoid

1. **Using dynamic style functions** - always use static variants + compoundVariants
2. **Hardcoding colors or opacity hacks** - `rgba(0,0,0,0.1)` backgrounds break in dark mode. Use semantic tokens (`theme.colors.surface.*`, `theme.intents.*.light`)
3. **Hardcoding pixel values for sizes** - use `theme.sizes.<component>.*`
4. **Using `theme.spacing`** - does not exist, use component shorthand props
5. **Importing from react-native in .web.tsx** - use HTML elements
6. **Forgetting `void StyleSheet`** - required for Unistyles to process the file
7. **Forgetting `ThemeStyleWrapper`** - required for `$iterator` support
8. **Not registering component in `ComponentName` type** - Babel won't process `defineStyle` calls
9. **Not updating both platform files** - changes must work on web AND native
10. **Using `as React.CSSProperties`** for web-only CSS - use `as any` instead
11. **Forgetting to update MCP server docs** - LLM consumers won't see the changes
12. **Forgetting to update examples/docs** - visual verification becomes impossible
