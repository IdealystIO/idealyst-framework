# @idealyst/components - LLM Documentation

This file provides comprehensive component documentation for LLMs working with the @idealyst/components library.

## Library Overview

@idealyst/components is a cross-platform React/React Native component library with:
- 11 core components organized into 5 categories
- Theme-based styling with Unistyles
- Intent-based color system (primary, neutral, success, error, warning)
- Cross-platform compatibility (React & React Native)
- TypeScript support

## Component Categories

### Layout Components
- **View**: Container with spacing system (`spacing="xs|sm|md|lg|xl|xxl"`)
- **Screen**: Full-screen container (`background="primary|secondary|tertiary|inverse"`, `safeArea`, `padding`)
- **Divider**: Content separator (`orientation="horizontal|vertical"`, `spacing`, `intent`)

### Typography
- **Text**: Styled text (`size="small|medium|large|xlarge"`, `weight="light|normal|medium|semibold|bold"`, `color`, `intent`, `align`)

### Form Components
- **Button**: Interactive button (`variant="contained|outlined|text"`, `intent="primary|neutral|success|error|warning"`, `size="small|medium|large"`)
- **Input**: Text input (`label`, `placeholder`, `error`, `helperText`, `multiline`, `secureTextEntry`)
- **Checkbox**: Form checkbox (`checked`, `onCheckedChange`, `label`, `disabled`, `intent`)

### Display Components
- **Card**: Content container (`variant="default|outlined|elevated|filled"`, `padding`, `radius`, `clickable`, `intent`)
- **Badge**: Status indicator (`variant="filled|outlined|dot"`, `color`, `size="small|medium|large"`)
- **Avatar**: Profile picture (`src`, `fallback`, `size="small|medium|large|xlarge"`, `shape="circle|square"`)

### Utility Components
- **Icon**: Icon display (`name`, `size`, `color`, `intent`)

## Intent System

All components use a consistent intent-based color system:
- `primary`: Main brand actions
- `neutral`: Secondary actions  
- `success`: Positive actions (save, confirm)
- `error`: Destructive actions (delete, cancel)
- `warning`: Caution actions

## Common Patterns

### Basic Layout
```tsx
<Screen background="primary" safeArea>
  <View spacing="lg">
    <Text size="xlarge" weight="bold">Title</Text>
    <Text>Content</Text>
  </View>
</Screen>
```

### Form Layout
```tsx
<View spacing="md">
  <Input label="Email" value={email} onChangeText={setEmail} />
  <Button variant="contained" intent="primary" onPress={submit}>Submit</Button>
</View>
```

### Card with Content
```tsx
<Card variant="outlined" clickable onPress={handlePress}>
  <View spacing="sm">
    <Text weight="bold">Title</Text>
    <Text size="small" color="secondary">Subtitle</Text>
  </View>
</Card>
```

## Styling Guidelines

1. **Use variants over manual styles** - Components provide semantic variants
2. **Manual styles override variants** - Style prop takes precedence
3. **Consistent spacing** - Use View spacing prop for consistent gaps
4. **Intent-based colors** - Use intent props for semantic meaning
5. **Cross-platform compatibility** - All components work on React and React Native

## Import Patterns

```tsx
// Individual imports (recommended)
import { Button, Text, View } from '@idealyst/components';

// Documentation access
import { componentDocs, getComponentDocs } from '@idealyst/components/docs';

// Examples
import { ButtonExamples } from '@idealyst/components/examples';
```

## Key Props Reference

### Universal Props (most components)
- `style`: Additional custom styles
- `testID`: Test identifier
- `disabled`: Disable interaction

### Layout Props
- `spacing`: Gap between children (`View`)
- `padding`: Internal padding (`Screen`, `Card`)
- `background`: Background color variant (`Screen`)

### Styling Props
- `variant`: Visual style variant
- `intent`: Color scheme/semantic meaning
- `size`: Component size
- `color`: Color override

### Interactive Props
- `onPress`: Press handler (`Button`, `Card`, `Checkbox`)
- `clickable`: Enable interaction (`Card`)
- `checked`: Checkbox state
- `value`/`onChangeText`: Input state

## Accessibility Features

- Proper ARIA roles and labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Touch target sizing (minimum 44px)

## Documentation Access for LLMs

### File-Based Documentation Access
All documentation is available as markdown files in the package:

```bash
# Quick overview - START HERE
CLAUDE.md

# Complete library overview with component table
README.md

# Detailed documentation for each component
src/Avatar/README.md
src/Badge/README.md  
src/Button/README.md
src/Card/README.md
src/Checkbox/README.md
src/Divider/README.md
src/Icon/README.md
src/Input/README.md
src/Screen/README.md
src/Text/README.md
src/View/README.md
```

### Documentation Structure
Each component has a detailed README.md file with:
- Complete API reference with props table
- Usage examples and common patterns
- Best practices and accessibility guidelines
- Cross-platform considerations
- Feature overview

## Best Practices for LLMs

1. **Start with CLAUDE.md** for quick component overview and patterns
2. **Read individual README files** for detailed component documentation
3. **Always use intent props** for semantic meaning
4. **Prefer component variants** over manual styling
5. **Use View spacing** for consistent layouts
6. **Provide proper labels** for form components
7. **Consider accessibility** in component usage
8. **Test cross-platform** compatibility
9. **Use TypeScript** for better development experience