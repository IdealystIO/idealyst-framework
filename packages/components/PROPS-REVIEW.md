# Idealyst Components - AI Agent Props Intuitiveness Review

## Executive Summary

This document reviews Idealyst component props from an AI agent's perspective. For each component, I provide:
1. **What I would guess** - Props an AI would expect based solely on the component name and theme knowledge
2. **What actually exists** - The actual props defined
3. **Assessment** - Intuitiveness score and issues identified

### Theme Context (for guessing)
- **Size**: `xs | sm | md | lg | xl`
- **Intent**: `primary | success | danger | warning | neutral | info`
- **Color**: Palette names with optional shade (e.g., `blue.500`, `red`, `gray.200`)
- **Radius**: `none | xs | sm | md | lg | xl`

### Design Decisions (Established)

These decisions have been made and should be followed consistently:

1. **`type` over `variant`** - We use `type` for visual style props across all components. While this conflicts with HTML's `<button type="submit">`, TypeScript catches any misuse, and consistency within the library is more valuable. This also avoids confusion when defining styles.

2. **`onPress` over `onClick`** - Mobile-first approach. All interactive components use `onPress`. `onClick` is supported as a deprecated fallback for web compatibility.

3. **`children` over `title`/`label`** - Content is passed via `children` to allow custom layouts (icons, text, etc.)

---

## Component Reviews

### 1. Button ✅ UPDATED

**AI Expectation:**
```typescript
{
  children?: ReactNode;
  label?: string;          // or text?
  onClick?: () => void;    // standard web convention
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
  intent?: Intent;
  size?: Size;
  icon?: IconName;         // single icon
  loading?: boolean;
}
```

**Actual Props (after updates):**
```typescript
{
  children?: ReactNode;
  onPress?: () => void;              // ✅ Mobile-first (established pattern)
  onClick?: () => void;              // ✅ Deprecated fallback for web
  disabled?: boolean;
  type?: ButtonType;                 // ✅ Established pattern (no variant alias)
  intent?: Intent;
  size?: Size;
  leftIcon?: IconName | ReactNode;   // ✅ Clear naming
  rightIcon?: IconName | ReactNode;  // ✅ Clear naming
  loading?: boolean;
  gradient?: 'darken' | 'lighten';
}
```

**Changes Made:**
- ✅ Removed `title` prop (use `children` for content)
- ✅ Removed `variant` alias (use `type` consistently)
- ✅ Added deprecated `onClick` with console warning

**Intuitiveness Score: 8/10** (improved from 7/10)

---

### 2. Alert ✅ UPDATED

**AI Expectation:**
```typescript
{
  title?: string;
  message?: string;        // or description
  intent?: Intent;         // or severity/type
  variant?: 'filled' | 'outlined' | 'soft';
  size?: Size;
  icon?: ReactNode;
  closable?: boolean;      // standard term
  onClose?: () => void;
  action?: ReactNode;
}
```

**Actual Props (after updates):**
```typescript
{
  title?: string;
  message?: string;
  children?: ReactNode;
  intent?: Intent;
  type?: AlertType;                // ✅ Established pattern (use `type`)
  size?: Size;                     // ✅ Added - xs/sm/md/lg/xl
  icon?: ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;           // ✅ Keep - pairs well with onDismiss
  onDismiss?: () => void;          // ✅ Keep - clear semantic meaning
  actions?: ReactNode;
}
```

**Changes Made:**
- ✅ Added `size` prop with full Size support (xs/sm/md/lg/xl)
- ✅ Size affects padding, gap, border radius, font sizes, and icon sizes
- ✅ Keeping `dismissible`/`onDismiss` naming (clear semantic meaning)
- ✅ Added `AlertSizeValue` to theme system (`theme.sizes.alert`)
- ✅ Updated styles to use `theme.sizes.$alert` iterator pattern

**Intuitiveness Score: 9/10** (improved from 8/10)

---

### 3. Input

**AI Expectation:**
```typescript
{
  value?: string;
  onChange?: (value: string) => void;  // or onChangeText
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  variant?: 'outlined' | 'filled' | 'standard';
  intent?: Intent;
  size?: Size;
  leftIcon?: IconName;
  rightIcon?: IconName;
  error?: boolean | string;
  helperText?: string;
}
```

