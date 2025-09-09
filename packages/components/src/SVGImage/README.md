# SVGImage Component

A cross-platform React/React Native component for rendering SVG images with theme support and consistent styling.

## Overview

The SVGImage component provides a unified way to display SVG images across web and React Native platforms. It supports both imported SVG files (as React components) and remote SVG URLs, with built-in theming and styling capabilities.

## Installation

The SVGImage component is part of the `@idealyst/components` package:

```bash
yarn add @idealyst/components
```

For React Native projects, you also need:
```bash
yarn add react-native-svg react-native-svg-transformer
```

## Basic Usage

### Imported SVG Files (Recommended)

```tsx
import { SVGImage } from '@idealyst/components';
import MyLogo from './assets/logo.svg';

function MyComponent() {
  return (
    <SVGImage 
      source={MyLogo}
      width={100}
      height={50}
    />
  );
}
```

### Remote SVG URLs

```tsx
import { SVGImage } from '@idealyst/components';

function MyComponent() {
  return (
    <SVGImage 
      source={{ uri: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg" }}
      width={60}
      height={60}
      color="#61dafb"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string \| { uri: string } \| React.FC<SvgProps>` | **Required** | SVG source - can be imported component, URL string, or URI object |
| `width` | `number \| string` | `24` | Width of the SVG |
| `height` | `number \| string` | `24` | Height of the SVG |
| `size` | `number \| string` | - | Sets both width and height (overrides individual width/height) |
| `color` | `string` | - | Fill color for the SVG |
| `intent` | `'primary' \| 'success' \| 'error' \| 'warning' \| 'neutral'` | - | Theme-based color intent |
| `style` | `ViewStyle` | - | Additional container styles |
| `testID` | `string` | - | Test identifier |

## Theme Integration

The SVGImage component integrates with the Idealyst theme system:

```tsx
<SVGImage 
  source={MyIcon}
  size={24}
  intent="primary" // Uses theme's primary color
/>

<SVGImage 
  source={MyIcon}
  size={24}
  intent="success" // Uses theme's success color
/>
```

## Platform Setup

### React Native Setup

1. **Install dependencies:**
   ```bash
   yarn add react-native-svg react-native-svg-transformer
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

3. **Add TypeScript declarations** (`types/svg.d.ts`):
   ```typescript
   declare module '*.svg' {
     import React from 'react';
     import { SvgProps } from 'react-native-svg';
     const content: React.FC<SvgProps>;
     export default content;
   }
   ```

4. **iOS: Install pods:**
   ```bash
   cd ios && pod install
   ```

### Web Setup

For web projects using Vite, SVG imports work out of the box. Add TypeScript declarations if needed:

```typescript
// types/svg.d.ts
declare module '*.svg' {
  import React from 'react';
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
```

## Examples

### Basic Usage
```tsx
import { SVGImage } from '@idealyst/components';
import LogoIcon from './logo.svg';

<SVGImage source={LogoIcon} size={40} />
```

### With Theme Colors
```tsx
<SVGImage 
  source={LogoIcon} 
  size={32}
  intent="primary"
/>
```

### Remote SVG
```tsx
<SVGImage 
  source={{ uri: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg" }}
  width={48}
  height={48}
  color="#3178c6"
/>
```

### Custom Styling
```tsx
<SVGImage 
  source={LogoIcon}
  size={60}
  style={{ 
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8 
  }}
/>
```

## Best Practices

1. **Prefer imported SVGs over URLs** - Better performance and reliability
2. **Use theme intents** - Ensures consistency with your design system
3. **Provide dimensions** - Always specify width/height or size
4. **Test on both platforms** - Verify SVGs render correctly on web and mobile
5. **Use CDN URLs** - For remote SVGs, use reliable CDNs like jsDelivr

## Limitations

- **React Native**: Local SVG files must be imported as components (not file paths)
- **Remote URLs**: Some servers may block requests from mobile apps (403 errors)
- **Coloring**: Works best with single-color SVG icons

## Troubleshooting

### SVGs not showing on React Native
- Ensure `react-native-svg-transformer` is configured in Metro
- Check that SVGs are imported as components, not file paths
- Verify pods are installed on iOS

### Remote SVGs failing
- Use CDN URLs (e.g., jsDelivr, unpkg) instead of direct server URLs
- Check browser console for CORS or 403 errors
- Consider hosting SVGs on your own CDN

### TypeScript errors
- Add SVG type declarations to your project
- Ensure `react-native-svg` types are installed