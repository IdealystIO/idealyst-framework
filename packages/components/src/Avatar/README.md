# Avatar Component

A flexible avatar component for displaying user profile pictures with fallback support.

## Features

- ✅ Cross-platform (React & React Native)
- ✅ Multiple sizes (small, medium, large, xlarge)
- ✅ Shape variants (circle, square)
- ✅ Automatic fallback to initials when image fails
- ✅ Color-themed backgrounds for fallback text
- ✅ Accessible with proper alt text support
- ✅ TypeScript support

## Basic Usage

```tsx
import { Avatar } from '@idealyst/components';

// With image URL
<Avatar 
  src="https://example.com/avatar.jpg"
  alt="John Doe"
  fallback="JD"
  size="medium"
/>

// With local image (React Native)
<Avatar 
  src={require('./avatar.png')}
  alt="John Doe"
  fallback="JD"
  size="large"
/>

// Fallback only (no image)
<Avatar 
  fallback="AB"
  size="small"
  color="primary"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| any` | - | Image source (URL string or require() for local images) |
| `alt` | `string` | - | Alt text for accessibility |
| `fallback` | `string` | - | Fallback text to display (usually initials) |
| `size` | `'small' \| 'medium' \| 'large' \| 'xlarge'` | `'medium'` | Size of the avatar |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape of the avatar |
| `color` | `ColorVariant` | - | Color scheme for fallback background |
| `style` | `ViewStyle` | - | Additional custom styles |
| `testID` | `string` | - | Test identifier for testing |

## Sizes

| Size | Dimensions |
|------|------------|
| `small` | 32×32px |
| `medium` | 48×48px |
| `large` | 64×64px |
| `xlarge` | 96×96px |

## Examples

### Different Sizes
```tsx
<Avatar src="https://example.com/user.jpg" size="small" fallback="JS" />
<Avatar src="https://example.com/user.jpg" size="medium" fallback="JS" />
<Avatar src="https://example.com/user.jpg" size="large" fallback="JS" />
<Avatar src="https://example.com/user.jpg" size="xlarge" fallback="JS" />
```

### Different Shapes
```tsx
<Avatar src="https://example.com/user.jpg" shape="circle" fallback="JS" />
<Avatar src="https://example.com/user.jpg" shape="square" fallback="JS" />
```

### Fallback with Colors
```tsx
<Avatar fallback="AB" color="primary" />
<Avatar fallback="CD" color="secondary" />
<Avatar fallback="EF" color="success" />
```

### Error Handling
```tsx
// If the image fails to load, fallback text will be shown automatically
<Avatar 
  src="https://invalid-url.com/image.jpg"
  fallback="JD"
  alt="John Doe"
/>
```

## Accessibility

- Uses proper alt text for images
- Fallback text is readable by screen readers
- Maintains proper contrast ratios for text
- Follows accessibility best practices for user avatars

## Styling

The Avatar component uses the theme system for consistent styling:

```tsx
// Custom styling
<Avatar 
  src="https://example.com/user.jpg"
  style={{ 
    borderWidth: 2, 
    borderColor: '#007AFF' 
  }}
/>
```

## Platform Differences

### React Native
- Uses `Image` component with proper error handling
- Supports both local (`require()`) and remote images
- Uses `accessibilityLabel` for screen readers

### Web
- Uses HTML `<img>` element
- Proper `alt` attribute for accessibility
- CSS-based styling with `object-fit: cover`

## Best Practices

1. **Always provide fallback text** for when images fail to load
2. **Use meaningful alt text** that describes the person or content
3. **Keep fallback text short** (usually 1-3 characters for initials)
4. **Choose appropriate sizes** for your use case
5. **Consider accessibility** when choosing colors and contrast