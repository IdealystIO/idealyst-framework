/**
 * useBarChart Hook
 *
 * Processes bar chart data and computes scales, bar positions, and rendering data.
 */

import { useMemo } from 'react';
import type { Theme } from '@idealyst/theme';
import type { ChartDataSeries } from '../../types';
import { createLinearScale, createBandScale, extent } from '../../core/scales';
import type { ProcessedBarData, ProcessedBar } from './types';

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
  if (series.color) return series.color;

  if (series.intent) {
    if (theme?.intents?.[series.intent]) {
      return theme.intents[series.intent].primary;
    }
    return INTENT_COLORS[series.intent] || SERIES_COLORS[index % SERIES_COLORS.length];
  }

  return SERIES_COLORS[index % SERIES_COLORS.length];
}

/**
 * Get all unique categories across all series
 */
function getAllCategories(data: ChartDataSeries[]): string[] {
  const categories: string[] = [];
  const seen = new Set<string>();

  for (const series of data) {
    for (const point of series.data) {
      const category = String(point.x);
      if (!seen.has(category)) {
        seen.add(category);
        categories.push(category);
      }
    }
  }

  return categories;
}

/**
 * Get Y extent across all series (including stacking)
 */
function getYExtent(data: ChartDataSeries[], stacked: boolean): [number, number] {
  if (!stacked) {
    // Simple extent of all values
    const allY: number[] = [];
    for (const series of data) {
      for (const point of series.data) {
        allY.push(point.y);
      }
    }
    if (allY.length === 0) return [0, 100];
    const [min, max] = extent(allY);
    return [Math.min(0, min), Math.max(0, max)];
  }

  // Stacked: compute cumulative values per category
  const categories = getAllCategories(data);
  const categoryTotals = new Map<string, { positive: number; negative: number }>();

  for (const category of categories) {
    categoryTotals.set(category, { positive: 0, negative: 0 });
  }

  for (const series of data) {
    for (const point of series.data) {
      const category = String(point.x);
      const totals = categoryTotals.get(category)!;
      if (point.y >= 0) {
        totals.positive += point.y;
      } else {
        totals.negative += point.y;
      }
    }
  }

  let min = 0;
  let max = 0;
  for (const totals of categoryTotals.values()) {
    min = Math.min(min, totals.negative);
    max = Math.max(max, totals.positive);
  }

  return [min, max];
}

export interface UseBarChartOptions {
  /** Chart data series */
  data: ChartDataSeries | ChartDataSeries[];
  /** Inner width of chart area */
  innerWidth: number;
  /** Inner height of chart area */
  innerHeight: number;
  /** Bar orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Whether bars are grouped */
  grouped?: boolean;
  /** Whether bars are stacked */
  stacked?: boolean;
  /** Padding between categories */
  barPadding?: number;
  /** Padding between bars in a group */
  groupPadding?: number;
  /** Theme for intent colors */
  theme?: Theme;
}

export interface UseBarChartResult {
  /** Processed bar data for each series */
  barData: ProcessedBarData[];
  /** Category scale (X for vertical, Y for horizontal) */
  categoryScale: ReturnType<typeof createBandScale>;
  /** Value scale (Y for vertical, X for horizontal) */
  valueScale: ReturnType<typeof createLinearScale>;
  /** All categories */
  categories: string[];
  /** Value extent */
  valueExtent: [number, number];
}

/**
 * Hook for processing bar chart data
 */
