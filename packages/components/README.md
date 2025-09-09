# @idealyst/components

A comprehensive, cross-platform component library for React and React Native applications. Built with TypeScript and powered by [react-native-unistyles](https://github.com/jpudysz/react-native-unistyles) for consistent styling across platforms.

[![npm version](https://badge.fury.io/js/@idealyst%2Fcomponents.svg)](https://badge.fury.io/js/@idealyst%2Fcomponents)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🌐 **Cross-Platform**: Works seamlessly in React and React Native
- 🎨 **Design System**: Comprehensive theming with light/dark mode support
- 📱 **Responsive**: Adaptive components that work on all screen sizes
- ♿ **Accessible**: Built with accessibility best practices
- 🔧 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🎯 **Intent-Based**: Semantic color system for consistent UX
- 🚀 **Production Ready**: Optimized for performance and developer experience

## Installation

```bash
# Using yarn (recommended)
yarn add @idealyst/components

# Using npm
npm install @idealyst/components
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
# Core dependencies
yarn add react react-native-unistyles

# For React Native projects
yarn add react-native @react-native/normalize-colors react-native-edge-to-edge react-native-nitro-modules

# For React/Web projects  
yarn add react

# For SVG support (optional)
yarn add react-native-svg react-native-svg-transformer
```

## Quick Start

```tsx
import React from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';

export default function App() {
  return (
    <Screen background="primary">
      <View spacing="lg" style={{ flex: 1, justifyContent: 'center' }}>
        <Text size="large" weight="bold" align="center">
          Welcome to Idealyst Components
        </Text>
        <Button
          variant="contained"
          intent="primary"
          onPress={() => console.log('Button pressed!')}
        >
          Get Started
        </Button>
      </View>
    </Screen>
  );
}
```

## Available Components

The library includes 14 core components organized by category:

### Layout Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **[View](src/View/README.md)** | Flexible container with built-in spacing system | `spacing`, `style` |
| **[Screen](src/Screen/README.md)** | Full-screen container with safe area support | `background`, `safeArea`, `padding` |
| **[Divider](src/Divider/README.md)** | Separator for content sections | `orientation`, `spacing`, `intent` |

### Typography

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **[Text](src/Text/README.md)** | Versatile text with extensive styling options | `size`, `weight`, `color`, `align`, `intent` |

### Form Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **[Button](src/Button/README.md)** | Customizable button with variants and intents | `variant`, `intent`, `size`, `onPress` |
| **[Input](src/Input/README.md)** | Text input with validation and styling | `label`, `placeholder`, `error`, `onChangeText` |
| **[Checkbox](src/Checkbox/README.md)** | Checkbox with label support | `checked`, `onCheckedChange`, `label` |

### Display Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **[Card](src/Card/README.md)** | Container for grouped content | `variant`, `padding`, `clickable`, `intent` |
| **[Badge](src/Badge/README.md)** | Status indicators and count displays | `variant`, `color`, `size` |
| **[Avatar](src/Avatar/README.md)** | User profile pictures with fallback | `src`, `fallback`, `size`, `shape` |

### Utility Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **[Icon](src/Icon/README.md)** | Icon library with extensive options | `name`, `size`, `color`, `intent` |
| **[SVGImage](src/SVGImage/README.md)** | SVG rendering with cross-platform support | `source`, `width`, `height`, `color`, `intent` |

### Overlay Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| **[Dialog](src/Dialog/README.md)** | Modal dialogs with customizable content | `open`, `onOpenChange`, `title`, `size` |
| **[Popover](src/Popover/README.md)** | Contextual overlays and tooltips | `open`, `anchor`, `placement`, `content` |

## Usage Examples

### Basic Layout
```tsx
import { Screen, View, Text, Button } from '@idealyst/components';

<Screen background="primary" safeArea>
  <View spacing="lg">
    <Text size="xlarge" weight="bold">Welcome</Text>
    <Text>Get started with your app</Text>
    <Button variant="contained" intent="primary" onPress={() => {}}>
      Get Started
    </Button>
  </View>
</Screen>
```

### Form Example
```tsx
import { View, Text, Input, Checkbox, Button } from '@idealyst/components';

<View spacing="md">
  <Text size="large" weight="bold">Sign Up</Text>
  <Input label="Email" value={email} onChangeText={setEmail} />
  <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
  <Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree to terms" />
  <Button variant="contained" intent="primary" onPress={handleSubmit}>
    Create Account
  </Button>
</View>
```

### SVG Icons
```tsx
import { SVGImage, View, Text } from '@idealyst/components';
import LogoIcon from './assets/logo.svg';

<View spacing="md">
  <Text size="large" weight="bold">My App</Text>
  
  {/* Imported SVG */}
  <SVGImage source={LogoIcon} size={40} intent="primary" />
  
  {/* Remote SVG */}
  <SVGImage 
    source={{ uri: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg" }}
    size={24}
    color="#61dafb"
  />
</View>
```

### Card Grid
```tsx
import { View, Card, Text, Avatar, Badge } from '@idealyst/components';

<View spacing="md">
  {items.map(item => (
    <Card key={item.id} clickable onPress={() => navigate(item)}>
      <View spacing="sm" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar src={item.avatar} fallback={item.initials} />
        <View spacing="xs" style={{ flex: 1 }}>
          <Text weight="bold">{item.title}</Text>
          <Text size="small" color="secondary">{item.subtitle}</Text>
        </View>
        {item.badge && <Badge color="red">{item.badge}</Badge>}
      </View>
    </Card>
  ))}
</View>
```

## Theme System

The library includes a comprehensive theme system with light and dark mode support.

### Intent System

All components use a consistent intent-based color system:

- `primary`: Main brand actions
- `neutral`: Secondary actions  
- `success`: Positive actions (save, confirm)
- `error`: Destructive actions (delete, cancel)
- `warning`: Caution actions

```tsx
<Button variant="contained" intent="primary">Primary Action</Button>
<Button variant="contained" intent="success">Save</Button>
<Button variant="contained" intent="error">Delete</Button>
```

### Theme Integration

```tsx
import { appThemes } from '@idealyst/components';

// Access theme colors and properties
const { colors, spacing, typography } = appThemes.light;
```

## Platform Setup

### React Native Setup

1. **Install dependencies:**
   ```bash
   yarn add react-native-unistyles react-native-svg react-native-svg-transformer
   ```

2. **Configure Metro bundler** (`metro.config.js`):
   ```javascript
   const config = {
     transformer: {
       babelTransformerPath: require.resolve('react-native-svg-transformer'),
     },
     resolver: {
       sourceExts: ['js', 'jsx', 'ts', 'tsx', 'svg'],
       assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
     },
   };
   ```

3. **iOS: Install pods:**
   ```bash
   cd ios && pod install
   ```

### Web Setup

For Vite projects, SVG imports work out of the box. For other bundlers, ensure SVG support is configured.

## TypeScript

Full TypeScript support with comprehensive type definitions:

```tsx
import type { ButtonProps, TextProps, ViewProps } from '@idealyst/components';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © [Idealyst](https://github.com/IdealystIO)

## Links

- [Documentation](https://github.com/IdealystIO/idealyst-framework/tree/main/packages/components)
- [GitHub](https://github.com/IdealystIO/idealyst-framework)
- [Issues](https://github.com/IdealystIO/idealyst-framework/issues)
- [Changelog](https://github.com/IdealystIO/idealyst-framework/releases)

---

Built with ❤️ by the Idealyst team