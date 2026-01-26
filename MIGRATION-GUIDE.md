# Idealyst Components - Props Migration Guide

This document outlines all prop changes made during the AI Agent Props Intuitiveness Review.

## Summary of Changes

The following components have breaking prop changes that require updates in consuming applications:

| Component | Changes |
|-----------|---------|
| Checkbox | `onCheckedChange` → `onChange` |
| Switch | `onCheckedChange` → `onChange`, `enabledIcon` → `onIcon`, `disabledIcon` → `offIcon` |
| Select | `onValueChange` → `onChange` |
| Dialog | `onOpenChange` → `onClose` (signature changed) |
| Progress | `variant` → `type` |
| Divider | `thickness` → `size` (values changed) |
| Slider | `onValueChange` → `onChange`, `onValueCommit` → `onChangeCommit` |
| Avatar | Added `xs` size (non-breaking) |
| Badge | Added `intent` prop (non-breaking) |
| Button | Added deprecated `onClick` prop (non-breaking) |
| Card | Added deprecated `onClick` prop (non-breaking) |
| Chip | Added deprecated `onClick` prop (non-breaking) |

---

## Detailed Migration Instructions

### Checkbox

**Before:**
```tsx
<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>
```

**After:**
```tsx
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
/>
```

---

### Switch

**Before:**
```tsx
<Switch
  checked={isOn}
  onCheckedChange={setIsOn}
  enabledIcon="check"
  disabledIcon="close"
/>
```

**After:**
```tsx
<Switch
  checked={isOn}
  onChange={setIsOn}
  onIcon="check"
  offIcon="close"
/>
```

**Note:** The icon prop names were changed from `enabledIcon`/`disabledIcon` to `onIcon`/`offIcon` to avoid confusion with the `disabled` prop.

---

### Select

**Before:**
```tsx
<Select
  options={options}
  value={selectedValue}
  onValueChange={setSelectedValue}
/>
```

**After:**
```tsx
<Select
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
/>
```

---

### Dialog

**Before:**
```tsx
const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onOpenChange={setOpen}
>
  {/* content */}
</Dialog>
```

**After:**
```tsx
const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onClose={() => setOpen(false)}
>
  {/* content */}
</Dialog>
```

**Note:** The callback signature changed from `(open: boolean) => void` to `() => void`. The dialog only calls `onClose` when it should be closed.

---

### Progress

**Before:**
```tsx
<Progress
  value={50}
  variant="circular"
/>
```

**After:**
```tsx
<Progress
  value={50}
  type="circular"
/>
```

---

### Divider

**Before:**
```tsx
<Divider
  thickness="thin"   // or "md" or "thick"
/>
```

**After:**
```tsx
<Divider
  size="sm"   // xs, sm, md, lg, xl
/>
```

**Size to Thickness Mapping:**
| Old `thickness` | New `size` | Pixels |
|-----------------|------------|--------|
| `thin` | `xs` or `sm` | 1px |
| `md` | `md` | 2px |
| `thick` | `lg` or `xl` | 3-4px |

---

### Slider

**Before:**
```tsx
<Slider
  value={value}
  onValueChange={setValue}
  onValueCommit={handleCommit}
/>
```

**After:**
```tsx
<Slider
  value={value}
  onChange={setValue}
  onChangeCommit={handleCommit}
/>
```

---

## Non-Breaking Additions

### Avatar - Added `xs` size

The Avatar component now supports the `xs` size variant for consistency with other components.

```tsx
<Avatar size="xs" src={avatarUrl} />
```

### Badge - Added `intent` prop

Badge now supports both `intent` (semantic colors) and `color` (raw palette colors).

```tsx
// Using intent (recommended for semantic meaning)
<Badge intent="success">Active</Badge>
<Badge intent="danger">Expired</Badge>

// Using color (for custom styling)
<Badge color="purple.500">Custom</Badge>
```

**Note:** Only one of `intent` or `color` should be used at a time. If both are provided, `intent` takes precedence.

### Button, Card, Chip - Deprecated `onClick`

These components now accept `onClick` as a deprecated alias for `onPress`. Using `onClick` will log a console warning in development.

```tsx
// This works but shows a deprecation warning
<Button onClick={() => {}} />
<Chip label="Tag" onClick={() => {}} />

// Preferred approach
<Button onPress={() => {}} />
<Chip label="Tag" onPress={() => {}} />
```

### Card - Removed `clickable` prop

The `clickable` prop has been removed from Card. Cards are now automatically pressable when an `onPress` handler is provided.

```tsx
// Old way (no longer works)
<Card clickable onPress={() => {}} />

// New way - just provide onPress
<Card onPress={() => {}} />
```

---

## Search & Replace Patterns

For quick migration, use these search/replace patterns in your codebase:

```bash
# Checkbox/Switch
onCheckedChange= → onChange=

# Switch icons
enabledIcon= → onIcon=
disabledIcon= → offIcon=

# Select
onValueChange= → onChange=

# Dialog (manual review needed for signature change)
onOpenChange= → onClose=

# Progress
variant="linear" → type="linear"
variant="circular" → type="circular"

# Divider
thickness="thin" → size="sm"
thickness="md" → size="md"
thickness="thick" → size="lg"

# Slider
onValueChange= → onChange=
onValueCommit= → onChangeCommit=
```

---

## TypeScript Type Changes

If you're importing types directly, note these renames:

| Old Type | New Type |
|----------|----------|
| `ProgressVariant` | `ProgressType` |
| `DividerThicknessVariant` | `DividerSizeVariant` |

---

*Migration guide generated January 2026*
