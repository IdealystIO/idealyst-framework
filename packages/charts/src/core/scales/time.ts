/**
 * Time Scale
 *
 * Maps Date values to continuous output range.
 * Used for time series charts.
 */

import type { TimeScaleConfig, TimeScale } from './types';

/**
 * Time interval types for nice ticks
 */
type TimeInterval = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

interface TimeIntervalConfig {
  name: TimeInterval;
  ms: number;
  step: (date: Date, count: number) => Date;
  floor: (date: Date) => Date;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY; // Approximate
const YEAR = 365 * DAY; // Approximate

/**
 * Time interval configurations
 */
const TIME_INTERVALS: TimeIntervalConfig[] = [
  {
    name: 'second',
    ms: SECOND,
    step: (d, n) => new Date(d.getTime() + n * SECOND),
    floor: (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()),
  },
  {
    name: 'minute',
    ms: MINUTE,
    step: (d, n) => new Date(d.getTime() + n * MINUTE),
    floor: (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()),
  },
  {
    name: 'hour',
    ms: HOUR,
    step: (d, n) => new Date(d.getTime() + n * HOUR),
    floor: (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()),
  },
  {
    name: 'day',
    ms: DAY,
    step: (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n),
    floor: (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()),
  },
  {
    name: 'week',
    ms: WEEK,
    step: (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n * 7),
    floor: (d) => {
      const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      date.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      return date;
    },
  },
  {
    name: 'month',
    ms: MONTH,
    step: (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1),
    floor: (d) => new Date(d.getFullYear(), d.getMonth(), 1),
  },
  {
    name: 'year',
    ms: YEAR,
    step: (d, n) => new Date(d.getFullYear() + n, 0, 1),
    floor: (d) => new Date(d.getFullYear(), 0, 1),
  },
];

/**
 * Find the best time interval for the given range and tick count
 */
function findBestInterval(rangeMs: number, targetCount: number): TimeIntervalConfig {
  const targetStep = rangeMs / targetCount;

  for (let i = 0; i < TIME_INTERVALS.length - 1; i++) {
    const interval = TIME_INTERVALS[i];
    const nextInterval = TIME_INTERVALS[i + 1];

    if (targetStep < (interval.ms + nextInterval.ms) / 2) {
      return interval;
    }
  }

  return TIME_INTERVALS[TIME_INTERVALS.length - 1];
}

/**
 * Generate time ticks
 */
function generateTimeTicks(start: Date, end: Date, count: number = 10): Date[] {
  const rangeMs = end.getTime() - start.getTime();
  if (rangeMs <= 0) return [start];

  const interval = findBestInterval(rangeMs, count);
  const ticks: Date[] = [];

  // Start from floored date
  let current = interval.floor(start);

  // If floored date is before start, step forward
  if (current.getTime() < start.getTime()) {
    current = interval.step(current, 1);
  }

  // Generate ticks
  while (current.getTime() <= end.getTime()) {
    ticks.push(new Date(current));
    current = interval.step(current, 1);
  }

  // Limit to approximately the requested count
  if (ticks.length > count * 1.5) {
    const step = Math.ceil(ticks.length / count);
    return ticks.filter((_, i) => i % step === 0);
  }

  return ticks;
}

/**
 * Round dates to nice boundaries
 */
function niceDateExtent(start: Date, end: Date): [Date, Date] {
  const rangeMs = end.getTime() - start.getTime();
  const interval = findBestInterval(rangeMs, 10);

  const niceStart = interval.floor(start);
  let niceEnd = interval.floor(end);

  // If floored end is before actual end, step forward
  if (niceEnd.getTime() < end.getTime()) {
    niceEnd = interval.step(niceEnd, 1);
  }

  return [niceStart, niceEnd];
}

/**
 * Create a time scale
 *
 * @example
 * ```ts
 * const xScale = createTimeScale({
 *   domain: [new Date('2024-01-01'), new Date('2024-12-31')],
 *   range: [0, 800],
 *   nice: true,
 * });
 *
 * xScale(new Date('2024-06-15')); // Returns ~400 (middle of year)
 * xScale.ticks(6); // Returns monthly tick dates
 * ```
 */
export function createTimeScale(config: TimeScaleConfig): TimeScale {
  const { nice = false, clamp = false } = config;

  // Apply nice rounding if requested
  const [d0, d1] = nice ? niceDateExtent(config.domain[0], config.domain[1]) : config.domain;
  const [r0, r1] = config.range;

  const domainSpan = d1.getTime() - d0.getTime();
  const rangeSpan = r1 - r0;

  // Avoid division by zero
  const ratio = domainSpan === 0 ? 0 : rangeSpan / domainSpan;

  // The scale function
  const scale = ((value: Date): number => {
    let result = r0 + (value.getTime() - d0.getTime()) * ratio;

    if (clamp) {
      const minRange = Math.min(r0, r1);
      const maxRange = Math.max(r0, r1);
      result = Math.max(minRange, Math.min(maxRange, result));
    }

    return result;
  }) as TimeScale;

  // Invert function (range -> domain)
  scale.invert = (value: number): Date => {
    if (ratio === 0) return new Date(d0);
    const ms = d0.getTime() + (value - r0) / ratio;
    return new Date(ms);
  };

  // Getters
  scale.domain = (): [Date, Date] => [new Date(d0), new Date(d1)];
  scale.range = (): [number, number] => [r0, r1];

  // Generate ticks
  scale.ticks = (count: number = 10): Date[] => {
    return generateTimeTicks(d0, d1, count);
  };

  // Copy with same config
  scale.copy = (): TimeScale => {
    return createTimeScale({ domain: [d0, d1], range: [r0, r1], nice, clamp });
  };

  return scale;
}

/**
 * Format a date for display on axis
 */
export function formatDate(date: Date, interval?: TimeInterval): string {
  if (!interval) {
    // Auto-detect best format based on time components
    if (date.getMilliseconds() !== 0) {
      return date.toISOString();
    }
    if (date.getSeconds() !== 0) {
      return date.toLocaleTimeString();
    }
    if (date.getHours() !== 0 || date.getMinutes() !== 0) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    if (date.getDate() !== 1) {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    if (date.getMonth() !== 0) {
      return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    }
    return date.getFullYear().toString();
  }

  switch (interval) {
    case 'second':
      return date.toLocaleTimeString();
    case 'minute':
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    case 'hour':
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    case 'day':
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    case 'week':
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    case 'month':
      return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    case 'year':
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString();
  }
}
