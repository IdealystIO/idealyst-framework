# Components Package - Style System Refactoring

## Current Task: Converting to Static Style Pattern

We are systematically converting all component style files from dynamic functions to static styles with proper variants and compound variants.

## The Correct Pattern (Reference: Button.styles.tsx)

### 1. Style File Structure

```typescript
import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent, CompoundVariants } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

// Export the Variants type for component use
export type ButtonVariants = {
    size: ButtonSize;
    intent: ButtonIntent;
    type: ButtonType;
    disabled: boolean;
}

// Create intent variants dynamically from theme (NO HARDCODED ARRAYS)
function createIntentVariants(theme: Theme) {
    const variants: any = {};
    for (const intent in theme.intents) {
        variants[intent] = {};
    }
    return variants;
}

// Create type variants (structure only)
function createTypeVariants(theme: Theme) {
    return {
        contained: {
            borderWidth: 0,
        },
        outlined: {
            borderWidth: 2,
            borderStyle: 'solid' as const,
        },
    } as const;
}

// Create compound variants for multi-variant combinations
function createButtonCompoundVariants(theme: Theme) {
    const compoundVariants: CompoundVariants<keyof ButtonVariants> = [];

    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        compoundVariants.push({
            intent,
            type: 'contained',
            styles: {
                backgroundColor: intentValue.primary,
                color: intentValue.contrast,
            },
        });
    }

    return compoundVariants;
}

// Export styles - NO explicit return type annotation
export const buttonStyles = StyleSheet.create((theme: Theme) => {
    return {
        button: {
            alignItems: 'center',
            variants: {
                size: buildSizeVariants(theme, 'button', ...),
                intent: createIntentVariants(theme),
                type: createTypeVariants(theme),
                disabled: { true: {}, false: {} },
            },
            compoundVariants: createButtonCompoundVariants(theme),
        },
    };
});
```

### 2. Component Implementation

```typescript
import React, { forwardRef, ComponentRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { buttonStyles } from './Button.styles';
import type { ButtonProps } from './types';

const Button = forwardRef<ComponentRef<typeof TouchableOpacity>, ButtonProps>((props, ref) => {
    const { size = 'md', intent = 'primary', type = 'contained', disabled = false } = props;

    // Apply variants (intent is now a proper variant)
    buttonStyles.useVariants({
        size,
        intent,
        type,
        disabled,
    });

    return (
        <TouchableOpacity
            ref={ref}
            style={[buttonStyles.button, style]}  // Static style, no function call
        >
            <Text style={buttonStyles.text}>{children}</Text>
        </TouchableOpacity>
    );
});
```

## Key Rules

### ✅ DO:
- Export `XVariants` type from style files
- Use `CompoundVariants<keyof XVariants>` for compound variants (NOT with extra `[]`)
- Get intents dynamically: `for (const intent in theme.intents)`
- Use `as const` for literal values in variant definitions
- Use `ComponentRef<typeof Component>` for ref types
- Use static styles: `buttonStyles.button` (NOT `buttonStyles.button()`)
- Pass all variants to `useVariants()` including intent

### ❌ DON'T:
- Add explicit return types to `StyleSheet.create()` - let Unistyles infer
- Use dynamic style functions: `buttonStyles.button({ intent })` ❌
- Hardcode intent arrays: `['primary', 'success', 'error']` ❌
- Use deprecated ref types: `React.ElementRef` ❌
- Add extra `[]` to CompoundVariants: `CompoundVariants<V>[]` ❌
- Use `any` casts on refs: `ref as any` ❌

## Common Issues to Check

### 1. Invalid Imports in Style Files
**CRITICAL**: Check style files for invalid/circular imports that break TypeScript:
- ❌ Don't import from sibling component directories
- ❌ Don't import component types into style files (creates circular deps)
- ✅ Only import from: `@idealyst/theme`, `react-native-unistyles`, local utils

### 2. Border Style Values
- ❌ `borderStyle: 'none'` is INVALID (causes Unistyles errors)
- ✅ Either omit `borderStyle` or set `borderWidth: 0`

### 3. Compound Variants Type
- ❌ `const compoundVariants: CompoundVariants<keyof XVariants>[] = [];`
- ✅ `const compoundVariants: CompoundVariants<keyof XVariants> = [];`
- (CompoundVariants is already an array type)

## Progress Tracking

### ✅ Completed
- [x] Button.styles.tsx + Button.native.tsx + Button.web.tsx
- [x] Chip.styles.tsx + Chip.native.tsx
- [x] Card.styles.tsx + Card.native.tsx
- [x] Alert.styles.tsx + Alert.native.tsx
- [x] Input.styles.tsx
- [x] Accordion.styles.tsx (already static)

### 🔄 Needs Review/Update
Check these files for:
1. Invalid imports in .styles.tsx files
2. Dynamic style function calls in .native.tsx/.web.tsx
3. Deprecated ref types

Priority files (have dynamic functions or need checking):
- [ ] Badge.styles.tsx (uses `color` param - may need to stay dynamic)
- [ ] Switch.styles.tsx (has dynamic functions with intent)
- [ ] TextArea.styles.tsx
- [ ] Checkbox.styles.tsx
- [ ] RadioButton.styles.tsx
- [ ] Select.styles.tsx
- [ ] Progress.styles.tsx
- [ ] Dialog.styles.tsx
- [ ] Menu.styles.tsx / MenuItem.styles.tsx

Already static (just verify):
- [ ] Divider.styles.tsx
- [ ] Text.styles.tsx
- [ ] View.styles.tsx
- [ ] Icon.styles.tsx

### Special Cases
- **Badge**: Uses `color` prop which isn't a fixed set - may need dynamic styles
- **Switch**: Uses transform calculations - may need partial dynamic approach
- **Icon**: Uses dynamic color from `color` or `intent` props

## Testing Checklist

Before marking a component as complete:
1. [ ] No TypeScript errors in .styles.tsx file
2. [ ] No invalid imports in .styles.tsx
3. [ ] Component uses static styles (no function calls)
4. [ ] Component passes all variants to `useVariants()`
5. [ ] Ref types use `ComponentRef<typeof X>`
6. [ ] All variant combinations work correctly
7. [ ] No `ref as any` casts

## Reference Files
- **Main Reference**: `src/Button/Button.styles.tsx` and `src/Button/Button.native.tsx`
- **Theme Types**: `@idealyst/theme/src/styles.ts`
- **Compound Variants Example**: See Button's `createButtonCompoundVariants`
