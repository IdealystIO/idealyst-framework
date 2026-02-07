/**
 * BarChart Types
 */

import type { CartesianChartProps, DataPoint, ChartDataSeries } from '../../types';

/**
 * BarChart specific props
 */
export interface BarChartProps extends CartesianChartProps {
  /** Bar orientation */
  orientation?: 'vertical' | 'horizontal';

  /** Whether to group bars for multiple series */
  grouped?: boolean;

  /** Whether to stack bars for multiple series */
  stacked?: boolean;

  /** Corner radius for bars */
  barRadius?: number;

  /** Padding between bars (0-1) */
  barPadding?: number;

  /** Padding between bar groups (0-1) */
  groupPadding?: number;

  /** Callback when a bar is pressed */
  onBarPress?: (point: DataPoint, seriesIndex: number, pointIndex: number) => void;
}

/**
 * Processed bar data for rendering
 */
export interface ProcessedBarData {
  /** Series information */
  series: ChartDataSeries;
  /** Series index */
  seriesIndex: number;
  /** Individual bars */
  bars: ProcessedBar[];
  /** Color for this series */
  color: string;
}

/**
 * Single processed bar
 */
export interface ProcessedBar {
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** Original data point */
  dataPoint: DataPoint;
  /** Point index in series */
  pointIndex: number;
  /** Category value (for X axis label) */
  category: string;
  /** Numeric value */
  value: number;
}
