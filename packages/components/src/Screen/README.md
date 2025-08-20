# Screen Component

A full-screen container component designed for app screens with theme-based backgrounds and safe area handling.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Theme-based background colors
- ✅ Safe area support for mobile devices
- ✅ Configurable padding options
- ✅ Flexible content layout
- ✅ TypeScript support

## Basic Usage

```tsx
import { Screen, View, Text } from '@idealyst/components';

// Basic screen
<Screen>
  <Text>Screen content</Text>
</Screen>

// Screen with background and padding
<Screen 
  background="primary" 
  padding="lg"
  safeArea
>
  <View spacing="md">
    <Text size="large" weight="bold">Welcome</Text>
    <Text>This is a screen with safe area support</Text>
  </View>
</Screen>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display in the screen |
| `background` | `'primary' \| 'secondary' \| 'tertiary' \| 'inverse'` | `'primary'` | Background color variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Screen padding |
| `safeArea` | `boolean` | `false` | Enable safe area padding |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier for testing |

## Background Variants

- `primary` - Main app background (usually light/dark based on theme)
- `secondary` - Secondary background color
- `tertiary` - Tertiary background for depth
- `inverse` - Contrasting background color

## Examples

### App Screens
```tsx
// Home screen
<Screen background="primary" safeArea>
  <View spacing="lg">
    <Text size="xlarge" weight="bold">Dashboard</Text>
    {/* Screen content */}
  </View>
</Screen>

// Settings screen
<Screen background="secondary" padding="lg">
  <Text size="large" weight="bold">Settings</Text>
  {/* Settings content */}
</Screen>
```

### Modal Screens
```tsx
<Screen 
  background="inverse" 
  padding="xl"
  style={{ 
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16 
  }}
>
  <Text size="large" weight="bold">Modal Content</Text>
</Screen>
```