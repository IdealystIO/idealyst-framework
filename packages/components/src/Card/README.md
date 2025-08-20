# Card Component

A flexible container component for displaying content in a visually grouped format with various styling options.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Multiple variants (default, outlined, elevated, filled)
- ✅ Configurable padding and border radius
- ✅ Intent-based color schemes
- ✅ Clickable/interactive support
- ✅ Disabled state handling
- ✅ Accessible with proper ARIA attributes
- ✅ TypeScript support

## Basic Usage

```tsx
import { Card, Text } from '@idealyst/components';

// Basic card
<Card>
  <Text size="large" weight="bold">Card Title</Text>
  <Text>Card content goes here</Text>
</Card>

// Clickable card
<Card 
  clickable 
  onPress={() => console.log('Card pressed!')}
>
  <Text>Click me!</Text>
</Card>

// Elevated card with custom styling
<Card 
  variant="elevated" 
  padding="large"
  radius="large"
>
  <Text>Elevated card content</Text>
</Card>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display inside the card |
| `variant` | `'default' \| 'outlined' \| 'elevated' \| 'filled'` | `'default'` | Visual style variant |
| `padding` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Internal padding size |
| `radius` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Border radius size |
| `intent` | `IntentVariant` | `'neutral'` | Color scheme/intent |
| `clickable` | `boolean` | `false` | Whether the card is interactive |
| `onPress` | `() => void` | - | Function called when card is pressed (requires clickable) |
| `disabled` | `boolean` | `false` | Whether the card is disabled |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier for testing |
| `accessibilityLabel` | `string` | - | Accessibility label for screen readers |

## Variants

### Default Card
Basic card with subtle background.

```tsx
<Card variant="default">
  <Text>Default card content</Text>
</Card>
```

### Outlined Card
Card with border and transparent background.

```tsx
<Card variant="outlined">
  <Text>Outlined card content</Text>
</Card>
```

### Elevated Card
Card with shadow/elevation for depth.

```tsx
<Card variant="elevated">
  <Text>Elevated card content</Text>
</Card>
```

### Filled Card
Card with solid background color.

```tsx
<Card variant="filled" intent="primary">
  <Text>Filled card content</Text>
</Card>
```

## Padding Options

| Padding | Value | Use Case |
|---------|-------|----------|
| `none` | 0px | Custom content padding |
| `small` | 8px | Compact cards |
| `medium` | 16px | Standard cards |
| `large` | 24px | Spacious cards |

```tsx
<Card padding="none">No padding</Card>
<Card padding="small">Small padding</Card>
<Card padding="medium">Medium padding</Card>
<Card padding="large">Large padding</Card>
```

## Border Radius Options

| Radius | Value | Use Case |
|--------|-------|----------|
| `none` | 0px | Sharp corners |
| `small` | 4px | Subtle rounding |
| `medium` | 8px | Standard rounding |
| `large` | 16px | Prominent rounding |

```tsx
<Card radius="none">Sharp corners</Card>
<Card radius="small">Subtle corners</Card>
<Card radius="medium">Standard corners</Card>
<Card radius="large">Rounded corners</Card>
```

## Intent Colors

```tsx
<Card intent="primary">Primary themed card</Card>
<Card intent="neutral">Neutral themed card</Card>
<Card intent="success">Success themed card</Card>
<Card intent="error">Error themed card</Card>
<Card intent="warning">Warning themed card</Card>
```

## Interactive Cards

### Clickable Cards
```tsx
<Card 
  clickable
  onPress={() => navigation.navigate('Details')}
  accessibilityLabel="Navigate to details"
>
  <Text size="large" weight="bold">Product Title</Text>
  <Text>Tap to view details</Text>
</Card>
```

### Disabled Cards
```tsx
<Card 
  clickable
  disabled
  onPress={() => {}}
>
  <Text>This card is disabled</Text>
</Card>
```

## Common Use Cases

### Content Cards
```tsx
<Card variant="outlined" padding="large">
  <Text size="large" weight="bold">Article Title</Text>
  <Text size="small" color="secondary">Published 2 hours ago</Text>
  <Text style={{ marginTop: 8 }}>
    Article content preview...
  </Text>
</Card>
```

### Action Cards
```tsx
<Card 
  variant="elevated"
  clickable
  onPress={handleAction}
  style={{ alignItems: 'center' }}
>
  <Icon name="plus" size={32} />
  <Text weight="medium">Add New Item</Text>
</Card>
```

### Status Cards
```tsx
<Card variant="filled" intent="success" padding="small">
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Icon name="check" color="white" />
    <Text color="white" weight="medium">Task Completed</Text>
  </View>
</Card>
```

### Grid Layout
```tsx
<View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
  <Card 
    variant="outlined" 
    style={{ flex: 1, minWidth: 200 }}
    clickable
    onPress={() => {}}
  >
    <Text weight="bold">Card 1</Text>
    <Text>Content 1</Text>
  </Card>
  <Card 
    variant="outlined" 
    style={{ flex: 1, minWidth: 200 }}
    clickable
    onPress={() => {}}
  >
    <Text weight="bold">Card 2</Text>
    <Text>Content 2</Text>
  </Card>
</View>
```

## Accessibility

- Automatically uses appropriate HTML elements (`div` vs `button`)
- Proper ARIA roles and labels
- Keyboard navigation support for clickable cards
- Focus management and visual indicators
- Screen reader compatibility

## Styling

```tsx
// Custom card styling
<Card 
  variant="outlined"
  style={{
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  }}
>
  <Text>Custom styled card</Text>
</Card>
```

## Best Practices

1. **Use consistent variants** - Stick to one variant family in a section
2. **Mind content hierarchy** - Use padding and spacing to create visual hierarchy
3. **Consider interaction** - Make clickable cards visually distinct
4. **Accessibility first** - Always provide proper labels for interactive cards
5. **Performance** - Avoid complex nested structures in large lists
6. **Responsive design** - Test cards across different screen sizes
7. **Intent consistency** - Use intent colors meaningfully, not decoratively