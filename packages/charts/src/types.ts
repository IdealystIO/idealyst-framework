/**
 * @idealyst/charts - Core Type Definitions
 *
 * Shared types used across all chart components, renderers, and utilities.
 */

import type { Intent, Size } from '@idealyst/theme';
import type { ReactNode } from 'react';

// =============================================================================
// Data Types
// =============================================================================

/**
 * A single data point in a chart series
 */
export interface DataPoint {
  /** X-axis value (numeric, categorical, or date) */
  x: number | string | Date;
  /** Y-axis value */
  y: number;
  /** Optional label for this point */
  label?: string;
  /** Optional custom color override */
  color?: string;
  /** Additional metadata for tooltips/callbacks */
  meta?: Record<string, unknown>;
}

/**
 * A series of data points with styling options
 */
export interface ChartDataSeries {
  /** Unique identifier for this series */
  id: string;
  /** Display name (shown in legend/tooltip) */
  name: string;
  /** Array of data points */
  data: DataPoint[];
  /** Custom color for this series */
  color?: string;
  /** Theme intent for automatic coloring */
  intent?: Intent;
  /** Whether this series is visible */
  visible?: boolean;
}

/**
 * OHLC data point for candlestick charts
 */
export interface CandlestickDataPoint {
  /** Time or index */
  x: Date | number;
  /** Opening price */
  open: number;
  /** Highest price */
  high: number;
  /** Lowest price */
  low: number;
  /** Closing price */
  close: number;
  /** Optional volume */
  volume?: number;
  /** Additional metadata */
  meta?: Record<string, unknown>;
}

/**
 * Data point for pie/donut charts
 */
export interface PieDataPoint {
  /** Numeric value (determines slice size) */
  value: number;
  /** Display label */
  label: string;
  /** Custom color override */
  color?: string;
  /** Theme intent for automatic coloring */
  intent?: Intent;
  /** Additional metadata */
  meta?: Record<string, unknown>;
}

/**
 * Normalized data point with screen coordinates
 */
export interface NormalizedDataPoint {
  /** Screen X coordinate */
  x: number;
  /** Screen Y coordinate */
  y: number;
  /** Original X value */
  rawX: number | string | Date;
  /** Original Y value */
  rawY: number;
  /** Index of the series this point belongs to */
  seriesIndex: number;
  /** Index within the series */
  pointIndex: number;
  /** Carried metadata */
  meta?: Record<string, unknown>;
}

// =============================================================================
// Chart Configuration
// =============================================================================

/**
 * Chart padding/margin configuration
 */
export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Axis configuration
 */
export interface AxisConfig {
  /** Whether to show the axis */
  show?: boolean;
  /** Axis label text */
  label?: string;
  /** Number of ticks to show */
  tickCount?: number;
  /** Custom tick formatter */
  tickFormat?: (value: number | string | Date) => string;
  /** Whether to show grid lines */
  gridLines?: boolean;
  /** Minimum value (auto if not specified) */
  min?: number;
  /** Maximum value (auto if not specified) */
  max?: number;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Whether animations are enabled */
  enabled?: boolean;
  /** Animation duration in ms */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Easing function name */
  easing?: 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
}

// =============================================================================
// Renderer Types
// =============================================================================

/**
 * Available renderer types
 */
export type RendererType = 'svg' | 'skia' | 'auto';

/**
 * Renderer context value
 */
export interface RendererContextValue {
  /** Current active renderer */
  renderer: 'svg' | 'skia';
  /** Whether Skia is available */
  skiaAvailable: boolean;
}

// =============================================================================
// Chart Context
// =============================================================================

/**
 * Chart context value shared across components
 */
export interface ChartContextValue {
  /** Total width of chart */
  width: number;
  /** Total height of chart */
  height: number;
  /** Chart padding */
  padding: ChartPadding;
  /** Inner width (width - padding) */
  innerWidth: number;
  /** Inner height (height - padding) */
  innerHeight: number;
  /** Theme intent */
  intent: Intent;
  /** Size variant */
  size: Size;
  /** Active renderer */
  renderer: 'svg' | 'skia';
}

// =============================================================================
// Base Props
// =============================================================================

/**
 * Base props shared by all chart components
 */
export interface BaseChartProps {
  // Data
  /** Chart data (series array or single series) */
  data: ChartDataSeries[] | ChartDataSeries;

  // Dimensions
  /** Chart width (number for pixels, string for percentage/other CSS) */
  width?: number | string;
  /** Chart height */
  height?: number | string;
  /** Aspect ratio (width/height) - used if height not specified */
  aspectRatio?: number;
  /** Padding around the chart area */
  padding?: Partial<ChartPadding> | number;

