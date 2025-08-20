# Text Component

A comprehensive text component with extensive styling options and theme integration.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Multiple sizes and weights
- ✅ Color variants and intent-based colors
- ✅ Text alignment options
- ✅ Theme integration
- ✅ TypeScript support

## Basic Usage

```tsx
import { Text } from '@idealyst/components';

// Basic text
<Text>Hello World</Text>

// Styled text
<Text 
  size="large" 
  weight="bold" 
  color="primary"
  align="center"
>
  Welcome to the App
</Text>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Text content to display |
| `size` | `'small' \| 'medium' \| 'large' \| 'xlarge'` | `'medium'` | Font size |
| `weight` | `'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'normal'` | Font weight |
| `color` | `ColorVariant \| string` | - | Text color |
| `intent` | `IntentVariant` | - | Intent-based color scheme |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |
| `style` | `TextStyle` | - | Additional custom styles |

## Size Options

| Size | Font Size | Use Case |
|------|-----------|----------|
| `small` | 12px | Captions, helper text |
| `medium` | 14px | Body text, standard content |
| `large` | 16px | Headings, important text |
| `xlarge` | 20px | Page titles, feature headings |

## Weight Options

- `light` - Light font weight
- `normal` - Regular font weight (default)
- `medium` - Medium font weight
- `semibold` - Semi-bold font weight
- `bold` - Bold font weight

## Examples

### Headings
```tsx
<Text size="xlarge" weight="bold">Page Title</Text>
<Text size="large" weight="semibold">Section Heading</Text>
<Text size="medium" weight="medium">Subsection</Text>
```

### Body Text
```tsx
<Text size="medium">
  This is regular body text with normal weight and medium size.
</Text>
<Text size="small" color="secondary">
  This is caption text with smaller size and secondary color.
</Text>
```

### Intent Colors
```tsx
<Text intent="success">Success message</Text>
<Text intent="error">Error message</Text>
<Text intent="warning">Warning message</Text>
<Text intent="primary">Primary text</Text>
```

### Alignment
```tsx
<Text align="left">Left aligned text</Text>
<Text align="center">Center aligned text</Text>
<Text align="right">Right aligned text</Text>
```