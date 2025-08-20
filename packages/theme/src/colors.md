# Color Palettes

Base color palette definitions that serve as the foundation for the entire theme system.

## Overview

The colors module defines 8 comprehensive color palettes, each with 10 carefully crafted shades (50-900). These palettes provide the raw material for creating consistent, accessible, and visually appealing themes.

## Color Palette Structure

Each palette follows a consistent structure with 10 shades:

- **50-200**: Very light shades (backgrounds, subtle accents)
- **300-400**: Light shades (secondary elements, hover states)
- **500**: Base color (primary brand color, main actions)
- **600-700**: Medium shades (interactive states, emphasis)
- **800-900**: Dark shades (text, high contrast elements)

## Available Palettes

### Blue Palette (Primary Brand)
Perfect for primary actions, links, and brand elements.

```tsx
blue: {
  50: '#eff6ff',   // Very light blue background
  100: '#dbeafe',  // Light blue background
  200: '#bfdbfe',  // Subtle blue
  300: '#93c5fd',  // Light interactive blue
  400: '#60a5fa',  // Medium blue
  500: '#3b82f6',  // Base blue (primary brand)
  600: '#2563eb',  // Focused blue
  700: '#1d4ed8',  // Pressed blue
  800: '#1e40af',  // Dark blue
  900: '#1e3a8a',  // Very dark blue (text)
}
```

**Use Cases:**
- Primary buttons and CTAs
- Links and navigation
- Brand elements
- Focus indicators

### Green Palette (Success)
Ideal for success states, confirmations, and positive actions.

```tsx
green: {
  50: '#f0fdf4',   // Success background
  100: '#dcfce7',  // Light success
  200: '#bbf7d0',  // Subtle success
  300: '#86efac',  // Light success interactive
  400: '#4ade80',  // Medium success
  500: '#22c55e',  // Base success
  600: '#16a34a',  // Focused success
  700: '#15803d',  // Pressed success
  800: '#166534',  // Dark success
  900: '#14532d',  // Very dark success
}
```

**Use Cases:**
- Success messages and notifications
- Confirmation buttons
- Valid form states
- Positive status indicators

### Red Palette (Error)
Essential for error states, warnings, and destructive actions.

```tsx
red: {
  50: '#fef2f2',   // Error background
  100: '#fee2e2',  // Light error
  200: '#fecaca',  // Subtle error
  300: '#fca5a5',  // Light error interactive
  400: '#f87171',  // Medium error
  500: '#ef4444',  // Base error
  600: '#dc2626',  // Focused error
  700: '#b91c1c',  // Pressed error
  800: '#991b1b',  // Dark error
  900: '#7f1d1d',  // Very dark error
}
```

**Use Cases:**
- Error messages and alerts
- Delete and destructive actions
- Invalid form states
- Critical notifications

### Amber Palette (Warning)
Perfect for warning states and caution indicators.

```tsx
amber: {
  50: '#fffbeb',   // Warning background
  100: '#fef3c7',  // Light warning
  200: '#fde68a',  // Subtle warning
  300: '#fcd34d',  // Light warning interactive
  400: '#fbbf24',  // Medium warning
  500: '#f59e0b',  // Base warning
  600: '#d97706',  // Focused warning
  700: '#b45309',  // Pressed warning
  800: '#92400e',  // Dark warning
  900: '#78350f',  // Very dark warning
}
```

**Use Cases:**
- Warning messages
- Caution alerts
- Pending states
- Important notices

### Gray Palette (Neutral)
Fundamental for text, borders, and neutral interface elements.

```tsx
gray: {
  50: '#f9fafb',   // Very light background
  100: '#f3f4f6',  // Light background
  200: '#e5e7eb',  // Subtle borders
  300: '#d1d5db',  // Light borders
  400: '#9ca3af',  // Placeholder text
  500: '#6b7280',  // Secondary text
  600: '#4b5563',  // Primary text (light theme)
  700: '#374151',  // Dark text
  800: '#1f2937',  // Very dark text
  900: '#111827',  // Darkest text
}
```

**Use Cases:**
- Text colors (all hierarchies)
- Borders and dividers
- Neutral backgrounds
- Disabled states

### Cyan Palette (Info)
Great for informational states and secondary accents.

```tsx
cyan: {
  50: '#ecfeff',   // Info background
  100: '#cffafe',  // Light info
  200: '#a5f3fc',  // Subtle info
  300: '#67e8f9',  // Light info interactive
  400: '#22d3ee',  // Medium info
  500: '#06b6d4',  // Base info
  600: '#0891b2',  // Focused info
  700: '#0e7490',  // Pressed info
  800: '#155e75',  // Dark info
  900: '#164e63',  // Very dark info
}
```

**Use Cases:**
- Info messages and tooltips
- Secondary brand colors
- Highlight elements
- Interactive accents

### Purple Palette (Accent)
Excellent for premium features and creative accents.

