# Component Examples

This directory contains comprehensive examples showcasing all components from the Idealyst component library. Each example demonstrates the various props, variants, and use cases for each component.

## Available Examples

### Individual Component Examples
- **ButtonExamples**: Demonstrates all button variants, sizes, intents, and states
- **TextExamples**: Shows text sizes, weights, colors, and alignment options
- **ViewExamples**: Displays layout capabilities with spacing, backgrounds, and borders
- **InputExamples**: Covers input types, sizes, variants, and states
- **CardExamples**: Showcases card layouts, variants, intents, and interactive features
- **CheckboxExamples**: Demonstrates checkbox states, sizes, intents, and custom content
- **DividerExamples**: Shows divider orientations, variants, and styling options
- **BadgeExamples**: Displays badge variants, intents, and use cases
- **AvatarExamples**: Demonstrates avatar sizes, shapes, and fallback options

## Usage

### Import Individual Examples
```typescript
import { ButtonExamples, TextExamples, CardExamples } from '@idealyst/components/examples';

// Use in your component
<ButtonExamples />
```

## Example Structure

Each example component follows this structure:
- **Header**: Component name and description
- **Grouped Sections**: Related variants and properties
- **Interactive Elements**: Demonstrating user interactions
- **Edge Cases**: Disabled states, error states, etc.
- **Real-world Usage**: Practical implementation examples

## Features Demonstrated

### Button Examples
- Variants: contained, outlined, text
- Sizes: small, medium, large
- Intents: primary, neutral, success, error, warning
- States: normal, disabled

### Text Examples
- Sizes: small, medium, large, xlarge
- Weights: light, normal, medium, semibold, bold
- Colors: primary, secondary, success, warning, error
- Alignment: left, center, right

### View Examples
- Spacing: none, xs, sm, md, lg, xl
- Backgrounds: transparent, surface, primary, secondary
- Border radius: none, xs, sm, md, lg, xl
- Borders: none, thin, thick
- Layout patterns: flex layouts, positioning

### Input Examples
- Types: text, email, password, number
- Sizes: small, medium, large
- Variants: default, outlined, filled
- States: normal, disabled, error, pre-filled
- Auto-capitalization: none, sentences, words, characters

### Card Examples
- Variants: default, outlined, elevated, filled
- Intents: neutral, primary, success, error, warning, info
- Padding: none, small, medium, large
- Radius: none, small, medium, large
- Interactive: clickable, disabled states
- Complex layouts: multi-element cards

### Checkbox Examples
- Basic states: checked, unchecked, indeterminate
- Sizes: small, medium, large
- Intents: primary, neutral, success, error, warning, info
- Variants: default, outlined
- States: normal, disabled
- Custom content: complex labels, helper text, errors

### Divider Examples
- Orientations: horizontal, vertical
- Variants: solid, dashed, dotted
- Thickness: thin, medium, thick
- Intents: primary, secondary, neutral, success, error, warning, info
- Spacing: none, small, medium, large
- With content: text labels, sections

### Badge Examples
- Variants: filled, outlined, dot
- Sizes: small, medium, large
- Intents: primary, success, error, warning, neutral, info
- Use cases: numbers, status, categories, notifications

### Avatar Examples
- Sizes: small, medium, large, xlarge
- Shapes: circle, square
- Fallbacks: initials, placeholder text
- Images: with proper fallbacks
- Groups: overlapping avatars

## Best Practices

1. **Interactive Testing**: All examples include interactive elements to test functionality
2. **Accessibility**: Examples demonstrate proper labeling and accessibility features
3. **Responsive Design**: Components adapt to different screen sizes
4. **Theme Integration**: All examples use the theme system properly
5. **Real-world Context**: Examples show practical usage scenarios

## Development Notes

- Examples are built using the same components they demonstrate
- All examples use TypeScript for type safety
- Components follow the established design system patterns
- Examples are optimized for both web and native platforms

## Contributing

When adding new components:
1. Create a new example file: `ComponentNameExamples.tsx`
2. Follow the established pattern of grouped sections
3. Include all variants, sizes, and states
4. Add interactive elements where applicable
5. Export the component in `index.ts`