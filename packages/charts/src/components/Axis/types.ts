/**
 * Axis Component Types
 */

import type { LinearScale, BandScale, TimeScale } from '../../core/scales/types';

/**
 * Supported scale types for axes
 */
export type AxisScale = LinearScale | BandScale | TimeScale;

/**
 * Common axis props
 */
export interface BaseAxisProps {
  /** Scale function */
  scale: AxisScale;
  /** Length of the axis (width for X, height for Y) */
  length: number;
  /** Number of ticks to display */
  tickCount?: number;
  /** Custom tick values */
  tickValues?: (number | string | Date)[];
  /** Format function for tick labels */
  tickFormat?: (value: number | string | Date) => string;
  /** Length of tick marks */
  tickLength?: number;
  /** Padding between tick and label */
  tickPadding?: number;
  /** Axis label text */
  label?: string;
  /** Font size for tick labels */
  fontSize?: number;
  /** Font size for axis label */
  labelFontSize?: number;
  /** Color for axis line and ticks */
  color?: string;
  /** Color for tick labels */
  labelColor?: string;
  /** Whether to show the axis line */
  showLine?: boolean;
  /** Whether to show tick marks */
  showTicks?: boolean;
  /** Whether to show tick labels */
  showLabels?: boolean;
}

/**
 * X-Axis specific props
 */
export interface XAxisProps extends BaseAxisProps {
  /** Y position of the axis */
  y: number;
  /** Rotation angle for tick labels (degrees) */
  tickRotation?: number;
}

/**
 * Y-Axis specific props
 */
export interface YAxisProps extends BaseAxisProps {
  /** X position of the axis */
  x: number;
  /** Position of the axis relative to the chart */
  position?: 'left' | 'right';
}

/**
 * Grid lines props
 */
export interface GridLinesProps {
  /** Scale for positioning grid lines */
  scale: AxisScale;
  /** Width of the chart area */
  width: number;
  /** Height of the chart area */
  height: number;
  /** Direction of grid lines */
  direction: 'horizontal' | 'vertical';
  /** Number of grid lines */
  count?: number;
  /** Custom tick values for grid lines */
  tickValues?: (number | string | Date)[];
  /** Grid line color */
  color?: string;
  /** Grid line opacity */
  opacity?: number;
  /** Dash array for dashed lines */
  dashArray?: number[];
}
