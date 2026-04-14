/**
 * Scale Type Definitions
 *
 * Re-exports D3 scale types under our existing names for API stability.
 * Config interfaces define our creation API.
 */

import type { ScaleLinear, ScaleBand, ScaleTime } from 'd3-scale';

// =============================================================================
// Scale Instances (backed by D3)
// =============================================================================

/** Linear scale — maps continuous numeric domain to continuous range */
export type LinearScale = ScaleLinear<number, number>;

/** Band scale — maps discrete categorical domain to continuous bands */
export type BandScale = ScaleBand<string>;

/** Time scale — maps Date domain to continuous range */
export type TimeScale = ScaleTime<number, number>;

// =============================================================================
// Scale Configuration (our creation API)
// =============================================================================

/**
 * Configuration for linear scales (numeric data)
 */
export interface LinearScaleConfig {
  /** Input data range [min, max] */
  domain: [number, number];
  /** Output pixel range [min, max] */
  range: [number, number];
  /** Round domain to "nice" values */
  nice?: boolean;
  /** Clamp output to range bounds */
  clamp?: boolean;
}

/**
 * Configuration for band scales (categorical data)
 */
export interface BandScaleConfig {
  /** Category names/values */
  domain: string[];
  /** Output pixel range [min, max] */
  range: [number, number];
  /** Inner padding between bands (0-1) */
  paddingInner?: number;
  /** Outer padding on edges (0-1) */
  paddingOuter?: number;
  /** Shorthand for setting both paddings equally */
  padding?: number;
  /** Band alignment within step (0-1, default 0.5 = centered) */
  align?: number;
}

/**
 * Configuration for time scales (date data)
 */
export interface TimeScaleConfig {
  /** Date range [min, max] */
  domain: [Date, Date];
  /** Output pixel range [min, max] */
  range: [number, number];
  /** Round domain to nice time boundaries */
  nice?: boolean;
  /** Clamp output to range bounds */
  clamp?: boolean;
}
