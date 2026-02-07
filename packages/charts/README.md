# @idealyst/charts

Cross-platform animated charts for React and React Native with SVG and Skia rendering support.

## Features

- **Cross-platform**: Works identically on web (React) and native (React Native)
- **Dual renderers**: SVG for compatibility, Skia for performance
- **Animated**: Smooth entrance and data transition animations
- **Themed**: Integrates with @idealyst/theme for consistent styling
- **Interactive**: Touch/mouse support with tooltips and selection
- **Responsive**: Automatically adapts to container size
- **TypeScript**: Full type safety

## Installation

```bash
npm install @idealyst/charts
# or
yarn add @idealyst/charts
```

### Peer Dependencies

```bash
# Required
npm install @idealyst/svg @idealyst/theme react-native-unistyles

# For native (optional but recommended)
npm install react-native-reanimated react-native-gesture-handler

# For Skia renderer (optional)
npm install @shopify/react-native-skia
```

## Quick Start

```tsx
import { LineChart, ChartProvider } from '@idealyst/charts';

// Basic line chart
<LineChart
  data={[
    {
      id: 'revenue',
      name: 'Revenue',
      data: [
        { x: 'Jan', y: 100 },
        { x: 'Feb', y: 150 },
        { x: 'Mar', y: 120 },
      ],
    },
  ]}
  height={300}
  animate
/>

// With app-wide defaults
<ChartProvider renderer="svg" defaultIntent="primary">
  <App />
</ChartProvider>
```

## Chart Types

| Chart | Description | Status |
|-------|-------------|--------|
| LineChart | Time series, trends | 🚧 In Progress |
| AreaChart | Filled line charts | 📋 Planned |
| BarChart | Vertical/horizontal bars | 📋 Planned |
| PieChart | Pie and donut charts | 📋 Planned |
| ScatterChart | Point clouds | 📋 Planned |
| CandlestickChart | OHLC financial data | 📋 Planned |

## Renderers

### SVG (Default)
- Works everywhere
- Smaller bundle size
- Best for < 1000 data points

### Skia (Native only)
- GPU-accelerated
- 60fps with 10k+ points
- Best for real-time data

```tsx
// Automatic selection (Skia on native, SVG on web)
<LineChart data={data} />

// Force SVG
<LineChart data={data} renderer="svg" />

// Force Skia (native only)
<LineChart data={data} renderer="skia" />
```

## API

### Common Props

All charts share these props:

```tsx
interface BaseChartProps {
  // Data
  data: ChartDataSeries[];

  // Dimensions
  width?: number | string;
  height?: number | string;
  padding?: ChartPadding | number;

  // Theming
  intent?: Intent;
  size?: Size;

  // Animation
  animate?: boolean;
  animationDuration?: number;

  // Interaction
  interactive?: boolean;
  showTooltip?: boolean;
  onDataPointPress?: (point, seriesIndex) => void;

  // Legend
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}
```

### Data Format

```tsx
interface ChartDataSeries {
  id: string;           // Unique identifier
  name: string;         // Display name
  data: DataPoint[];    // Array of points
  color?: string;       // Custom color
  intent?: Intent;      // Theme intent for coloring
}

interface DataPoint {
  x: number | string | Date;
  y: number;
  label?: string;
  meta?: Record<string, unknown>;
}
```

## Core Utilities

The package also exports low-level utilities for custom charts:

### Scales

```tsx
import { createLinearScale, createBandScale, createTimeScale } from '@idealyst/charts';

const yScale = createLinearScale({
  domain: [0, 100],
  range: [300, 0],
  nice: true,
});

yScale(50); // Returns 150
```

### Path Generators

```tsx
import { generateLinePath, generateArcPath, generateBarPath } from '@idealyst/charts';

const path = generateLinePath(points, { curve: 'monotone' });
```

## License

MIT
