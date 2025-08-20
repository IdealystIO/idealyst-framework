# Badge Component

A versatile badge component for displaying status, counts, or indicators with multiple visual styles.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Multiple sizes (small, medium, large)
- ✅ Three variants (filled, outlined, dot)
- ✅ Color scheme support with theme integration
- ✅ Accessible with proper ARIA roles
- ✅ TypeScript support

## Basic Usage

```tsx
import { Badge } from '@idealyst/components';

// Basic filled badge
<Badge color="blue">5</Badge>

// Outlined badge
<Badge variant="outlined" color="green">New</Badge>

// Dot indicator
<Badge variant="dot" color="red" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display inside the badge (not used for dot variant) |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the badge |
| `variant` | `'filled' \| 'outlined' \| 'dot'` | `'filled'` | Visual style variant |
| `color` | `DisplayColorVariant` | `'blue'` | Color scheme for the badge |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier for testing |

## Variants

### Filled Badge
The default variant with a solid background color.

```tsx
<Badge variant="filled" color="blue">3</Badge>
<Badge variant="filled" color="green">New</Badge>
<Badge variant="filled" color="red">!</Badge>
```

### Outlined Badge
A badge with a border and transparent background.

```tsx
<Badge variant="outlined" color="blue">Draft</Badge>
<Badge variant="outlined" color="amber">Pending</Badge>
<Badge variant="outlined" color="gray">Inactive</Badge>
```

### Dot Badge
A small circular indicator without text content.

```tsx
<Badge variant="dot" color="red" />
<Badge variant="dot" color="green" />
<Badge variant="dot" color="blue" />
```

## Sizes

| Size | Description | Use Case |
|------|-------------|----------|
| `small` | Compact size | Inline indicators, tight spaces |
| `medium` | Standard size | General use, notifications |
| `large` | Prominent size | Important status, emphasis |

```tsx
<Badge size="small" color="blue">1</Badge>
<Badge size="medium" color="blue">10</Badge>
<Badge size="large" color="blue">99+</Badge>
```

## Color Variants

The badge supports various color schemes from the theme system:

```tsx
<Badge color="blue">Primary</Badge>
<Badge color="green">Success</Badge>
<Badge color="red">Error</Badge>
<Badge color="amber">Warning</Badge>
<Badge color="gray">Neutral</Badge>
<Badge color="cyan">Info</Badge>
<Badge color="purple">Purple</Badge>
<Badge color="pink">Pink</Badge>
```

## Common Use Cases

### Notification Count
```tsx
<View style={{ position: 'relative' }}>
  <Icon name="bell" />
  <Badge 
    size="small" 
    color="red" 
    style={{ position: 'absolute', top: -5, right: -5 }}
  >
    3
  </Badge>
</View>
```

### Status Indicator
```tsx
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Text>Server Status</Text>
  <Badge variant="dot" color="green" />
</View>
```

### Category Labels
```tsx
<View style={{ flexDirection: 'row', gap: 8 }}>
  <Badge variant="outlined" color="blue">React</Badge>
  <Badge variant="outlined" color="green">TypeScript</Badge>
  <Badge variant="outlined" color="purple">UI</Badge>
</View>
```

### Priority Indicators
```tsx
<Badge variant="filled" color="red" size="small">High</Badge>
<Badge variant="filled" color="amber" size="small">Medium</Badge>
<Badge variant="filled" color="gray" size="small">Low</Badge>
```

## Accessibility

- Uses `role="status"` for screen readers
- Dot variant includes `aria-label="status indicator"`
- Proper contrast ratios for text visibility
- Keyboard accessible when interactive

## Styling

```tsx
// Custom positioning for notification badges
<Badge 
  color="red" 
  style={{ 
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    minHeight: 20
  }}
>
  {notificationCount}
</Badge>
```

## Best Practices

1. **Keep text short** - Use abbreviations or symbols for long text
2. **Use appropriate colors** - Red for errors/urgent, green for success, etc.
3. **Consider accessibility** - Ensure sufficient contrast for text badges
4. **Position carefully** - For overlay badges, ensure they don't obscure important content
5. **Limit usage** - Don't overuse badges as they can create visual clutter
6. **Use dot variant** for simple status indicators without text