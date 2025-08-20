# Divider Component

A flexible separator component for creating visual divisions between content sections.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Horizontal and vertical orientations
- ✅ Spacing variants (small, medium, large)
- ✅ Intent-based color schemes
- ✅ Optional content/children support
- ✅ TypeScript support

## Basic Usage

```tsx
import { Divider, Text } from '@idealyst/components';

// Basic horizontal divider
<Divider />

// Divider with spacing
<Divider spacing="large" />

// Vertical divider
<Divider orientation="vertical" />

// Divider with content
<Divider spacing="medium">
  <Text size="small" color="secondary">OR</Text>
</Divider>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Optional content to display in the divider |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the divider |
| `spacing` | `'small' \| 'medium' \| 'large'` | `'medium'` | Spacing around the divider |
| `intent` | `IntentVariant` | `'neutral'` | Color scheme of the divider |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Visual style of the line |
| `thickness` | `'thin' \| 'medium' \| 'thick'` | `'thin'` | Thickness of the divider line |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier for testing |

## Examples

### Basic Dividers
```tsx
<View>
  <Text>Content above</Text>
  <Divider />
  <Text>Content below</Text>
</View>
```

### Spacing Variants
```tsx
<View>
  <Text>Small spacing</Text>
  <Divider spacing="small" />
  <Text>Medium spacing</Text>
  <Divider spacing="medium" />
  <Text>Large spacing</Text>
  <Divider spacing="large" />
  <Text>End content</Text>
</View>
```

### Vertical Dividers
```tsx
<View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
  <Text>Left</Text>
  <Divider orientation="vertical" spacing="medium" />
  <Text>Middle</Text>
  <Divider orientation="vertical" spacing="medium" />
  <Text>Right</Text>
</View>
```

### Dividers with Content
```tsx
<View>
  <Text>Sign in with your account</Text>
  <Divider spacing="large">
    <Text size="small" color="secondary">OR</Text>
  </Divider>
  <Text>Continue with social login</Text>
</View>
```

### Styled Dividers
```tsx
<View>
  <Divider variant="solid" intent="neutral" />
  <Divider variant="dashed" intent="primary" />
  <Divider variant="dotted" intent="secondary" />
</View>
```

## Best Practices

1. **Use appropriate spacing** - Match divider spacing to your content hierarchy
2. **Consider orientation** - Use vertical dividers in horizontal layouts
3. **Keep content minimal** - If using children, keep text short and meaningful
4. **Maintain consistency** - Use the same divider style throughout your app
5. **Accessibility** - Ensure dividers don't interfere with screen reader flow