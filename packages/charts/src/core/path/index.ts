/**
 * Path Generation Utilities
 *
 * Functions for generating SVG paths for various chart types.
 */

// Core path commands
export * from './commands';

// Line and area paths
export { generateLinePath, generateAreaPath, approximatePathLength } from './line';
export type { LinePathConfig } from './line';

// Arc paths (pie/donut)
export {
  generateArcPath,
  getArcCentroid,
  calculateArcAngles,
  generateRadialLine,
} from './arc';
export type { ArcConfig, ArcCentroid } from './arc';

// Bar paths
export {
  generateBarRect,
  generateBarPath,
  calculateBarDimensions,
  calculateGroupedBarPosition,
  calculateStackedBarPositions,
} from './bar';
export type { BarConfig, BarRect, BarLayoutConfig } from './bar';

// Candlestick paths
export {
  calculateCandlestick,
  generateCandlestickPath,
  generateCandlestickParts,
  calculateOHLCRange,
  calculateVolumeBar,
} from './candlestick';
export type { OHLCData, CandlestickConfig, CandlestickGeometry } from './candlestick';

// Path interpolation
export {
  lerp,
  lerpPoint,
  interpolatePoints,
  normalizePointArrays,
  resamplePoints,
  parsePathToPoints,
  pointsToPath,
  interpolatePath,
  easedInterpolate,
  easings,
} from './interpolation';
