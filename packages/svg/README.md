# @idealyst/svg

Cross-platform SVG primitives for React and React Native with identical behavior.

## Installation

```bash
npm install @idealyst/svg
# or
yarn add @idealyst/svg
```

### React Native

For React Native, you also need to install `react-native-svg`:

```bash
npm install react-native-svg
# or
yarn add react-native-svg
```

Then run pod install for iOS:

```bash
cd ios && pod install
```

## Usage

```tsx
import { Svg, Circle, Rect, Path, G, LinearGradient, Stop, Defs } from '@idealyst/svg';

function MyIcon() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#667eea" />
          <Stop offset="100%" stopColor="#764ba2" />
        </LinearGradient>
      </Defs>

      <Circle
        cx={50}
        cy={50}
        r={40}
        fill="url(#grad1)"
        stroke="#333"
        strokeWidth={2}
      />

      <Rect
        x={30}
        y={30}
        width={40}
        height={40}
        rx={5}
        fill="white"
        opacity={0.8}
      />
    </Svg>
  );
}
```

## Available Components

### Basic Shapes
- `Svg` - Root SVG element
- `Rect` - Rectangle
- `Circle` - Circle
- `Ellipse` - Ellipse
- `Line` - Line
- `Polyline` - Open polygon (connected line segments)
- `Polygon` - Closed polygon
- `Path` - Complex paths using SVG path commands

### Text
- `Text` - Text element
- `TSpan` - Text span for inline formatting
- `TextPath` - Text along a path

### Groups & Transforms
- `G` - Group element with transform support
- `Use` - Reference and reuse elements
- `Symbol` - Define reusable graphics
- `Defs` - Definitions container

### Gradients & Patterns
- `LinearGradient` - Linear gradient
- `RadialGradient` - Radial gradient
- `Stop` - Gradient stop
- `Pattern` - Pattern fill

### Clipping & Masking
- `ClipPath` - Clipping path
- `Mask` - Mask element

### Other
- `Image` - Embedded image
- `Marker` - Line markers
- `ForeignObject` - Embed HTML (web) or native views (RN)

## Props

All components support common SVG presentation attributes:

```tsx
interface SvgPresentationProps {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number | string;
  strokeOpacity?: number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeDasharray?: string | number[];
  strokeDashoffset?: number | string;
  opacity?: number;
  transform?: string;
  // ... and more
}
```

### Event Handlers

Components support touch/click handlers:

```tsx
<Circle
  cx={50}
  cy={50}
  r={40}
  fill="blue"
  onPress={() => console.log('Pressed!')}
  onLongPress={() => console.log('Long pressed!')}
/>
```

### Group Transforms

The `G` component supports convenience transform props:

```tsx
<G x={100} y={50} rotation={45} scale={1.5} originX={0} originY={0}>
  <Rect x={-25} y={-25} width={50} height={50} fill="red" />
</G>
```

## Cross-Platform Behavior

This library ensures identical rendering on web and React Native:

- **Web**: Uses native SVG elements
- **React Native**: Wraps `react-native-svg` components

The same code works on both platforms:

```tsx
// Works identically on web and React Native
<Svg width={200} height={200} viewBox="0 0 200 200">
  <Path
    d="M10,80 Q95,10 180,80"
    fill="none"
    stroke="#3498db"
    strokeWidth={4}
  />
</Svg>
```

## Examples

See the [examples](./src/examples) directory for more usage patterns.

## License

MIT
