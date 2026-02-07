/**
 * LineChart Types
 */

import type {
  CartesianChartProps,
  CurveType,
  DataPoint,
  ChartDataSeries,
} from '../../types';

/**
 * LineChart specific props
 */
export interface LineChartProps extends CartesianChartProps {
  /** Curve interpolation type */
  curve?: CurveType;

  /** Stroke width for lines */
  strokeWidth?: number;

  /** Whether to show data point dots */
  showDots?: boolean;

  /** Radius of data point dots */
  dotRadius?: number;

  /** Whether to show area fill under the line */
  showArea?: boolean;

  /** Opacity of area fill (0-1) */
  areaOpacity?: number;

  /** Callback when a data point is pressed */
  onDataPointPress?: (point: DataPoint, seriesIndex: number, pointIndex: number) => void;

  /** Callback when hovering over a data point (web only) */
  onDataPointHover?: (point: DataPoint | null, seriesIndex: number, pointIndex: number) => void;
}

/**
 * Processed line data for rendering
 */
export interface ProcessedLineData {
  /** Series information */
  series: ChartDataSeries;
  /** Series index */
  seriesIndex: number;
  /** SVG path string for the line */
  linePath: string;
  /** SVG path string for the area (if showArea) */
  areaPath?: string;
  /** Processed points with screen coordinates */
  points: Array<{
    x: number;
    y: number;
    rawX: number | string | Date;
    rawY: number;
    pointIndex: number;
  }>;
  /** Color for this series */
  color: string;
  /** Approximate path length for animation */
  pathLength: number;
}
