# Component Styles Guide

This document outlines the best practices for implementing component styles in the Idealyst framework, based on the reference implementation in `@idealyst/theme/src/components/chip.ts`.

## Style System Architecture

### 1. Dynamic Styles with Variant Types

Use functions to programmatically define styles when variant properties have many possible values (like `intent`, `color`, `type`). This approach is more efficient and maintainable than defining each variant manually.

**Example:**
```typescript
function createContainerVariants(theme: Theme, intent: Intent, selected: boolean) {
    const intentValue = theme.intents[intent];
    const primaryColor = selected ? intentValue.contrast : intentValue.primary;
    const secondaryColor = selected ? intentValue.primary : 'transparent';

    return {
        filled: {
            backgroundColor: primaryColor,
            borderColor: secondaryColor,
        },
        outlined: {
            backgroundColor: secondaryColor,
            borderColor: primaryColor,
        },
        soft: {
            backgroundColor: !selected ? intentValue.light : intentValue.primary,
        },
    };
}
```

**Why this works:**
- Variables make the relationship between variants clear
- Easy to modify color logic in one place
- Reduces code duplication
- Scales well when adding new intents or colors

### 2. Avoid Explicit Return Types on Style Functions

Do **not** specify explicit return types for individual style creation functions. As long as the style conforms to `ExpandedComponentStyles`, it's better to avoid the ambiguous type since styles can be either objects or functions.

**Good:**
```typescript
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedChipStyles>) => {
    return ({ intent, selected }: ChipVariants) => {
        return deepMerge({
            display: 'flex',
            variants: {
                size: createContainerSizeVariants(theme),
                type: createContainerVariants(theme, intent, selected),
            },
        }, expanded);
    }
}
```

**Avoid:**
```typescript
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles => {
    // TypeScript might complain about object vs function return types
}
```

### 3. Proper Type Definitions

Each component stylesheet should define:

```typescript
// 1. Variant value types
type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ChipType = 'filled' | 'outlined' | 'soft';
type ChipIntent = Intent;

// 2. Complete variant definition
type ChipVariants = {
    size: ChipSize;
    type: ChipType;
    intent: ChipIntent;
    selected: boolean;
    disabled: boolean;
    selectable: boolean;
}

// 3. Expanded styles type for a single element
export type ExpandedChipStyles = StylesheetStyles<keyof ChipVariants>;

// 4. Complete stylesheet structure
export type ChipStylesheet = {
    container: ExpandedChipStyles;
    label: ExpandedChipStyles;
    icon: ExpandedChipStyles;
    deleteButton: ExpandedChipStyles;
    deleteIcon: ExpandedChipStyles;
}
```

### 4. Size Values Must Be in Theme

**All size-related values** should be defined in `@idealyst/theme/src/theme/size.ts` with proper typings.

#### When to Add to Size Theme:

Add a new component size type when your component uses size variants:

```typescript
// In theme/src/theme/size.ts
export type AllComponentSizes = {
    button: Record<Size, ButtonSizeValue>;
    chip: Record<Size, ChipSizeValue>;
    badge: Record<Size, BadgeSizeValue>;
    // Add your component here
    yourComponent: Record<Size, YourComponentSizeValue>;
}

export type YourComponentSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    fontSize: SizeValue;
    // etc.
}
```

#### Using Size Values:

```typescript
function createSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'chip', (size) => ({
        paddingHorizontal: size.paddingHorizontal,
        paddingVertical: size.paddingVertical,
        minHeight: size.minHeight,
        borderRadius: size.borderRadius,
    }));
}
```

### 5. Theme vs Local Styles

**Theme provides:**
- Colors (intents, surface, text, borders, etc.)
- Size values (padding, fontSize, iconSize, etc.)
- Spacing system
- Breakpoints

**Define locally in component styles:**
- Layout properties (flexDirection, alignItems, justifyContent)
- Display properties
- Positioning
- Component-specific constants that don't vary with theme
- Typography that's not size-dependent (fontWeight, fontFamily)

**Example of appropriate local definitions:**
```typescript
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedChipStyles>) => {
    return ({ intent, selected }: ChipVariants) => {
        return deepMerge({
            display: 'flex',           // Local
            flexDirection: 'row',      // Local
            alignItems: 'center',      // Local
            justifyContent: 'center',  // Local
            gap: 4,                    // Local constant
            variants: {
                size: createSizeVariants(theme),  // From theme
                type: createTypeVariants(theme, intent),  // Uses theme colors
            },
        }, expanded);
    }
}
```

### 6. Main Export Pattern

Always export a `create[Component]Stylesheet` function that:
- Takes `theme` as first parameter
- Takes optional `expanded` parameter for style overrides
- Returns the complete stylesheet object

```typescript
export const createChipStylesheet = (
    theme: Theme,
    expanded?: Partial<ChipStylesheet>
): ChipStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        deleteButton: createDeleteButtonStyles(theme, expanded?.deleteButton || {}),
        deleteIcon: createDeleteIconStyles(theme, expanded?.deleteIcon || {}),
    };
}
```

### 7. Use deepMerge for Extensibility

Always use `deepMerge` to combine base styles with expanded/custom styles:

```typescript
import { deepMerge } from "../util/deepMerge";

const createStyles = (theme: Theme, expanded: Partial<ExpandedStyles>) => {
    return deepMerge({
        // base styles
    }, expanded);
}
```

This allows consumers to override or extend any part of the stylesheet.

## Complete Example Structure

```typescript
import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

// 1. Type definitions
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ComponentVariants = {
    size: ComponentSize;
    intent: Intent;
    disabled: boolean;
}

export type ExpandedComponentStyles = StylesheetStyles<keyof ComponentVariants>;

export type ComponentStylesheet = {
    container: ExpandedComponentStyles;
    label: ExpandedComponentStyles;
}

// 2. Variant generators (for complex/dynamic styles)
function createVariants(theme: Theme, intent: Intent) {
    const intentValue = theme.intents[intent];
    return {
        filled: { backgroundColor: intentValue.primary },
        outlined: { borderColor: intentValue.primary },
    };
}

// 3. Individual style creators
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedComponentStyles>) => {
    return ({ intent }: ComponentVariants) => {
        return deepMerge({
            display: 'flex',
            variants: {
                size: buildSizeVariants(theme, 'component', (size) => ({
                    padding: size.padding,
                })),
                disabled: {
                    true: { opacity: 0.5 },
                },
            },
        }, expanded);
    }
}

// 4. Main export
export const createComponentStylesheet = (
    theme: Theme,
    expanded?: Partial<ComponentStylesheet>
): ComponentStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
    };
}
```

## Checklist for New Component Styles

- [ ] Define variant types (Size, Type, etc.)
- [ ] Define complete `ComponentVariants` type
- [ ] Export `ExpandedComponentStyles` type
- [ ] Export `ComponentStylesheet` type
- [ ] Add size values to `theme/src/theme/size.ts` if needed
- [ ] Create variant generator functions for complex/dynamic styles
- [ ] Create individual style functions (no explicit return type)
- [ ] Use `deepMerge` for all style combinations
- [ ] Use `buildSizeVariants` for size-related properties
- [ ] Export `create[Component]Stylesheet` function
- [ ] Keep layout/display properties local, colors/sizes from theme
