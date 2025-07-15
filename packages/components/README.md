# @idealyst/components

A comprehensive, cross-platform component library for React and React Native applications. Built with TypeScript and powered by [react-native-unistyles](https://github.com/jpudysz/react-native-unistyles) for consistent styling across platforms.

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
# Using Yarn (recommended)
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

### Layout Components

#### View
A flexible container component with built-in spacing and styling options.

```tsx
import { View } from '@idealyst/components';

<View spacing="md" style={{ padding: 16 }}>
  {/* Content */}
</View>
```

**Props:**
- `spacing`: `"xs" | "sm" | "md" | "lg" | "xl" | "xxl"`
- Standard View props (style, children, etc.)

#### Screen
A full-screen container component that grows to fit the parent completely with theme-based backgrounds and padding.

```tsx
import { Screen } from '@idealyst/components';

<Screen background="primary" padding="lg" safeArea={true}>
  {/* Your app content */}
</Screen>
```

**Props:**
- `background`: `"primary" | "secondary" | "tertiary" | "inverse"` - Background color variant
- `padding`: `"none" | "sm" | "md" | "lg" | "xl"` - Screen padding (default: "md")
- `safeArea`: `boolean` - Enable safe area padding for mobile devices (default: false)
- `style`: Additional styles
- `testID`: Test identifier

#### Divider
A separator component with customizable styling and spacing.

```tsx
import { Divider } from '@idealyst/components';

<Divider spacing="medium" intent="primary">
  <Text>Section Title</Text>
</Divider>
```

**Props:**
- `spacing`: `"small" | "medium" | "large"`
- `intent`: `"primary" | "secondary" | "neutral"`
- `children`: Optional content to display in the divider

### Typography

#### Text
A versatile text component with comprehensive styling options.

```tsx
import { Text } from '@idealyst/components';

<Text
  size="large"
  weight="bold"
  color="primary"
  align="center"
>
  Hello World
</Text>
```

**Props:**
- `size`: `"small" | "medium" | "large" | "xlarge"`
- `weight`: `"light" | "normal" | "medium" | "semibold" | "bold"`
- `color`: `"primary" | "secondary" | "success" | "warning" | "error"`
- `align`: `"left" | "center" | "right"`

### Form Components

#### Button
A customizable button component with multiple variants and intents.

```tsx
import { Button } from '@idealyst/components';

<Button
  variant="contained"
  intent="primary"
  size="medium"
  onPress={() => console.log('Pressed!')}
>
  Click Me
</Button>
```

**Props:**
- `variant`: `"contained" | "outlined" | "text"`
- `intent`: `"primary" | "neutral" | "success" | "error" | "warning"`
- `size`: `"small" | "medium" | "large"`
- `disabled`: `boolean`
- `onPress`: `() => void`

#### Input
A text input component with consistent styling.

```tsx
import { Input } from '@idealyst/components';

<Input
  placeholder="Enter your name"
  value={value}
  onChangeText={setValue}
/>
```

#### Checkbox
A checkbox component with customizable styling.

```tsx
import { Checkbox } from '@idealyst/components';

<Checkbox
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
  label="Agree to terms"
/>
```

### Display Components

#### Card
A container component for displaying content in a card format.

```tsx
import { Card } from '@idealyst/components';

<Card>
  <Text size="large" weight="bold">Card Title</Text>
  <Text>Card content goes here</Text>
</Card>
```

#### Badge
A small component for displaying status or count information.

```tsx
import { Badge } from '@idealyst/components';

<Badge count={5} intent="error">
  <Text>Notifications</Text>
</Badge>
```

#### Avatar
A component for displaying user avatars or profile pictures.

```tsx
import { Avatar } from '@idealyst/components';

<Avatar
  source={{ uri: 'https://example.com/avatar.jpg' }}
  size="medium"
  fallback="JD"
/>
```

**Props:**
- `source`: Image source object
- `size`: `"small" | "medium" | "large"`
- `fallback`: Text to display when image fails to load

## Theme System

The library includes a comprehensive theme system with light and dark mode support.

### Default Themes

```tsx
import { appThemes } from '@idealyst/components';

// Access theme colors and properties
const { colors, spacing, typography } = appThemes.light;
```

### Intent System

Components use an intent-based color system for consistent UX:

- **Primary**: Main brand actions
- **Neutral**: Secondary actions
- **Success**: Positive actions (save, confirm)
- **Error**: Destructive actions (delete, cancel)
- **Warning**: Caution actions

### Color Palettes

The theme includes 8 comprehensive color palettes:
- Blue (Primary)
- Green (Success)
- Red (Error)
- Amber (Warning)
- Gray (Neutral)
- Cyan (Info)
- Purple (Accent)
- Pink (Accent)

Each palette includes 10 shades (50-900) optimized for both light and dark themes.

### Custom Styling

Use the theme in your custom components:

```tsx
import { StyleSheet } from 'react-native';
import { createStyleSheet } from 'react-native-unistyles';

const styles = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
}));
```

## Platform-Specific Usage

### React Native

```tsx
import React from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';

export default function App() {
  return (
    <Screen background="primary">
      <View spacing="lg" style={{ flex: 1 }}>
        <Text size="large" weight="bold">
          React Native App
        </Text>
        <Button variant="contained" intent="primary">
          Native Button
        </Button>
      </View>
    </Screen>
  );
}
```

### React Web

```tsx
import React from 'react';
import { Screen, View, Text, Button } from '@idealyst/components';

export default function App() {
  return (
    <Screen background="primary">
      <View spacing="lg">
        <Text size="large" weight="bold">
          Web App
        </Text>
        <Button variant="contained" intent="primary">
          Web Button
        </Button>
      </View>
    </Screen>
  );
}
```

## Examples

Import pre-built examples to see components in action:

```tsx
import { ButtonExamples, TextExamples, ScreenExamples, AllExamples } from '@idealyst/components/examples';

// Show all components
<AllExamples />

// Show specific component examples
<ButtonExamples />
<TextExamples />
<ScreenExamples />
```

## TypeScript Support

All components are fully typed with comprehensive TypeScript definitions:

```tsx
import { ButtonProps, TextProps, ViewProps, ScreenProps } from '@idealyst/components';

// Use component prop types in your own components
interface MyButtonProps extends ButtonProps {
  customProp: string;
}

interface MyScreenProps extends ScreenProps {
  customLayout: boolean;
}
```

## Styling Guidelines

### Component Styling Architecture

This library follows a consistent approach to component styling using [react-native-unistyles](https://github.com/jpudysz/react-native-unistyles) with a variant-based system.

#### 1. Style Precedence

When both stylesheet variants and manual style props are provided, **manual styles take precedence**:

```tsx
// The backgroundColor in style will override the background variant
<View 
  background="primary"           // Sets background via variant
  style={{ backgroundColor: 'red' }}  // This takes precedence
>
  Content
</View>
```

This allows for flexible overrides while maintaining the design system defaults.

#### 2. Variants Over Manual Styles

**All style-related props should be implemented as variants** in the stylesheet rather than direct style modifications. This ensures consistency, theme integration, and maintainability.

✅ **Good - Using Variants:**
```tsx
// Component prop
<Text color="primary" size="large" weight="bold">
  Hello World
</Text>

// Stylesheet implementation
const textStyles = StyleSheet.create((theme) => ({
  text: {
    variants: {
      color: {
        primary: { color: theme.colors.text.primary },
        secondary: { color: theme.colors.text.secondary },
        error: { color: theme.intents.error.main },
      },
      size: {
        small: { fontSize: theme.typography.fontSize.sm },
        large: { fontSize: theme.typography.fontSize.lg },
      },
      weight: {
        bold: { fontWeight: theme.typography.fontWeight.bold },
        normal: { fontWeight: theme.typography.fontWeight.regular },
      }
    }
  }
}));
```

❌ **Avoid - Direct Style Manipulation:**
```tsx
// Don't do this
const Text = ({ color, size, style }) => {
  const dynamicStyles = {
    color: color === 'primary' ? '#007AFF' : '#666',
    fontSize: size === 'large' ? 18 : 14,
  };
  
  return <RNText style={[dynamicStyles, style]} />;
};
```

#### 3. Benefits of the Variant System

- **Theme Integration**: Variants automatically use theme values
- **Type Safety**: TypeScript can enforce valid variant values  
- **Performance**: Styles are computed once, not on every render
- **Consistency**: All components follow the same patterns
- **Dark Mode**: Automatic theme switching without component changes

#### 4. Style Override Pattern

The recommended pattern for all components:

```tsx
const Component = ({ variant1, variant2, style, ...props }) => {
  componentStyles.useVariants({
    variant1,
    variant2,
  });

  const styleArray = [
    componentStyles.component,  // Base styles + variants
    style,                     // Manual overrides (highest precedence)
  ];

  return <BaseComponent style={styleArray} {...props} />;
};
```

#### 5. Creating New Variants

When adding new style options to components:

1. **Define the prop type** with specific allowed values
2. **Add the variant** to the stylesheet  
3. **Use theme values** where possible
4. **Document the new prop** in the component's props section

```tsx
// 1. Type definition
interface ButtonProps {
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

// 2. Stylesheet variant
const buttonStyles = StyleSheet.create((theme) => ({
  button: {
    variants: {
      radius: {
        none: { borderRadius: 0 },
        sm: { borderRadius: theme.borderRadius.sm },
        md: { borderRadius: theme.borderRadius.md },
        lg: { borderRadius: theme.borderRadius.lg },
        full: { borderRadius: theme.borderRadius.full },
      }
    }
  }
}));

// 3. Component implementation
const Button = ({ radius = 'md', style, ...props }) => {
  buttonStyles.useVariants({ radius });
  return <Pressable style={[buttonStyles.button, style]} {...props} />;
};
```

## Development

### Building

```bash
# Build the library
yarn build

# Watch for changes during development
yarn dev
```

### Project Structure

```
packages/components/
├── src/
│   ├── Avatar/           # Avatar component
│   ├── Badge/            # Badge component
│   ├── Button/           # Button component
│   ├── Card/             # Card component
│   ├── Checkbox/         # Checkbox component
│   ├── Divider/          # Divider component
│   ├── Input/            # Input component
│   ├── Text/             # Text component
│   ├── View/             # View component
│   ├── examples/         # Component examples
│   ├── theme/            # Theme system
│   └── index.ts          # Main exports
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your component following the existing patterns
4. Include examples and TypeScript definitions
5. Submit a pull request

### Component Structure

Each component follows this structure:
```
ComponentName/
├── ComponentName.web.tsx      # Web implementation
├── ComponentName.native.tsx   # React Native implementation
├── ComponentName.styles.tsx   # Shared styles
├── types.ts                   # TypeScript definitions
├── index.ts                   # Web export
├── index.native.ts            # Native export
└── index.web.ts               # Web export
```

## License

MIT License - see LICENSE file for details.

## Support

For issues, questions, or contributions, please visit our [GitHub repository](https://github.com/your-org/idealyst-framework). 