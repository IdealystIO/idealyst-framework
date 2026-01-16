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

#### Colors
- **Intents**: `theme.intents[intent].primary`, `.contrast`, `.light`, `.dark`
  - Available intents: `primary`, `success`, `danger`, `warning`, `neutral`, `info`
- **Surface**: `theme.colors.surface.primary`, `.secondary`, `.tertiary`, `.inverse`, etc.
- **Text**: `theme.colors.text.primary`, `.secondary`, `.tertiary`, `.inverse`, etc.
- **Border**: `theme.colors.border.primary`, `.secondary`, `.tertiary`, `.disabled`
- **Palette**: `theme.colors.pallet[color][shade]` (e.g., `theme.colors.pallet.blue[500]`)

#### Sizes
- Component-specific size values via `buildSizeVariants(theme, 'componentName', callback)`
- Access specific size values: `theme.sizes.button[size].paddingVertical`, etc.

**Define locally in component styles:**
- Layout properties (flexDirection, alignItems, justifyContent)
- Display properties
- Positioning
- Component-specific constants that don't vary with theme (gap, borderRadius, margins)
- Typography that's not size-dependent (fontWeight, fontFamily)
- Transitions and animations

**IMPORTANT - Invalid Theme Properties:**
These properties do NOT exist in the theme and should be defined locally:
- ❌ `theme.spacing` - Use local constants (e.g., `gap: 8`)
- ❌ `theme.borderRadius` - Use local constants (e.g., `borderRadius: 4`)
- ❌ `theme.typography` - Use local constants for fontSize (e.g., `fontSize: 14`)
- ❌ `theme.colors?.text?.disabled` - Use opacity instead (e.g., `disabled: { opacity: 0.5 }`)

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

### 6. Web-Specific Interactions (Hover & Active States)

For interactive components (buttons, checkboxes, links, etc.), include hover and active states in `_web` properties for better user experience on web platforms.

**Important Considerations:**

1. **Only add hover/active states to interactive components** - Components that users can click, press, or interact with
2. **Respect disabled state** - Don't apply hover/active effects when the component is disabled
3. **Use appropriate feedback** - Typically opacity changes, color shifts, or transforms
4. **Include both _hover and _active** - `_hover` for mouse over, `_active` for press/click down

**Pattern with Disabled State:**

```typescript
const createButtonStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>) => {
    return ({ intent }: ButtonVariants) => {
        return deepMerge({
            // ... base styles
            variants: {
                disabled: {
                    true: {
                        opacity: 0.6,
                        _web: {
                            cursor: 'not-allowed',  // Show disabled cursor
                        }
                    },
                    false: {
                        opacity: 1,
                        _web: {
                            cursor: 'pointer',
                            _hover: {  // ✓ Only when NOT disabled
                                opacity: 0.90,
                            },
                            _active: {
                                opacity: 0.75,
                            },
                        }
                    },
                },
            },
        }, expanded);
    }
}
```

**IMPORTANT - Unistyles Pseudo-Class Syntax:**
- Use `_hover`, `_active`, `_focus`, NOT `:hover`, `:active`, `:focus`
- Unistyles uses underscore prefix for pseudo-classes in `_web` properties

**Pattern for Always-Interactive Components:**

For components that don't have a disabled state:

```typescript
const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedStyles>) => {
    return deepMerge({
        // ... base styles
        _web: {
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            _hover: {
                opacity: 0.8,
            },
        },
    }, expanded);
}
```

**Interactive Components that Should Include _hover and _active:**
- Buttons (when not disabled)
- Checkboxes (when not disabled)
- Radio buttons (when not disabled)
- Links
- Pressable containers
- Chips (when selectable/deletable)
- Menu items
- List items (when clickable)
- Tab items
- Toggle switches (when not disabled)

**Non-Interactive Components (No Hover):**
- Text labels
- Icons (unless clickable)
- Dividers
- Progress indicators
- Badges (display-only)
- Static containers

### 7. Main Export Pattern

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

### 8. Use deepMerge for Extensibility

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

### 9. Using Dynamic Styles in Components

**CRITICAL:** When style functions return functions (dynamic styles), they **must be called** with their required variant properties when used in components.

#### Pattern for Dynamic Styles

If a style function depends on variant properties and returns a function:

```typescript
// In component theme file (button.ts)
const createButtonStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>) => {
    return ({ intent }: ButtonVariants) => {  // ← Returns a function that needs intent
        return deepMerge({
            variants: {
                type: createButtonTypeVariants(theme, intent), // Uses intent dynamically
            },
        }, expanded);
    }
}
```

Then in the component file, you **must call it** with the required properties:

```typescript
// In Button.web.tsx (CORRECT)
const buttonStyleArray = [
  buttonStyles.button({ intent }),      // ✓ Calling with intent
  buttonStyles.text({ intent }),        // ✓ Calling with intent
];

// WRONG - will not work:
const buttonStyleArray = [
  buttonStyles.button,  // ✗ Missing function call
];
```

#### Pattern for Static Styles

If a style function returns a static object (no dynamic dependencies):

```typescript
// In component theme file
const createButtonIconContainerStyles = (theme: Theme, expanded: Partial<ExpandedButtonStyles>) => {
    return deepMerge({  // ← Returns object directly, not a function
        display: 'flex',
        gap: 4,
    }, expanded);
}
```

Then use it directly without calling:

```typescript
// In Button.web.tsx (CORRECT)
const iconContainerProps = getWebProps([buttonStyles.iconContainer]); // ✓ No call needed
```

#### Rule of Thumb

- **Dynamic style (returns function)**: Call with properties → `buttonStyles.button({ intent })`
- **Static style (returns object)**: Use directly → `buttonStyles.iconContainer`

Look at which properties the inner function destructures from variants - those are the properties you must pass when calling the style.

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

### Theme Package (`@idealyst/theme/src/components/`)
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
- [ ] Use proper theme colors: `theme.colors.border`, `theme.colors.text`, `theme.colors.surface`, `theme.intents`
- [ ] **Avoid invalid theme properties**: No `theme.spacing`, `theme.borderRadius`, `theme.typography`, or optional chaining on colors
- [ ] Keep layout/display properties local, colors/sizes from theme
- [ ] **Add hover and active states for interactive components** (see section 6)
  - Include `_hover` and `_active` (NOT `:hover`/`:active`) in `_web` properties for disabled `false` variant only
  - Set `cursor: 'pointer'` for interactive elements, `cursor: 'not-allowed'` for disabled
  - Use Unistyles syntax: `_hover`, `_active`, `_focus` (underscore prefix)
  - Typical pattern: `_hover: { opacity: 0.8 }`, `_active: { opacity: 0.6 }`

### Component Package (`@idealyst/components/src/Component/`)
- [ ] **Update Component.web.tsx**: Call dynamic styles with required properties (see section 9)
  - Example: `buttonStyles.button({ intent })` not `buttonStyles.button`
- [ ] **Update Component.native.tsx**: Call dynamic styles with required properties (see section 9)
  - Example: `buttonStyles.text({ intent })` not `buttonStyles.text`
- [ ] Verify both web and native components use the same variant properties
- [ ] Test that all size variants work (xs, sm, md, lg, xl)
