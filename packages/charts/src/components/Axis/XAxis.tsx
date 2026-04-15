/**
 * X-Axis Component
 *
 * Renders horizontal axis with ticks and labels.
 */

import React, { useMemo } from 'react';
import { useRenderer } from '../ChartContainer';
import type { XAxisProps, AxisScale } from './types';

/**
 * Estimate the pixel width of a label string.
 * Uses ~0.6 × fontSize per character as a rough heuristic.
 */
function estimateLabelWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}

/**
 * Auto-skip band scale labels so they don't overlap.
 * Returns every Nth value where N is the smallest integer that keeps labels
 * from overlapping, always including the first and last values.
 */
function autoSkipBandLabels(
  domain: (number | string | Date)[],
  axisLength: number,
  fontSize: number,
  formatter: (value: number | string | Date) => string,
  minSpacing: number = 8,
): (number | string | Date)[] {
  if (domain.length <= 1) return domain;

  // Estimate average label width
  const avgWidth =
    domain.reduce((sum: number, v) => sum + estimateLabelWidth(formatter(v), fontSize), 0) /
    domain.length;

  // How many labels fit without overlapping?
  const maxLabels = Math.max(1, Math.floor(axisLength / (avgWidth + minSpacing)));

  if (maxLabels >= domain.length) return domain;

  // Calculate step — show every Nth label
  const step = Math.ceil(domain.length / maxLabels);

  const result: (number | string | Date)[] = [];
  for (let i = 0; i < domain.length; i += step) {
    result.push(domain[i]);
  }
  // Always include the last label
  if (result[result.length - 1] !== domain[domain.length - 1]) {
    result.push(domain[domain.length - 1]);
  }
  return result;
}

/**
 * Get tick values from scale
 */
function getTickValues(
  scale: AxisScale,
  tickCount: number,
  axisLength: number,
  fontSize: number,
  formatter: (value: number | string | Date) => string,
  customTickValues?: (number | string | Date)[],
): (number | string | Date)[] {
  if (customTickValues) return customTickValues;

  // Check if scale has ticks method (linear/time scales)
  if ('ticks' in scale && typeof scale.ticks === 'function') {
    return scale.ticks(tickCount);
  }

  // Band scale - auto-skip labels to avoid overlap
  if ('domain' in scale && typeof scale.domain === 'function') {
    const domain = scale.domain();
    if (Array.isArray(domain)) {
      return autoSkipBandLabels(domain, axisLength, fontSize, formatter);
    }
  }

  return [];
}

/**
 * Get position for a tick value
 */
function getTickPosition(scale: AxisScale, value: number | string | Date): number {
  if (typeof scale === 'function') {
    const result = scale(value as never);
    if (typeof result === 'number') return result;
  }
  return 0;
}

/**
 * Default tick formatter
 */
function defaultFormatter(value: number | string | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'number') {
    // Format large numbers with K/M suffix
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    // Avoid floating point display issues
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  }
  return String(value);
}

/**
 * X-Axis Component
 *
 * @example
 * ```tsx
 * <XAxis
 *   scale={xScale}
 *   y={innerHeight}
 *   length={innerWidth}
 *   tickCount={5}
 *   label="Month"
 * />
 * ```
 */
export const XAxis: React.FC<XAxisProps> = ({
  scale,
  y,
  length,
  tickCount = 5,
  tickValues: customTickValues,
  tickFormat = defaultFormatter,
  tickLength = 6,
  tickPadding = 8,
  tickRotation = 0,
  label,
  fontSize = 11,
  labelFontSize = 12,
  color = '#94a3b8',
  labelColor = '#64748b',
  showLine = true,
  showTicks = true,
  showLabels = true,
}) => {
  const { renderer } = useRenderer();
  const { Group, Line, Text } = renderer;

  // Get tick values (auto-skips band scale labels to avoid overlap)
  const tickValues = useMemo(
    () => getTickValues(scale, tickCount, length, fontSize, tickFormat, customTickValues),
    [scale, tickCount, length, fontSize, tickFormat, customTickValues]
  );

  // Calculate tick positions
  const ticks = useMemo(() => {
    // For band scales, center the tick in the band
    const hasBandwidth = 'bandwidth' in scale && typeof scale.bandwidth === 'function';
    const bandOffset = hasBandwidth ? scale.bandwidth() / 2 : 0;

    return tickValues.map((value) => ({
      value,
      position: getTickPosition(scale, value) + bandOffset,
      label: tickFormat(value),
    }));
  }, [tickValues, scale, tickFormat]);

  // Text anchor based on rotation
  const textAnchor = useMemo(() => {
    if (tickRotation === 0) return 'middle';
    if (tickRotation > 0) return 'start';
    return 'end';
  }, [tickRotation]);

  return (
    <Group x={0} y={y}>
      {/* Axis line */}
      {showLine && (
        <Line x1={0} y1={0} x2={length} y2={0} stroke={color} strokeWidth={1} />
      )}

      {/* Ticks and labels */}
      {ticks.map((tick, index) => (
        <Group key={index} x={tick.position} y={0}>
          {/* Tick mark */}
          {showTicks && (
            <Line x1={0} y1={0} x2={0} y2={tickLength} stroke={color} strokeWidth={1} />
          )}

          {/* Tick label */}
          {showLabels && (
            <Text
              x={0}
              y={tickLength + tickPadding}
              fontSize={fontSize}
              fill={labelColor}
              textAnchor={textAnchor}
              dominantBaseline="hanging"
              rotation={tickRotation}
            >
              {tick.label}
            </Text>
          )}
        </Group>
      ))}

      {/* Axis label */}
      {label && (
        <Text
          x={length / 2}
          y={tickLength + tickPadding + fontSize + 12}
          fontSize={labelFontSize}
          fill={labelColor}
          textAnchor="middle"
          dominantBaseline="hanging"
          fontWeight="bold"
        >
          {label}
        </Text>
      )}
    </Group>
  );
};

export default XAxis;
