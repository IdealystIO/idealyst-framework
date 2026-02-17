/**
 * useLineChart Hook
 *
 * Processes line chart data and computes scales, paths, and rendering data.
 */

import { useMemo } from 'react';
import type { Theme } from '@idealyst/theme';
import type { ChartDataSeries, CurveType } from '../../types';
import { createLinearScale, createBandScale, extent } from '../../core/scales';
import { generateLinePath, generateAreaPath, approximatePathLength } from '../../core/path';
import type { Point } from '../../core/path/commands';
import type { ProcessedLineData } from './types';

/**
 * Intent color mapping
 */
const INTENT_COLORS: Record<string, string> = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#16a34a',
  warning: '#ca8a04',
  danger: '#dc2626',
  info: '#0891b2',
};

/**
 * Fallback colors for series without intent
 */
const SERIES_COLORS = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#dc2626', // Red
  '#ca8a04', // Yellow
  '#9333ea', // Purple
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#db2777', // Pink
];

/**
 * Get color for a series
 */
function getSeriesColor(
  series: ChartDataSeries,
  index: number,
  theme?: Theme
): string {
  // Custom color takes precedence
  if (series.color) return series.color;

  // Use intent color if specified
  if (series.intent) {
    if (theme?.intents?.[series.intent]) {
      return theme.intents[series.intent].primary;
    }
    return INTENT_COLORS[series.intent] || SERIES_COLORS[index % SERIES_COLORS.length];
  }

  // Fall back to palette
  return SERIES_COLORS[index % SERIES_COLORS.length];
}

/**
 * Determine if X values are numeric or categorical
 */
function isNumericXAxis(data: ChartDataSeries[]): boolean {
  if (data.length === 0 || data[0].data.length === 0) return true;

  const firstX = data[0].data[0].x;
  return typeof firstX === 'number' || firstX instanceof Date;
}

/**
 * Get all X values across all series
 */
function getAllXValues(data: ChartDataSeries[]): (number | string | Date)[] {
  const values: (number | string | Date)[] = [];
  const seen = new Set<string>();

  for (const series of data) {
    for (const point of series.data) {
      const key = String(point.x);
      if (!seen.has(key)) {
        seen.add(key);
        values.push(point.x);
      }
    }
  }

  return values;
}

/**
 * Get Y extent across all series
 */
function getYExtent(data: ChartDataSeries[]): [number, number] {
  const allY: number[] = [];

  for (const series of data) {
    for (const point of series.data) {
      allY.push(point.y);
    }
  }

  if (allY.length === 0) return [0, 100];

  const [min, max] = extent(allY);

  // Include 0 in range if data is all positive or all negative
  if (min > 0) return [0, max];
  if (max < 0) return [min, 0];

  return [min, max];
}

export interface UseLineChartOptions {
  /** Chart data series */
  data: ChartDataSeries | ChartDataSeries[];
  /** Inner width of chart area */
  innerWidth: number;
  /** Inner height of chart area */
  innerHeight: number;
  /** Curve type for line interpolation */
  curve?: CurveType;
  /** Whether to show area fill */
  showArea?: boolean;
  /** Theme for intent colors */
  theme?: Theme;
}

export interface UseLineChartResult {
  /** Processed line data for each series */
  lineData: ProcessedLineData[];
  /** X scale */
  xScale: ReturnType<typeof createLinearScale> | ReturnType<typeof createBandScale>;
  /** Y scale */
  yScale: ReturnType<typeof createLinearScale>;
  /** Whether X axis is numeric */
  isNumericX: boolean;
  /** All unique X values (for categorical) */
  xValues: (number | string | Date)[];
  /** Y domain extent */
  yExtent: [number, number];
}

/**
 * Hook for processing line chart data
 *
 * @example
 * ```tsx
 * const { lineData, xScale, yScale } = useLineChart({
 *   data: chartData,
 *   innerWidth: 400,
 *   innerHeight: 300,
 *   curve: 'monotone',
 * });
 * ```
 */
export function useLineChart(options: UseLineChartOptions): UseLineChartResult {
  const {
    data: rawData,
    innerWidth,
    innerHeight,
    curve = 'linear',
    showArea = false,
    theme,
  } = options;

  // Normalize data to array
  const data = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    return [rawData];
  }, [rawData]);

  // Determine X axis type
  const isNumericX = useMemo(() => isNumericXAxis(data), [data]);

  // Get all X values
  const xValues = useMemo(() => getAllXValues(data), [data]);

  // Get Y extent
  const yExtent = useMemo(() => getYExtent(data), [data]);

  // Create X scale
  const xScale = useMemo(() => {
    if (isNumericX) {
      // Numeric X scale
      const numericValues = xValues.map((v) =>
        v instanceof Date ? v.getTime() : Number(v)
      );
      const [min, max] = extent(numericValues);
      return createLinearScale({
        domain: [min, max],
        range: [0, innerWidth],
        nice: true,
      });
    } else {
      // Categorical X scale
      return createBandScale({
        domain: xValues.map(String),
        range: [0, innerWidth],
        padding: 0.1,
      });
    }
  }, [isNumericX, xValues, innerWidth]);

  // Create Y scale (inverted for SVG coordinates)
  const yScale = useMemo(() => {
    return createLinearScale({
      domain: yExtent,
      range: [innerHeight, 0],
      nice: true,
    });
  }, [yExtent, innerHeight]);

  // Process line data for each series
  const lineData = useMemo((): ProcessedLineData[] => {
    return data.map((series, seriesIndex) => {
      // Filter out series with no data
      if (series.data.length === 0) {
        return {
          series,
          seriesIndex,
          linePath: '',
          points: [],
          color: getSeriesColor(series, seriesIndex, theme),
          pathLength: 0,
        };
      }

      // Convert data points to screen coordinates
      const points: ProcessedLineData['points'] = series.data.map((point, pointIndex) => {
        let x: number;

        if (isNumericX) {
          const numericX = point.x instanceof Date ? point.x.getTime() : Number(point.x);
          x = (xScale as ReturnType<typeof createLinearScale>)(numericX) ?? 0;
        } else {
          // Band scale returns undefined for unknown values
          const bandX = (xScale as ReturnType<typeof createBandScale>)(String(point.x));
          const bandwidth = (xScale as ReturnType<typeof createBandScale>).bandwidth();
          x = (bandX ?? 0) + bandwidth / 2; // Center in band
        }

        const y = yScale(point.y);

        return {
          x,
          y,
          rawX: point.x,
          rawY: point.y,
          pointIndex,
        };
      });

      // Generate path
      const pathPoints: Point[] = points.map((p) => ({ x: p.x, y: p.y }));
      const linePath = generateLinePath(pathPoints, { curve });

      // Generate area path if needed
      const areaPath = showArea
        ? generateAreaPath(pathPoints, innerHeight, { curve })
        : undefined;

      // Approximate path length for animation
      const pathLength = approximatePathLength(pathPoints);

      return {
        series,
        seriesIndex,
        linePath,
        areaPath,
        points,
        color: getSeriesColor(series, seriesIndex, theme),
        pathLength,
      };
    });
  }, [data, isNumericX, xScale, yScale, curve, showArea, innerHeight, theme]);

  return {
    lineData,
    xScale,
    yScale,
    isNumericX,
    xValues,
    yExtent,
  };
}
