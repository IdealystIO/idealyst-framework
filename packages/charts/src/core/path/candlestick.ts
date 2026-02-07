/**
 * Candlestick Path Generator
 *
 * Generates SVG paths for OHLC (Open, High, Low, Close) candlestick charts.
 */

import { round } from './commands';

/**
 * OHLC data for a single candlestick
 */
export interface OHLCData {
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Configuration for candlestick rendering
 */
export interface CandlestickConfig {
  /** X position (center of candlestick) */
  x: number;
  /** Width of the body */
  bodyWidth: number;
  /** Width of the wick (default: 1) */
  wickWidth?: number;
  /** Scale function for Y values */
  yScale: (value: number) => number;
}

/**
 * Result of candlestick calculation
 */
export interface CandlestickGeometry {
  /** Whether this is a bullish (close > open) candlestick */
  bullish: boolean;
  /** Body rectangle */
  body: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Upper wick line */
  upperWick: {
    x: number;
    y1: number;
    y2: number;
  };
  /** Lower wick line */
  lowerWick: {
    x: number;
    y1: number;
    y2: number;
  };
}

/**
 * Calculate candlestick geometry from OHLC data
 *
 * @example
 * ```ts
 * const geometry = calculateCandlestick(
 *   { open: 100, high: 120, low: 90, close: 115 },
 *   {
 *     x: 50,
 *     bodyWidth: 20,
 *     yScale: (v) => 200 - v,  // Inverted for SVG
 *   }
 * );
 *
 * // geometry.bullish = true (close > open)
 * // geometry.body = { x: 40, y: 85, width: 20, height: 15 }
 * // geometry.upperWick = { x: 50, y1: 80, y2: 85 }
 * // geometry.lowerWick = { x: 50, y1: 100, y2: 110 }
 * ```
 */
export function calculateCandlestick(
  data: OHLCData,
  config: CandlestickConfig
): CandlestickGeometry {
  const { x, bodyWidth, yScale } = config;

  const { open, high, low, close } = data;
  const bullish = close >= open;

  // Scale Y values
  const yOpen = yScale(open);
  const yHigh = yScale(high);
  const yLow = yScale(low);
  const yClose = yScale(close);

  // Body (rectangle between open and close)
  const bodyTop = Math.min(yOpen, yClose);
  const bodyBottom = Math.max(yOpen, yClose);
  const bodyHeight = Math.max(bodyBottom - bodyTop, 1); // Minimum 1px height

  return {
    bullish,
    body: {
      x: round(x - bodyWidth / 2),
      y: round(bodyTop),
      width: round(bodyWidth),
      height: round(bodyHeight),
    },
    upperWick: {
      x: round(x),
      y1: round(yHigh),
      y2: round(bodyTop),
    },
    lowerWick: {
      x: round(x),
      y1: round(bodyBottom),
      y2: round(yLow),
    },
  };
}

/**
 * Generate SVG path for a candlestick
 *
 * Creates a single path that includes both the body and wicks.
 * Body is filled, wicks are strokes.
 */
export function generateCandlestickPath(
  data: OHLCData,
  config: CandlestickConfig
): string {
  const { x, bodyWidth, wickWidth = 1, yScale } = config;

  const { open, high, low, close } = data;

  // Scale Y values
  const yOpen = yScale(open);
  const yHigh = yScale(high);
  const yLow = yScale(low);
  const yClose = yScale(close);

  const bodyTop = Math.min(yOpen, yClose);
  const bodyBottom = Math.max(yOpen, yClose);
  const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

  const halfBody = bodyWidth / 2;
  const halfWick = wickWidth / 2;

  // Create a combined path for body and wicks
  // This allows a single fill for the entire candlestick
  return [
    // Upper wick (as a thin rect)
    `M ${round(x - halfWick)} ${round(yHigh)}`,
    `v ${round(bodyTop - yHigh)}`,
    `h ${round(wickWidth)}`,
    `v ${round(yHigh - bodyTop)}`,
    'Z',

    // Body (rectangle)
    `M ${round(x - halfBody)} ${round(bodyTop)}`,
    `h ${round(bodyWidth)}`,
    `v ${round(bodyHeight)}`,
    `h ${round(-bodyWidth)}`,
    'Z',

    // Lower wick (as a thin rect)
    `M ${round(x - halfWick)} ${round(bodyBottom)}`,
    `v ${round(yLow - bodyBottom)}`,
    `h ${round(wickWidth)}`,
    `v ${round(bodyBottom - yLow)}`,
    'Z',
  ].join(' ');
}

/**
 * Generate separate paths for body and wicks
 *
 * Useful when you want different styling for body vs wicks
 */
export function generateCandlestickParts(
  data: OHLCData,
  config: CandlestickConfig
): { bodyPath: string; wickPath: string; bullish: boolean } {
  const { x, bodyWidth, yScale } = config;

  const { open, high, low, close } = data;
  const bullish = close >= open;

  // Scale Y values
  const yOpen = yScale(open);
  const yHigh = yScale(high);
  const yLow = yScale(low);
  const yClose = yScale(close);

  const bodyTop = Math.min(yOpen, yClose);
  const bodyBottom = Math.max(yOpen, yClose);
  const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

  const halfBody = bodyWidth / 2;

  // Body path (rectangle)
  const bodyPath = [
    `M ${round(x - halfBody)} ${round(bodyTop)}`,
    `h ${round(bodyWidth)}`,
    `v ${round(bodyHeight)}`,
    `h ${round(-bodyWidth)}`,
    'Z',
  ].join(' ');

  // Wick path (single vertical line through center)
  const wickPath = [
    `M ${round(x)} ${round(yHigh)}`,
    `L ${round(x)} ${round(yLow)}`,
  ].join(' ');

  return { bodyPath, wickPath, bullish };
}

/**
 * Calculate the range needed to display OHLC data
 *
 * Returns min/max across all high/low values
 */
export function calculateOHLCRange(data: OHLCData[]): { min: number; max: number } {
  if (data.length === 0) return { min: 0, max: 0 };

  let min = Infinity;
  let max = -Infinity;

  for (const candle of data) {
    if (candle.low < min) min = candle.low;
    if (candle.high > max) max = candle.high;
  }

  return { min, max };
}

/**
 * Calculate volume bar dimensions
 *
 * Volume bars are typically shown below the candlestick chart
 */
export function calculateVolumeBar(
  volume: number,
  maxVolume: number,
  x: number,
  barWidth: number,
  areaHeight: number,
  areaBottom: number
): { x: number; y: number; width: number; height: number } {
  const normalizedHeight = maxVolume > 0 ? (volume / maxVolume) * areaHeight : 0;

  return {
    x: round(x - barWidth / 2),
    y: round(areaBottom - normalizedHeight),
    width: round(barWidth),
    height: round(normalizedHeight),
  };
}
