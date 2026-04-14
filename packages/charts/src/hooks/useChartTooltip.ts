/**
 * useChartTooltip - Web Chart Tooltip Hook
 *
 * Tracks mouse position within the chart area, snaps to the nearest X column,
 * and returns all series data at that column. The tooltip is a single component
 * that animates smoothly between positions.
 */

import { useState, useCallback, useRef } from 'react';
import type { DataPoint, ChartDataSeries, ChartPadding, TooltipContext, TooltipEntry } from '../types';

/**
 * A screen-space data point used for hit detection
 */
export interface ScreenPoint {
  /** Screen X coordinate (within chart inner area) */
  x: number;
  /** Screen Y coordinate (within chart inner area) */
  y: number;
  /** Original data point */
  dataPoint: DataPoint;
  /** Series index */
  seriesIndex: number;
  /** Point index within the series */
  pointIndex: number;
}

/**
 * A screen-space bar used for hit detection
 */
export interface ScreenBar {
  /** Bar bounds */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Original data point */
  dataPoint: DataPoint;
  /** Series index */
  seriesIndex: number;
  /** Point index within the series */
  pointIndex: number;
}

export interface UseChartTooltipOptions {
  /** Whether tooltip is enabled */
  enabled: boolean;
  /** Screen-space points for line/scatter charts */
  points?: ScreenPoint[];
  /** Screen-space bars for bar charts */
  bars?: ScreenBar[];
  /** Series data for context */
  series: ChartDataSeries[];
  /** Series colors */
  colors: string[];
  /** Chart padding */
  padding: ChartPadding;
  /** Inner chart width (for bounds checking) */
  innerWidth?: number;
}

export interface UseChartTooltipResult {
  /** Tooltip context with all series at the hovered X column */
  tooltipContext: TooltipContext | null;
  /** Tooltip X position in container pixels (for absolute positioning) */
  tooltipX: number | null;
  /** The point index that is currently active (for highlighting in the chart) */
  activePointIndex: number | null;
  /** Props to spread onto the chart wrapper element */
  containerProps: {
    onMouseMove?: (e: React.MouseEvent) => void;
    onMouseLeave?: () => void;
  };
}

/**
 * Group screen points by their pointIndex (X column).
 * Returns a map from pointIndex to all points at that index,
 * plus the average X position for that column.
 */
interface PointColumn {
  pointIndex: number;
  avgX: number;
  points: ScreenPoint[];
}

function buildPointColumns(points: ScreenPoint[]): PointColumn[] {
  const byIndex = new Map<number, ScreenPoint[]>();

  for (const pt of points) {
    let arr = byIndex.get(pt.pointIndex);
    if (!arr) {
      arr = [];
      byIndex.set(pt.pointIndex, arr);
    }
    arr.push(pt);
  }

  const columns: PointColumn[] = [];
  byIndex.forEach((pts: ScreenPoint[], pointIndex: number) => {
    const avgX = pts.reduce((sum: number, p: ScreenPoint) => sum + p.x, 0) / pts.length;
    columns.push({ pointIndex, avgX, points: pts });
  });

  // Sort by X position
  columns.sort((a, b) => a.avgX - b.avgX);
  return columns;
}

/**
 * Group bars by their pointIndex (X column).
 */
interface BarColumn {
  pointIndex: number;
  centerX: number;
  bars: ScreenBar[];
}

function buildBarColumns(bars: ScreenBar[]): BarColumn[] {
  const byIndex = new Map<number, ScreenBar[]>();

  for (const bar of bars) {
    let arr = byIndex.get(bar.pointIndex);
    if (!arr) {
      arr = [];
      byIndex.set(bar.pointIndex, arr);
    }
    arr.push(bar);
  }

  const columns: BarColumn[] = [];
  byIndex.forEach((barGroup: ScreenBar[], pointIndex: number) => {
    // Center X across all bars in this column
    const centerX = barGroup.reduce((sum: number, b: ScreenBar) => sum + b.x + b.width / 2, 0) / barGroup.length;
    columns.push({ pointIndex, centerX, bars: barGroup });
  });

  columns.sort((a, b) => a.centerX - b.centerX);
  return columns;
}