```tsx
purple: {
  50: '#faf5ff',   // Purple background
  100: '#f3e8ff',  // Light purple
  200: '#e9d5ff',  // Subtle purple
  300: '#d8b4fe',  // Light purple interactive
  400: '#c084fc',  // Medium purple
  500: '#a855f7',  // Base purple
  600: '#9333ea',  // Focused purple
  700: '#7c3aed',  // Pressed purple
  800: '#6b21b6',  // Dark purple
  900: '#581c87',  // Very dark purple
}
```

**Use Cases:**
- Premium feature indicators
- Creative/artistic elements
- Secondary accent colors
- Special promotions

### Pink Palette (Accent)
Perfect for creative applications and warm accents.

```tsx
pink: {
  50: '#fdf2f8',   // Pink background
  100: '#fce7f3',  // Light pink
  200: '#fbcfe8',  // Subtle pink
  300: '#f9a8d4',  // Light pink interactive
  400: '#f472b6',  // Medium pink
  500: '#ec4899',  // Base pink
  600: '#db2777',  // Focused pink
  700: '#be185d',  // Pressed pink
  800: '#9d174d',  // Dark pink
  900: '#831843',  // Very dark pink
}
```

**Use Cases:**
- Creative and playful elements
- Warm accent colors
- Fashion/lifestyle applications
- Special occasions

## Color Usage Guidelines

### Shade Selection

**Light Themes:**
- **Backgrounds**: Use shades 50-100
- **Subtle elements**: Use shades 100-200
- **Interactive elements**: Use shades 400-600
- **Text on light**: Use shades 600-900

**Dark Themes:**
- **Backgrounds**: Use shades 800-900
- **Subtle elements**: Use shades 700-800
- **Interactive elements**: Use shades 300-500
- **Text on dark**: Use shades 50-300

### Accessibility Considerations

**Contrast Ratios:**
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI elements**: Minimum 3:1 contrast ratio

**Recommended Combinations:**
```tsx
// Light theme text on backgrounds
textOnLight: {
  primary: gray[800],    // 4.5:1+ contrast
  secondary: gray[600],  // 4.5:1+ contrast
  disabled: gray[400],   // 3:1+ contrast
}

// Dark theme text on backgrounds
textOnDark: {
  primary: gray[100],    // 4.5:1+ contrast
  secondary: gray[300],  // 4.5:1+ contrast
  disabled: gray[500],   // 3:1+ contrast
}
```

## Color Psychology

### Blue
- **Emotion**: Trust, reliability, professionalism
- **Use Cases**: Corporate brands, finance, healthcare
- **Avoid**: Food brands (suppresses appetite)

### Green
- **Emotion**: Growth, success, nature, harmony
- **Use Cases**: Environmental, finance, success states
- **Avoid**: Error states (conflicts with red)

### Red
- **Emotion**: Urgency, passion, danger, power
- **Use Cases**: Alerts, errors, sales, urgency
- **Avoid**: Overuse (can create anxiety)

### Amber/Yellow
- **Emotion**: Optimism, caution, energy
- **Use Cases**: Warnings, highlights, energy brands
- **Avoid**: Large areas (can strain eyes)

### Purple
- **Emotion**: Luxury, creativity, mystery
- **Use Cases**: Premium brands, creative tools
- **Cultural Note**: Royal associations in Western cultures

### Pink
- **Emotion**: Playfulness, romance, creativity
- **Use Cases**: Fashion, lifestyle, creative apps
- **Considerations**: Gender associations vary by culture

## Implementation Examples

### Using Palettes in Themes

```tsx
import { colorPalettes } from './colors';

// Direct palette access
const brandColor = colorPalettes.blue[500];
const lightBackground = colorPalettes.gray[50];
const errorText = colorPalettes.red[700];

// Intent mapping
const lightThemeIntents = {
  primary: {
    main: colorPalettes.blue[500],
    light: colorPalettes.blue[400],
    dark: colorPalettes.blue[600],
    container: colorPalettes.blue[100],
  },
  error: {
    main: colorPalettes.red[500],
    light: colorPalettes.red[400],
    dark: colorPalettes.red[600],
    container: colorPalettes.red[100],
  },
};
```

### Generating Custom Palettes

```tsx
import { generateColorPalette } from '../themeBuilder';

// Generate palette from brand color
const brandPalette = generateColorPalette('#ff6b6b');

// Combine with existing palettes
const customPalettes = {
  ...colorPalettes,
  brand: brandPalette,
};
```

## Best Practices

1. **Consistency**: Use the same palette family for related elements
2. **Contrast**: Always check contrast ratios for accessibility
3. **Context**: Consider the emotional and cultural context of colors
4. **Hierarchy**: Use color intensity to indicate importance
5. **Testing**: Validate colors across different devices and conditions
6. **Brand Alignment**: Ensure palette choices align with brand identity

## Color Tools and Resources

**Contrast Checkers:**
- WebAIM Contrast Checker
- Colour Contrast Analyser
- Stark (Figma/Sketch plugin)

**Palette Generators:**
- Coolors.co
- Adobe Color
- Material Design Color Tool

**Accessibility Tools:**
- WAVE Web Accessibility Evaluator
- axe DevTools
- Color Oracle (colorblind simulator)