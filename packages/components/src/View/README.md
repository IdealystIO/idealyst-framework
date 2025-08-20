# View Component

A flexible container component with built-in spacing and styling options.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Built-in spacing system
- ✅ Background color variants
- ✅ Flexible layout options
- ✅ Theme integration
- ✅ TypeScript support

## Basic Usage

```tsx
import { View, Text } from '@idealyst/components';

// Basic view
<View>
  <Text>Content inside view</Text>
</View>

// View with spacing
<View spacing="lg">
  <Text>First item</Text>
  <Text>Second item</Text>
  <Text>Third item</Text>
</View>

// Styled view
<View 
  spacing="md"
  background="secondary"
  style={{ padding: 16, borderRadius: 8 }}
>
  <Text>Styled content</Text>
</View>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display inside the view |
| `spacing` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | - | Gap between child elements |
| `background` | `BackgroundVariant` | - | Background color variant |
| `style` | `ViewStyle` | - | Additional custom styles |

## Spacing System

The spacing prop adds consistent gaps between child elements:

| Spacing | Value | Use Case |
|---------|-------|----------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Small spacing |
| `md` | 16px | Medium spacing |
| `lg` | 24px | Large spacing |
| `xl` | 32px | Extra large spacing |
| `xxl` | 48px | Extra extra large spacing |

## Examples

### Vertical Lists
```tsx
<View spacing="md">
  <Text size="large" weight="bold">Settings</Text>
  <Text>Profile Settings</Text>
  <Text>Notification Settings</Text>
  <Text>Privacy Settings</Text>
</View>
```

### Card Content
```tsx
<Card>
  <View spacing="sm">
    <Text size="large" weight="bold">Card Title</Text>
    <Text color="secondary">Card subtitle</Text>
    <Text>Card content goes here with proper spacing between elements.</Text>
  </View>
</Card>
```

### Form Layout
```tsx
<View spacing="lg">
  <Input label="Name" value={name} onChangeText={setName} />
  <Input label="Email" value={email} onChangeText={setEmail} />
  <Button onPress={handleSubmit}>Submit</Button>
</View>
```

### Nested Views
```tsx
<View spacing="xl">
  <View spacing="sm">
    <Text size="large" weight="bold">Section 1</Text>
    <Text>Content for section 1</Text>
  </View>
  <View spacing="sm">
    <Text size="large" weight="bold">Section 2</Text>
    <Text>Content for section 2</Text>
  </View>
</View>
```