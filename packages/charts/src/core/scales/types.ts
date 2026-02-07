/**
 * Scale Type Definitions
 *
 * Scales are functions that map data values (domain) to visual values (range).
 */

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

/**
 * Linear scale instance
 */
export interface LinearScale {
  /** Scale a value from domain to range */
  (value: number): number;
  /** Invert a range value back to domain */
  invert(value: number): number;
  /** Get the domain */
  domain(): [number, number];
  /** Get the range */
  range(): [number, number];
  /** Generate tick values */
  ticks(count?: number): number[];
  /** Create a copy with updated domain */
  copy(): LinearScale;
}

/**
 * Band scale instance
 */
export interface BandScale {
  /** Scale a category to its band start position */
  (value: string): number | undefined;
  /** Get the domain (category names) */
  domain(): string[];
  /** Get the range */
  range(): [number, number];
  /** Get the width of each band */
  bandwidth(): number;
  /** Get the step (band + padding) */
  step(): number;
  /** Create a copy */
  copy(): BandScale;
}

/**
 * Time scale instance
 */
export interface TimeScale {
  /** Scale a date to a pixel position */
  (value: Date): number;
  /** Invert a pixel position back to a date */
  invert(value: number): Date;
  /** Get the domain */
  domain(): [Date, Date];
  /** Get the range */
  range(): [number, number];
  /** Generate tick dates */
  ticks(count?: number): Date[];
  /** Create a copy */
  copy(): TimeScale;
}