  // Theming
  /** Theme intent for default colors */
  intent?: Intent;
  /** Size variant affecting spacing and text size */
  size?: Size;

  // Renderer
  /** Which renderer to use */
  renderer?: RendererType;

  // Animation
  /** Enable/disable animations */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Animation delay in ms */
  animationDelay?: number;

  // Interaction
  /** Enable interactive features */
  interactive?: boolean;
  /** Show tooltip on hover/touch */
  showTooltip?: boolean;
  /** Callback when a data point is pressed */
  onDataPointPress?: (point: DataPoint, seriesIndex: number, pointIndex: number) => void;

  // Legend
  /** Show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';

  // Accessibility
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
  /** HTML id attribute */
  id?: string;
}

/**
 * Props for charts with cartesian (X/Y) axes
 */
export interface CartesianChartProps extends BaseChartProps {
  /** X-axis configuration */
  xAxis?: AxisConfig;
  /** Y-axis configuration */
  yAxis?: AxisConfig;
  /** Show X-axis (shorthand for xAxis.show) */
  showXAxis?: boolean;
  /** Show Y-axis (shorthand for yAxis.show) */
  showYAxis?: boolean;
  /** Show grid lines (shorthand) */
  showGrid?: boolean;
}

// =============================================================================
// Path Commands
// =============================================================================

// Note: PathCommandType and PathCommand are exported from './core/path/commands'

/**
 * Curve interpolation type for line/area charts
 */
export type CurveType = 'linear' | 'monotone' | 'cardinal' | 'step' | 'stepBefore' | 'stepAfter' | 'basis';

// =============================================================================
// Interaction Types
// =============================================================================

/**
 * Gesture state for chart interactions
 */
export interface ChartGestureState {
  /** Current touch/pointer position in chart coordinates */
  position: { x: number; y: number } | null;
  /** Position as percentage of chart area (0-1) */
  normalizedPosition: { x: number; y: number } | null;
  /** Closest data point to current position */
  nearestPoint: NormalizedDataPoint | null;
  /** Currently active series index */
  activeSeriesIndex: number;
  /** Currently active point index */
  activePointIndex: number;
  /** Type of gesture in progress */
  gestureType: 'none' | 'tap' | 'pan' | 'pinch' | 'longPress';
  /** Current zoom level (1 = 100%) */
  zoomLevel: number;
  /** Current pan offset */
  panOffset: { x: number; y: number };
}

/**
 * Tooltip configuration
 */
export interface TooltipConfig {
  /** Custom tooltip content renderer */
  renderContent?: (point: NormalizedDataPoint, series: ChartDataSeries) => ReactNode;
  /** Preferred placement */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  /** Offset from anchor point */
  offset?: number;
}

// =============================================================================
// Scale Types
// =============================================================================

/**
 * Scale domain extent
 */
export interface DomainExtent {
  min: number;
  max: number;
}

/**
 * Generic scale interface
 */
export interface Scale<TDomain = number, TRange = number> {
  /** Set or get domain */
  domain(values?: [TDomain, TDomain]): Scale<TDomain, TRange> | [TDomain, TDomain];
  /** Set or get range */
  range(values?: [TRange, TRange]): Scale<TDomain, TRange> | [TRange, TRange];
  /** Convert domain value to range value */
  scale(value: TDomain): TRange;
  /** Convert range value back to domain value */
  invert?(value: TRange): TDomain;
  /** Get tick values */
  ticks?(count?: number): TDomain[];
  /** Get bandwidth (for band scales) */
  bandwidth?(): number;
}

// =============================================================================
// Theme Integration
// =============================================================================

/**
 * Default padding values by size
 */
export const DEFAULT_PADDING: Record<Size, ChartPadding> = {
  xs: { top: 8, right: 8, bottom: 24, left: 32 },
  sm: { top: 12, right: 12, bottom: 32, left: 40 },
  md: { top: 16, right: 16, bottom: 40, left: 48 },
  lg: { top: 20, right: 20, bottom: 48, left: 56 },
  xl: { top: 24, right: 24, bottom: 56, left: 64 },
};

/**
 * Default animation durations by type
 */
export const ANIMATION_DURATIONS = {
  entrance: 750,
  transition: 300,
  hover: 100,
  tooltip: 150,
} as const;

/**
 * Touch target sizing constants
 */
export const TOUCH_TARGETS = {
  /** Minimum touch target size (44pt per Apple HIG) */
  MINIMUM_SIZE: 44,
  /** Expanded hit area around data points */
  POINT_HIT_SLOP: 20,
  /** Hit area for legend items */
  LEGEND_HIT_SLOP: 12,
} as const;