export function useBarChart(options: UseBarChartOptions): UseBarChartResult {
  const {
    data: rawData,
    innerWidth,
    innerHeight,
    orientation = 'vertical',
    grouped = false,
    stacked = false,
    barPadding = 0.2,
    groupPadding = 0.1,
    theme,
  } = options;

  // Normalize data to array
  const data = useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    return [rawData];
  }, [rawData]);

  // Get all categories
  const categories = useMemo(() => getAllCategories(data), [data]);

  // Get value extent
  const valueExtent = useMemo(() => getYExtent(data, stacked), [data, stacked]);

  // Create category scale (band scale)
  const categoryScale = useMemo(() => {
    const range: [number, number] =
      orientation === 'vertical' ? [0, innerWidth] : [0, innerHeight];

    return createBandScale({
      domain: categories,
      range,
      padding: barPadding,
    });
  }, [categories, orientation, innerWidth, innerHeight, barPadding]);

  // Create value scale (linear scale)
  const valueScale = useMemo(() => {
    const range: [number, number] =
      orientation === 'vertical' ? [innerHeight, 0] : [0, innerWidth];

    return createLinearScale({
      domain: valueExtent,
      range,
      nice: true,
    });
  }, [valueExtent, orientation, innerWidth, innerHeight]);

  // Process bar data
  const barData = useMemo((): ProcessedBarData[] => {
    const seriesCount = data.length;
    const bandwidth = categoryScale.bandwidth();

    // Track stacking positions per category
    const stackPositions = new Map<string, { positive: number; negative: number }>();
    if (stacked) {
      for (const category of categories) {
        stackPositions.set(category, { positive: 0, negative: 0 });
      }
    }

    return data.map((series, seriesIndex) => {
      const color = getSeriesColor(series, seriesIndex, theme);

      const bars: ProcessedBar[] = series.data.map((point, pointIndex) => {
        const category = String(point.x);
        const value = point.y;

        // Get category position
        const categoryPos = categoryScale(category) ?? 0;

        // Calculate bar dimensions based on mode
        let barX: number;
        let barY: number;
        let barWidth: number;
        let barHeight: number;

        if (orientation === 'vertical') {
          if (grouped && seriesCount > 1) {
            // Grouped bars: divide bandwidth among series
            const groupBandwidth = bandwidth / seriesCount;
            const groupGap = groupBandwidth * groupPadding;
            barWidth = groupBandwidth - groupGap;
            barX = categoryPos + seriesIndex * groupBandwidth + groupGap / 2;
          } else {
            // Single series or stacked
            barWidth = bandwidth;
            barX = categoryPos;
          }

          if (stacked) {
            // Stacked: accumulate from previous
            const stack = stackPositions.get(category)!;
            if (value >= 0) {
              const startY = valueScale(stack.positive);
              stack.positive += value;
              const endY = valueScale(stack.positive);
              barY = endY;
              barHeight = startY - endY;
            } else {
              const startY = valueScale(stack.negative);
              stack.negative += value;
              const endY = valueScale(stack.negative);
              barY = startY;
              barHeight = endY - startY;
            }
          } else {
            // Non-stacked
            const zeroY = valueScale(0);
            const valueY = valueScale(value);
            if (value >= 0) {
              barY = valueY;
              barHeight = zeroY - valueY;
            } else {
              barY = zeroY;
              barHeight = valueY - zeroY;
            }
          }
        } else {
          // Horizontal orientation
          if (grouped && seriesCount > 1) {
            const groupBandwidth = bandwidth / seriesCount;
            const groupGap = groupBandwidth * groupPadding;
            barHeight = groupBandwidth - groupGap;
            barY = categoryPos + seriesIndex * groupBandwidth + groupGap / 2;
          } else {
            barHeight = bandwidth;
            barY = categoryPos;
          }

          if (stacked) {
            const stack = stackPositions.get(category)!;
            if (value >= 0) {
              const startX = valueScale(stack.positive);
              stack.positive += value;
              const endX = valueScale(stack.positive);
              barX = startX;
              barWidth = endX - startX;
            } else {
              const startX = valueScale(stack.negative);
              stack.negative += value;
              const endX = valueScale(stack.negative);
              barX = endX;
              barWidth = startX - endX;
            }
          } else {
            const zeroX = valueScale(0);
            const valueX = valueScale(value);
            if (value >= 0) {
              barX = zeroX;
              barWidth = valueX - zeroX;
            } else {
              barX = valueX;
              barWidth = zeroX - valueX;
            }
          }
        }

        return {
          x: barX,
          y: barY,
          width: Math.max(0, barWidth),
          height: Math.max(0, barHeight),
          dataPoint: point,
          pointIndex,
          category,
          value,
        };
      });

      return {
        series,
        seriesIndex,
        bars,
        color,
      };
    });
  }, [
    data,
    categories,
    categoryScale,
    valueScale,
    orientation,
    grouped,
    stacked,
    groupPadding,
    theme,
  ]);

  return {
    barData,
    categoryScale,
    valueScale,
    categories,
    valueExtent,
  };
}
