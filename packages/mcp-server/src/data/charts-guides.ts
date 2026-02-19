/**
 * Charts Package Guides
 *
 * Comprehensive documentation for @idealyst/charts.
 */

export const chartsGuides: Record<string, string> = {
  "idealyst://charts/overview": `# @idealyst/charts

Cross-platform animated charting library with SVG and Skia renderers.

## Installation

\`\`\`bash
yarn add @idealyst/charts
\`\`\`

## Platform Support

| Platform | Renderer |
|----------|----------|
| Web      | SVG |
| iOS      | Skia (via react-native-skia) or SVG |
| Android  | Skia (via react-native-skia) or SVG |

## Key Exports

\`\`\`typescript
import {
  LineChart,
  BarChart,
  // More chart types available
} from '@idealyst/charts';
import type {
  DataPoint,
  ChartDataSeries,
  Column,
  BaseChartProps,
  CartesianChartProps,
  LineChartProps,
  BarChartProps,
} from '@idealyst/charts';
\`\`\`

## Quick Start

\`\`\`tsx
import { LineChart } from '@idealyst/charts';

const data = [
  { x: 'Jan', y: 30 },
  { x: 'Feb', y: 45 },
  { x: 'Mar', y: 28 },
  { x: 'Apr', y: 65 },
  { x: 'May', y: 42 },
];

function SalesChart() {
  return (
    <LineChart
      data={[{ data, label: 'Sales' }]}
      height={300}
      animated
    />
  );
}
\`\`\`
`,

  "idealyst://charts/api": `# @idealyst/charts — API Reference

## Data Types

### DataPoint

\`\`\`typescript
interface DataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}
\`\`\`

### ChartDataSeries

\`\`\`typescript
interface ChartDataSeries {
  data: DataPoint[];
  label?: string;
  color?: string;
  // Styling per-series
}
\`\`\`

### PieDataPoint

\`\`\`typescript
interface PieDataPoint {
  value: number;
  label: string;
  color?: string;
}
\`\`\`

---

## Base Props (shared by all charts)

### BaseChartProps

\`\`\`typescript
interface BaseChartProps {
  data: ChartDataSeries[];
  height?: number | string;
  width?: number | string;
  padding?: ChartPadding;     // { top, right, bottom, left }
  animated?: boolean;
  animation?: AnimationConfig; // { duration, delay, easing }
  style?: ViewStyle;
}
\`\`\`

### CartesianChartProps (extends BaseChartProps)

For charts with X/Y axes (Line, Bar, etc.):

\`\`\`typescript
interface CartesianChartProps extends BaseChartProps {
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  tooltip?: TooltipConfig;
}
\`\`\`

### AxisConfig

\`\`\`typescript
interface AxisConfig {
  visible?: boolean;
  label?: string;
  tickCount?: number;
  tickFormat?: (value: any) => string;
  gridLines?: boolean;
  min?: number;
  max?: number;
}
\`\`\`

---

## Chart Components

### LineChart

\`\`\`typescript
interface LineChartProps extends CartesianChartProps {
  curve?: CurveType;        // 'linear' | 'monotone' | 'cardinal' | 'step' | ...
  strokeWidth?: number;
  showDots?: boolean;
  dotSize?: number;
  area?: boolean;            // Fill area under line
  areaOpacity?: number;
}
\`\`\`

### BarChart

\`\`\`typescript
interface BarChartProps extends CartesianChartProps {
  orientation?: 'vertical' | 'horizontal';
  grouped?: boolean;         // Side-by-side bars for multiple series
  stacked?: boolean;         // Stacked bars for multiple series
  barWidth?: number;
  borderRadius?: number;
  gap?: number;              // Gap between bars
}
\`\`\`

---

## Scales

\`\`\`typescript
// Linear scale for numeric data
interface LinearScaleConfig { domain?: [number, number]; nice?: boolean; }

// Band scale for categorical data
interface BandScaleConfig { padding?: number; align?: number; }

// Time scale for date data
interface TimeScaleConfig { domain?: [Date, Date]; }
\`\`\`

## Curve Types

\`\`\`typescript
type CurveType =
  | 'linear'      // Straight lines between points
  | 'monotone'    // Smooth curve preserving monotonicity
  | 'cardinal'    // Cardinal spline
  | 'step'        // Step function
  | 'stepBefore'  // Step before each point
  | 'stepAfter'   // Step after each point
  | 'basis'       // B-spline
  | 'natural';    // Natural cubic spline
\`\`\`
`,

  "idealyst://charts/examples": `# @idealyst/charts — Examples

## Line Chart

\`\`\`tsx
import React from 'react';
import { View, Text } from '@idealyst/components';
import { LineChart } from '@idealyst/charts';

const monthlySales = [
  { x: 'Jan', y: 4200 },
  { x: 'Feb', y: 5100 },
  { x: 'Mar', y: 4800 },
  { x: 'Apr', y: 6200 },
  { x: 'May', y: 5900 },
  { x: 'Jun', y: 7100 },
];

function SalesOverview() {
  return (
    <View padding="md" gap="md">
      <Text size="lg" weight="bold">Monthly Sales</Text>
      <LineChart
        data={[{ data: monthlySales, label: 'Revenue', color: '#4CAF50' }]}
        height={300}
        curve="monotone"
        showDots
        area
        areaOpacity={0.15}
        animated
        xAxis={{ label: 'Month' }}
        yAxis={{ label: 'Revenue ($)', tickFormat: (v) => \`$\${v / 1000}k\` }}
      />
    </View>
  );
}
\`\`\`

## Multi-Series Line Chart

\`\`\`tsx
import React from 'react';
import { LineChart } from '@idealyst/charts';

const series = [
  {
    data: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 150 },
      { x: 'Q3', y: 180 },
      { x: 'Q4', y: 210 },
    ],
    label: 'Product A',
    color: '#2196F3',
  },
  {
    data: [
      { x: 'Q1', y: 80 },
      { x: 'Q2', y: 110 },
      { x: 'Q3', y: 95 },
      { x: 'Q4', y: 140 },
    ],
    label: 'Product B',
    color: '#FF9800',
  },
];

function ComparisonChart() {
  return (
    <LineChart
      data={series}
      height={350}
      curve="monotone"
      showDots
      animated
    />
  );
}
\`\`\`

## Bar Chart

\`\`\`tsx
import React from 'react';
import { View, Text } from '@idealyst/components';
import { BarChart } from '@idealyst/charts';

const categories = [
  { x: 'Electronics', y: 45 },
  { x: 'Clothing', y: 32 },
  { x: 'Books', y: 18 },
  { x: 'Food', y: 56 },
  { x: 'Sports', y: 28 },
];

function CategoryBreakdown() {
  return (
    <View padding="md" gap="md">
      <Text size="lg" weight="bold">Sales by Category</Text>
      <BarChart
        data={[{ data: categories, label: 'Units Sold' }]}
        height={300}
        borderRadius={4}
        animated
        yAxis={{ tickFormat: (v) => \`\${v} units\` }}
      />
    </View>
  );
}
\`\`\`

## Stacked Bar Chart

\`\`\`tsx
import React from 'react';
import { BarChart } from '@idealyst/charts';

function StackedBarExample() {
  return (
    <BarChart
      data={[
        {
          data: [
            { x: 'Q1', y: 100 },
            { x: 'Q2', y: 120 },
            { x: 'Q3', y: 90 },
          ],
          label: 'Online',
          color: '#4CAF50',
        },
        {
          data: [
            { x: 'Q1', y: 60 },
            { x: 'Q2', y: 80 },
            { x: 'Q3', y: 70 },
          ],
          label: 'In-Store',
          color: '#2196F3',
        },
      ]}
      height={300}
      stacked
      animated
    />
  );
}
\`\`\`

## Horizontal Bar Chart

\`\`\`tsx
import React from 'react';
import { BarChart } from '@idealyst/charts';

function HorizontalBarExample() {
  const data = [
    { x: 'React', y: 85 },
    { x: 'Vue', y: 62 },
    { x: 'Angular', y: 45 },
    { x: 'Svelte', y: 38 },
  ];

  return (
    <BarChart
      data={[{ data, label: 'Popularity' }]}
      height={250}
      orientation="horizontal"
      animated
    />
  );
}
\`\`\`
`,
};
