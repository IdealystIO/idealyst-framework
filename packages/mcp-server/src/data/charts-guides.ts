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
      data={[{ id: 'sales', name: 'Sales', data }]}
      height={300}
      animate
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
  label?: string;     // Optional label for THIS individual point
  color?: string;
  metadata?: Record<string, unknown>;
}
\`\`\`

### ChartDataSeries

A series is a named collection of data points. It has EXACTLY these properties:

\`\`\`typescript
interface ChartDataSeries {
  id: string;             // REQUIRED — Unique identifier for this series
  name: string;           // REQUIRED — Display name (shown in legend/tooltip)
  data: DataPoint[];      // REQUIRED — Array of data points
  color?: string;         // Optional — Custom color for this series
  intent?: Intent;        // Optional — Theme intent for automatic coloring
  visible?: boolean;      // Optional — Whether this series is visible
}
\`\`\`

> **WARNING:** \`ChartDataSeries\` has NO \`label\` property. Use \`name\` for the series display name. Only \`DataPoint\` has \`label\` (for individual point labels). Adding \`label\` to a series object will cause a TypeScript error (TS2353: excess property check).

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
  data: ChartDataSeries[] | ChartDataSeries;
  height?: number | string;
  width?: number | string;
  padding?: Partial<ChartPadding> | number;
  animate?: boolean;         // NOTE: 'animate' — NOT 'animated'
  animationDuration?: number;
  animationDelay?: number;
  intent?: Intent;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  interactive?: boolean;
  showTooltip?: boolean;
}
\`\`\`

> **IMPORTANT:** The prop is \`animate\` — NOT \`animated\`. Using \`animated\` will cause a TS error.

### CartesianChartProps (extends BaseChartProps)

For charts with X/Y axes (Line, Bar, etc.):

\`\`\`typescript
interface CartesianChartProps extends BaseChartProps {
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  showXAxis?: boolean;      // Shorthand for xAxis.show
  showYAxis?: boolean;      // Shorthand for yAxis.show
  showGrid?: boolean;       // Shorthand for grid lines
}
\`\`\`

### AxisConfig

\`\`\`typescript
interface AxisConfig {
  show?: boolean;           // Use 'show' — NOT 'visible'
  label?: string;           // Axis label text
  tickCount?: number;       // Number of ticks to show
  tickFormat?: (value: number | string | Date) => string;  // Custom tick formatter
  gridLines?: boolean;      // Whether to show grid lines
  min?: number;             // Minimum value (auto if not set)
  max?: number;             // Maximum value (auto if not set)
}
\`\`\`

> **Common mistakes:**
> - Use \`show\` — NOT \`visible\`. \`{ visible: true }\` will cause a TS error.
> - \`tickFormat\` parameter is \`number | string | Date\` — NOT just \`number\`. Example:
>   \`\`\`typescript
>   tickFormat: (value: number | string | Date) => \`$\${Number(value) / 1000}k\`
>   \`\`\`

---

## Chart Components

### LineChart

\`\`\`typescript
interface LineChartProps extends CartesianChartProps {
  curve?: CurveType;        // 'linear' | 'monotone' | 'cardinal' | 'step' | ...
  strokeWidth?: number;
  showDots?: boolean;
  dotRadius?: number;        // NOTE: 'dotRadius' — NOT 'dotSize'
  showArea?: boolean;        // NOTE: 'showArea' — NOT 'area'
  areaOpacity?: number;
}
\`\`\`

> **Common mistakes:** Use \`showArea\` (NOT \`area\`), \`dotRadius\` (NOT \`dotSize\`), \`animate\` (NOT \`animated\`).

### BarChart

\`\`\`typescript
interface BarChartProps extends CartesianChartProps {
  orientation?: 'vertical' | 'horizontal';
  grouped?: boolean;         // Side-by-side bars for multiple series
  stacked?: boolean;         // Stacked bars for multiple series
  barRadius?: number;        // NOTE: 'barRadius' — NOT 'borderRadius'
  barPadding?: number;       // Padding between bars (0-1)
  groupPadding?: number;     // Padding between bar groups (0-1)
}
\`\`\`

> **Common mistakes:** Use \`barRadius\` (NOT \`borderRadius\`), \`barPadding\` (NOT \`gap\` or \`barWidth\`).

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

> **Before writing chart code, remember these rules:**
> - Series uses \`name\` (NOT \`label\`). Adding \`label\` to \`ChartDataSeries\` causes TS2353.
> - Use \`animate\` (NOT \`animated\`), \`showArea\` (NOT \`area\`), \`dotRadius\` (NOT \`dotSize\`), \`barRadius\` (NOT \`borderRadius\`).
> - \`tickFormat\` signature is \`(value: number | string | Date) => string\` — NOT \`(v: number) => string\`.
> - \`AxisConfig\` uses \`show\` (NOT \`visible\`) to control axis visibility.

## Line Chart

\`\`\`tsx
import React from 'react';
import { View, Text } from '@idealyst/components';
import { LineChart } from '@idealyst/charts';
import type { ChartDataSeries } from '@idealyst/charts';

const monthlySales = [
  { x: 'Jan', y: 4200 },
  { x: 'Feb', y: 5100 },
  { x: 'Mar', y: 4800 },
  { x: 'Apr', y: 6200 },
  { x: 'May', y: 5900 },
  { x: 'Jun', y: 7100 },
];

// Series uses 'name' for display — NOT 'label'
const revenueData: ChartDataSeries[] = [
  { id: 'revenue', name: 'Revenue', data: monthlySales, color: '#4CAF50' },
];

function SalesOverview() {
  return (
    <View padding="md" gap="md">
      <Text typography="h6" weight="bold">Monthly Sales</Text>
      <LineChart
        data={revenueData}
        height={300}
        curve="monotone"
        showDots
        showArea
        areaOpacity={0.15}
        animate
        xAxis={{ label: 'Month' }}
        yAxis={{
          label: 'Revenue ($)',
          // tickFormat param type is (value: number | string | Date) => string
          tickFormat: (value: number | string | Date) => \`$\${Number(value) / 1000}k\`,
        }}
      />
    </View>
  );
}
\`\`\`

## Multi-Series Line Chart

\`\`\`tsx
import React from 'react';
import { LineChart } from '@idealyst/charts';
import type { ChartDataSeries } from '@idealyst/charts';

// Each series has: id, name, data, color? — NO 'label' property
const series: ChartDataSeries[] = [
  {
    id: 'product-a',
    name: 'Product A',   // Use 'name' — NOT 'label'
    data: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 150 },
      { x: 'Q3', y: 180 },
      { x: 'Q4', y: 210 },
    ],
    color: '#2196F3',
  },
  {
    id: 'product-b',
    name: 'Product B',   // Use 'name' — NOT 'label'
    data: [
      { x: 'Q1', y: 80 },
      { x: 'Q2', y: 110 },
      { x: 'Q3', y: 95 },
      { x: 'Q4', y: 140 },
    ],
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
      animate
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
      <Text typography="h6" weight="bold">Sales by Category</Text>
      <BarChart
        data={[{ id: 'units', name: 'Units Sold', data: categories }]}
        height={300}
        barRadius={4}
        animate
        yAxis={{ tickFormat: (value: number | string | Date) => \`\${value} units\` }}
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
          id: 'online',
          name: 'Online',
          data: [
            { x: 'Q1', y: 100 },
            { x: 'Q2', y: 120 },
            { x: 'Q3', y: 90 },
          ],
          color: '#4CAF50',
        },
        {
          id: 'in-store',
          name: 'In-Store',
          data: [
            { x: 'Q1', y: 60 },
            { x: 'Q2', y: 80 },
            { x: 'Q3', y: 70 },
          ],
          color: '#2196F3',
        },
      ]}
      height={300}
      stacked
      animate
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
      data={[{ id: 'popularity', name: 'Popularity', data }]}
      height={250}
      orientation="horizontal"
      animate
    />
  );
}
\`\`\`
`,
};