**Actual Props:**
```typescript
{
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  inputType?: InputInputType;  // ⚠️ Unusual name "InputInputType"
  type?: InputType;            // ⚠️ This is for styling, not input type!
  intent?: Intent;
  size?: Size;
  leftIcon?: IconName | ReactNode;
  rightIcon?: IconName | ReactNode;
  hasError?: boolean;          // ⚠️ Deprecated, but still exists
  secureTextEntry?: boolean;   // RN-specific
  showPasswordToggle?: boolean;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `inputType` vs `type` | 🔴 High | Very confusing! `type` is for styling, `inputType` is for keyboard. Should swap names or use `variant`/`inputMode` |
| `InputInputType` naming | 🟡 Medium | Redundant type name in exported types |
| `hasError` deprecated | 🟢 Low | Good that it's deprecated, but should be removed |
| Missing `error` string | 🟡 Medium | No way to display error message text |

**Intuitiveness Score: 5/10** ⚠️

---

### 4. Chip

**AI Expectation:**
```typescript
{
  label: string;
  variant?: 'filled' | 'outlined';
  intent?: Intent;         // or color
  size?: Size;
  icon?: IconName;
  deletable?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}
```

**Actual Props:**
```typescript
{
  label: string;
  type?: ChipType;         // 'filled' | 'outlined' | 'soft'
  intent?: Intent;
  size?: Size;
  icon?: IconName | ReactNode;
  deletable?: boolean;
  onDelete?: () => void;
  deleteIcon?: IconName | ReactNode;
  selectable?: boolean;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `type` naming | 🟡 Medium | Same pattern - should be `variant` |
| `onPress` vs `onClick` | 🟡 Medium | Consistency with web conventions |

**Intuitiveness Score: 8/10**

---

### 5. Card

**AI Expectation:**
```typescript
{
  children?: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  intent?: Intent;         // probably not expected on Card
  radius?: Radius;
  shadow?: ShadowVariant;  // for elevation
  onClick?: () => void;
  clickable?: boolean;
  padding?: Size;
}
```

**Actual Props:**
```typescript
{
  children?: ReactNode;
  type?: CardType;         // 'default' | 'outlined' | 'elevated' | 'filled'
  variant?: CardType;      // alias ✅
  intent?: Intent;
  radius?: CardRadiusVariant;
  clickable?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `type`/`variant` duality | 🟡 Medium | Good to have both, but `type` should be removed |
| No `shadow` prop | 🟡 Medium | Cards typically need shadow control separate from variant |
| No `padding` prop | 🟡 Medium | Card padding is common need |

**Intuitiveness Score: 8/10**

---

### 6. Checkbox

**AI Expectation:**
```typescript
{
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: Size;
  intent?: Intent;         // or color
  indeterminate?: boolean;
  error?: string;
}
```

**Actual Props:**
```typescript
{
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;  // ⚠️ Verbose
  disabled?: boolean;
  label?: string;
  children?: ReactNode;
  size?: Size;
  intent?: Intent;
  variant?: CheckboxVariant;
  indeterminate?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `onCheckedChange` | 🟡 Medium | Verbose; `onChange` is standard |
| `variant` vs `type` | 🟢 Good | Uses `variant` correctly here! Inconsistent with other components |

**Intuitiveness Score: 8/10**

---

### 7. Switch

**AI Expectation:**
```typescript
{
  checked?: boolean;       // or "on"/"value"
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: Size;
  intent?: Intent;
}
```

**Actual Props:**
```typescript
{
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  intent?: Intent;
  size?: Size;
  enabledIcon?: IconName | ReactNode;   // ✅ Nice feature
  disabledIcon?: IconName | ReactNode;  // ⚠️ Confusing name
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `onCheckedChange` | 🟡 Medium | Same verbosity issue |
| `disabledIcon` naming | 🔴 High | Ambiguous! Does "disabled" mean state=off or disabled=true? Should be `offIcon` |
| `enabledIcon` naming | 🟡 Medium | Should be `onIcon` for clarity |

**Intuitiveness Score: 7/10**

---

### 8. Select

**AI Expectation:**
```typescript
{
  options: Array<{ value: string; label: string; }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'outlined' | 'filled';
  intent?: Intent;
  size?: Size;
  searchable?: boolean;
  error?: boolean | string;
}
```

**Actual Props:**
```typescript
{
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;  // ⚠️ Inconsistent with Input
  placeholder?: string;
  disabled?: boolean;
  type?: SelectType;
  intent?: Intent;
  size?: Size;
  searchable?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  filterOption?: Function;
  presentationMode?: 'dropdown' | 'actionSheet';
  maxHeight?: number;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `onValueChange` vs `onChangeText` | 🟡 Medium | Inconsistent callback naming across form components |
| `type` naming | 🟡 Medium | Should be `variant` |
| `error` is boolean only | 🟡 Medium | Can't pass error message string |

**Intuitiveness Score: 7/10**

---

### 9. Dialog

**AI Expectation:**
```typescript
{
  open: boolean;
  onClose?: () => void;    // common pattern
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}
```

**Actual Props:**
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;  // ⚠️ Different pattern
  title?: string;
  children: ReactNode;
  size?: DialogSizeVariant;
  type?: DialogType;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `onOpenChange` vs `onClose` | 🟡 Medium | Two-way binding pattern is less common; `onClose` simpler |
| `closeOnBackdropClick` | 🟢 Good | Clear naming |
| No `intent` prop | 🟢 OK | Dialogs don't typically need intent |

**Intuitiveness Score: 8/10**

---

### 10. Progress

**AI Expectation:**
```typescript
{
  value?: number;          // 0-100
  variant?: 'linear' | 'circular';
  intent?: Intent;
  size?: Size;
  indeterminate?: boolean;
  showLabel?: boolean;
}
```

**Actual Props:**
```typescript
{
  value?: number;
  max?: number;            // ✅ Nice addition
  variant?: ProgressVariant;
  intent?: Intent;
  size?: Size;
  indeterminate?: boolean;
  showLabel?: boolean;
  label?: string;
  rounded?: boolean;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| Uses `variant` correctly | 🟢 Good | Unlike other components! |

**Intuitiveness Score: 9/10** ✅

---

### 11. Badge

**AI Expectation:**
```typescript
{
  children?: ReactNode;    // the count/label
  variant?: 'filled' | 'outlined' | 'dot';
  intent?: Intent;         // or color
  size?: Size;
}
```

**Actual Props:**
```typescript
{
  children?: ReactNode;
  size?: Size;
  type?: BadgeType;
  variant?: BadgeType;     // alias
  color?: Color;           // ⚠️ Uses Color, not Intent!
  icon?: IconName | ReactNode;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `color` vs `intent` | 🔴 High | Inconsistent with all other components that use `intent` |
| `type`/`variant` duality | 🟡 Medium | Same issue |

**Intuitiveness Score: 6/10** ⚠️

---

### 12. Text

**AI Expectation:**
```typescript
{
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'body1' | 'caption' | etc;  // or "as"
  color?: TextColor;
  weight?: 'light' | 'normal' | 'medium' | 'bold';
  align?: 'left' | 'center' | 'right';
  size?: Size;             // maybe not expected
}
```

**Actual Props:**
```typescript
{
  children: ReactNode;
  typography?: TextTypographyVariant;  // ✅ Clear name
  weight?: TextWeightVariant;
  color?: TextColorVariant;
  align?: TextAlignVariant;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `typography` vs `variant` | 🟡 Medium | More verbose but clearer; could be `variant` for consistency |
| No `size` shorthand | 🟢 OK | Typography handles this |

**Intuitiveness Score: 9/10** ✅

---

### 13. Divider

**AI Expectation:**
```typescript
{
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: Color;           // or intent
  thickness?: number;
}
```

**Actual Props:**
```typescript
{
  orientation?: DividerOrientationVariant;
  type?: DividerType;      // solid | dashed | dotted
  thickness?: DividerThicknessVariant;  // 'thin' | 'md' | 'thick'
  intent?: Intent;
  length?: DividerLengthVariant;
  spacing?: DividerSpacingVariant;
  children?: ReactNode;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `type` naming | 🟡 Medium | Should be `variant` |
| `thickness` values | 🟡 Medium | `thin/md/thick` is unusual; `1/2/3` or `sm/md/lg` more expected |

**Intuitiveness Score: 7/10**

---

### 14. Avatar

**AI Expectation:**
```typescript
{
  src?: string;
  alt?: string;
  fallback?: string;       // initials
  size?: Size;
  shape?: 'circle' | 'square';
  color?: Color;           // background color for fallback
}
```

**Actual Props:**
```typescript
{
  src?: string | ImageSourcePropType;
  alt?: string;
  fallback?: string;
  size?: AvatarSizeVariant;  // 'sm' | 'md' | 'lg' | 'xl' - missing 'xs'!
  shape?: AvatarShapeVariant;
  color?: Color;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| Missing `xs` size | 🟡 Medium | Other components have `xs`, Avatar doesn't |
| Uses `color` not `intent` | 🟢 OK | For Avatar, `color` makes more sense |

**Intuitiveness Score: 9/10** ✅

---

### 15. Slider

**AI Expectation:**
```typescript
{
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  intent?: Intent;
  size?: Size;
  showValue?: boolean;
  marks?: Array<{ value: number; label?: string }>;
}
```

**Actual Props:**
```typescript
{
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  marks?: SliderMark[];
  intent?: Intent;
  size?: Size;
  icon?: IconName | ReactNode;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;  // ✅ Nice distinction
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `onValueChange` vs `onChange` | 🟡 Medium | Verbose but descriptive |

**Intuitiveness Score: 9/10** ✅

---

### 16. Menu

**AI Expectation:**
```typescript
{
  trigger: ReactNode;      // or children for trigger
  items: MenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}
```

**Actual Props:**
```typescript
{
  children: ReactNode;     // the trigger
  items: MenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: MenuPlacement;
  closeOnSelection?: boolean;
  size?: Size;
}
```

**Issues Found:**
| Issue | Severity | Description |
|-------|----------|-------------|
| `children` as trigger | 🟡 Medium | Works but `trigger` prop more explicit |

**Intuitiveness Score: 8/10**

---

## Summary: Major Issues Across Components

### ✅ Resolved Issues

1. **Button `title` prop removed** - Use `children` for content
2. **Button `variant` alias removed** - Use `type` consistently
3. **Button `onClick` deprecated** - Added with warning, use `onPress`
4. **Alert `size` prop added** - Full theme integration with `theme.sizes.$alert` iterator

### 🔴 Critical Issues (Remaining)

1. **`color` vs `intent` inconsistency**
   - Badge uses `color`, everything else uses `intent`
   - **Recommendation**: Use `intent` for semantic colors, `color` for raw palette colors

2. **Switch icon naming (`enabledIcon`/`disabledIcon`)**
   - "disabled" is ambiguous (state vs disabled prop)
   - **Recommendation**: Rename to `onIcon`/`offIcon`

3. **Input `type` vs `inputType` confusion**
   - `type` controls styling, `inputType` controls keyboard
   - This is backwards from user expectations
   - **Recommendation**: Rename `inputType`→`type`, keep `type` for styling

### 🟡 Medium Issues

1. **Callback naming inconsistency**
   - `onChange` vs `onChangeText` vs `onValueChange` vs `onCheckedChange`
   - **Recommendation**: Standardize on `onChange(value)` or `on[Prop]Change(value)`

2. **`dismissible`/`onDismiss` vs `closable`/`onClose`**
   - Less common terms
   - **Recommendation**: Use `closable`/`onClose`

3. **Missing `size` on some components**
   - ~~Alert~~, Dialog don't have standard Size
   - **Recommendation**: Consider adding for consistency

4. **Components with `variant` instead of `type`**
   - Checkbox, Progress use `variant` - should use `type` for consistency
   - **Recommendation**: Change to `type`

### 🟢 Positive Patterns

1. **`leftIcon`/`rightIcon`** - Clear and descriptive
2. **`intent` prop** - Consistent semantic coloring (mostly)
3. **`size` prop** - Consistent sizing system
4. **`type` prop** - Established pattern for visual style
5. **`onPress` prop** - Mobile-first interaction pattern
6. **`onValueCommit` on Slider** - Nice distinction from onChange

---

## Recommended Changes Priority

| Priority | Change | Components Affected |
|----------|--------|---------------------|
| ~~P0~~ | ~~Rename `type` → `variant`~~ | **DECIDED: Keep `type`** |
| ~~P1~~ | ~~Button `title`→`label`~~ | **DONE: Removed `title`** |
| ~~P3~~ | ~~Add `onClick` alias~~ | **DONE: Added as deprecated** |
| P0 | Rename Input `inputType`→`type` (for keyboard type) | Input |
| P0 | Rename Switch `enabledIcon`→`onIcon`, `disabledIcon`→`offIcon` | Switch |
| P1 | Change Checkbox/Progress `variant`→`type` | Checkbox, Progress |
| P1 | Standardize Badge to use `intent` not `color` | Badge |
| P1 | Rename `dismissible`→`closable`, `onDismiss`→`onClose` | Alert |
| P2 | Standardize callbacks: `onChange`, `onValueChange`, etc. | All form components |
| ~~P2~~ | ~~Add `size` to Alert~~ | **DONE: Full theme integration** |

---

## Intuitiveness Scores Summary

| Component | Score | Status |
|-----------|-------|--------|
| Progress | 9/10 | ✅ Excellent |
| Text | 9/10 | ✅ Excellent |
| Avatar | 9/10 | ✅ Excellent |
| Slider | 9/10 | ✅ Excellent |
| Alert | 9/10 | ✅ Excellent (updated) |
| Chip | 8/10 | Good |
| Card | 8/10 | Good |
| Checkbox | 8/10 | Good |
| Dialog | 8/10 | Good |
| Menu | 8/10 | Good |
| Button | 7/10 | Needs work |
| Switch | 7/10 | Needs work |
| Select | 7/10 | Needs work |
| Divider | 7/10 | Needs work |
| Badge | 6/10 | ⚠️ Significant issues |
| Input | 5/10 | ⚠️ Major confusion |

**Overall Average: 7.8/10**

---

*Review conducted by Claude (AI Agent) - January 2026*
