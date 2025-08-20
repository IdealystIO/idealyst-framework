# Icon Component

A versatile icon component with extensive icon library and theming support.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Extensive icon library
- ✅ Multiple sizes and color options
- ✅ Intent-based color schemes
- ✅ TypeScript support with icon name validation

## Basic Usage

```tsx
import { Icon } from '@idealyst/components';

// Basic icon
<Icon name="heart" />

// Sized and colored icon
<Icon 
  name="star" 
  size={24} 
  color="primary" 
/>

// Icon with intent color
<Icon 
  name="check-circle" 
  size="large" 
  intent="success" 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `IconName` | **Required** | Name of the icon to display |
| `size` | `number \| 'small' \| 'medium' \| 'large' \| 'xlarge'` | `'medium'` | Size of the icon |
| `color` | `string \| ColorVariant` | - | Color of the icon |
| `intent` | `IntentVariant` | - | Intent-based color scheme |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier for testing |

## Size Options

| Size | Value | Use Case |
|------|-------|----------|
| `small` | 16px | Inline text, compact UI |
| `medium` | 20px | Standard buttons, form elements |
| `large` | 24px | Section headers, prominent actions |
| `xlarge` | 32px | Feature highlights, empty states |

## Common Icons

Popular icon names include:
- `heart`, `star`, `bookmark`
- `check`, `x`, `plus`, `minus`
- `chevron-left`, `chevron-right`, `chevron-up`, `chevron-down`
- `home`, `user`, `settings`, `search`
- `bell`, `mail`, `calendar`, `file`
- `edit`, `delete`, `copy`, `share`

## Examples

### Button Icons
```tsx
<Button>
  <Icon name="plus" size="small" color="white" />
  Add Item
</Button>
```

### Status Icons
```tsx
<Icon name="check-circle" intent="success" size="large" />
<Icon name="x-circle" intent="error" size="large" />
<Icon name="alert-triangle" intent="warning" size="large" />
```