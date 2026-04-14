/**
 * Time Scale
 *
 * Maps Date values to continuous output range.
 * Backed by d3-scale's scaleTime.
 */

import { scaleTime } from 'd3-scale';
import type { TimeScaleConfig, TimeScale } from './types';

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

  const scale = scaleTime()
    .domain(config.domain)
    .range(config.range)
    .clamp(clamp);

  if (nice) scale.nice();

  return scale;
}

/**
 * Time interval type hint for formatting
 */
type TimeInterval = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

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