function formatLabel(value: number | string | Date): string {
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

export function useChartTooltip(options: UseChartTooltipOptions): UseChartTooltipResult {
  const {
    enabled,
    points,
    bars,
    series,
    colors,
    padding,
    innerWidth,
  } = options;

  const [tooltipContext, setTooltipContext] = useState<TooltipContext | null>(null);
  const [tooltipX, setTooltipX] = useState<number | null>(null);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  // Cache columns so we don't rebuild on every mouse move
  const pointColumnsRef = useRef<PointColumn[]>([]);
  const barColumnsRef = useRef<BarColumn[]>([]);
  const prevPointsRef = useRef(points);
  const prevBarsRef = useRef(bars);

  // Rebuild columns when data changes
  if (points !== prevPointsRef.current) {
    prevPointsRef.current = points;
    pointColumnsRef.current = points && points.length > 0 ? buildPointColumns(points) : [];
  }
  if (bars !== prevBarsRef.current) {
    prevBarsRef.current = bars;
    barColumnsRef.current = bars && bars.length > 0 ? buildBarColumns(bars) : [];
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    // Convert to chart inner area coordinates
    const chartX = mouseX - padding.left;

    // Bounds check — if outside chart area, clear
    if (innerWidth !== undefined && (chartX < 0 || chartX > innerWidth)) {
      setTooltipContext(null);
      setTooltipX(null);
      setActivePointIndex(null);
      return;
    }

    // Line/scatter: find nearest X column
    const pointCols = pointColumnsRef.current;
    if (pointCols.length > 0) {
      // Find nearest column by X distance
      let nearest = pointCols[0];
      let nearestDist = Math.abs(nearest.avgX - chartX);
      for (let i = 1; i < pointCols.length; i++) {
        const dist = Math.abs(pointCols[i].avgX - chartX);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = pointCols[i];
        }
      }

      // Build entries for all series at this column
      const entries: TooltipEntry[] = [];
      let label = '';
      for (const pt of nearest.points) {
        const s = series[pt.seriesIndex];
        if (!s) continue;
        if (!label) label = formatLabel(pt.dataPoint.x);
        entries.push({
          point: pt.dataPoint,
          series: s,
          seriesIndex: pt.seriesIndex,
          pointIndex: pt.pointIndex,
          color: colors[pt.seriesIndex] || '#666',
        });
      }

      setTooltipContext({ entries, label });
      setTooltipX(nearest.avgX + padding.left);
      setActivePointIndex(nearest.pointIndex);
      return;
    }

    // Bar: find nearest column by X distance
    const barCols = barColumnsRef.current;
    if (barCols.length > 0) {
      let nearest = barCols[0];
      let nearestDist = Math.abs(nearest.centerX - chartX);
      for (let i = 1; i < barCols.length; i++) {
        const dist = Math.abs(barCols[i].centerX - chartX);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = barCols[i];
        }
      }

      const entries: TooltipEntry[] = [];
      let label = '';
      for (const bar of nearest.bars) {
        const s = series[bar.seriesIndex];
        if (!s) continue;
        if (!label) label = formatLabel(bar.dataPoint.x);
        entries.push({
          point: bar.dataPoint,
          series: s,
          seriesIndex: bar.seriesIndex,
          pointIndex: bar.pointIndex,
          color: colors[bar.seriesIndex] || '#666',
        });
      }

      setTooltipContext({ entries, label });
      setTooltipX(nearest.centerX + padding.left);
      setActivePointIndex(nearest.pointIndex);
      return;
    }

    // No data
    setTooltipContext(null);
    setTooltipX(null);
    setActivePointIndex(null);
  }, [series, colors, padding, innerWidth]);

  const onMouseLeave = useCallback(() => {
    setTooltipContext(null);
    setTooltipX(null);
    setActivePointIndex(null);
  }, []);

  if (!enabled) {
    return {
      tooltipContext: null,
      tooltipX: null,
      activePointIndex: null,
      containerProps: {},
    };
  }

  return {
    tooltipContext,
    tooltipX,
    activePointIndex,
    containerProps: {
      onMouseMove,
      onMouseLeave,
    },
  };
}
