/**
 * @idealyst/charts
 *
 * Cross-platform animated charts for React and React Native.
 *
 * Features:
 * - SVG and Skia renderers
 * - Full animation support
 * - Theme integration
 * - Touch/mouse interactions
 * - Responsive sizing
 *
 * @example
 * ```tsx
 * import { LineChart, ChartProvider } from '@idealyst/charts';
 *
 * // Basic usage
 * <LineChart
 *   data={[{ id: 'sales', name: 'Sales', data: [...] }]}
 *   height={300}
 *   animate
 * />
 *
 * // With provider for app-wide defaults
 * <ChartProvider renderer="svg" defaultIntent="primary">
 *   <App />
 * </ChartProvider>
 * ```
 */

// Types
export * from './types';

// Core utilities
export * from './core';

// Renderers
export { svgRenderer, skiaRenderer, isSkiaAvailable } from './renderers';
export type {
  ChartRenderer,
  RendererType,
  RendererContextValue,
  CanvasProps,
  GroupProps,
  PathProps,
  RectProps,
  CircleProps,
  LineProps,
  TextProps,
} from './renderers/types';

// Container and Provider
export {
  ChartContainer,
  ChartContext,
  useChart,
  useChartOptional,
  ChartProvider,
  useChartProvider,
  useRenderer,
  useSeriesColor,
} from './components/ChartContainer';
export type {
  ChartContainerProps,
  ChartProviderProps,
  ChartProviderConfig,
} from './components/ChartContainer';

// Chart Components
export { LineChart, useLineChart } from './charts/LineChart';
export type { LineChartProps, ProcessedLineData } from './charts/LineChart';

export { BarChart, useBarChart } from './charts/BarChart';
export type { BarChartProps, ProcessedBarData, ProcessedBar } from './charts/BarChart';

// Axis Components
export { XAxis, YAxis, GridLines } from './components/Axis';
export type { XAxisProps, YAxisProps, GridLinesProps, AxisScale } from './components/Axis';

// Animation Hooks
export {
  useChartAnimation,
  useStaggeredAnimation,
} from './hooks';
export type {
  ChartAnimationConfig,
  ChartAnimationState,
  StaggeredAnimationConfig,
  StaggeredAnimationState,
} from './hooks';

// TODO: Additional charts to implement
// export { PieChart } from './charts/PieChart';
// export { AreaChart } from './charts/AreaChart';
// export { ScatterChart } from './charts/ScatterChart';
// export { CandlestickChart } from './charts/CandlestickChart';
