/**
 * Y-Axis Component
 *
 * Renders vertical axis with ticks and labels.
 */

import React, { useMemo } from 'react';
import { useRenderer } from '../ChartContainer';
import type { YAxisProps, AxisScale } from './types';

/**
 * Get tick values from scale
 */
function getTickValues(
  scale: AxisScale,
  tickCount: number,
  customTickValues?: (number | string | Date)[]
): (number | string | Date)[] {
  if (customTickValues) return customTickValues;

  // Check if scale has ticks method (linear/time scales)
  if ('ticks' in scale && typeof scale.ticks === 'function') {
    return scale.ticks(tickCount);
  }

  // Band scale - return domain values
  if ('domain' in scale && typeof scale.domain === 'function') {
    const domain = scale.domain();
    if (Array.isArray(domain)) return domain;
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
 * Y-Axis Component
 *
 * @example
 * ```tsx
 * <YAxis
 *   scale={yScale}
 *   x={0}
 *   length={innerHeight}
 *   tickCount={5}
 *   label="Revenue ($)"
 *   position="left"
 * />
 * ```
 */
export const YAxis: React.FC<YAxisProps> = ({
  scale,
  x,
  length,
  position = 'left',
  tickCount = 5,
  tickValues: customTickValues,
  tickFormat = defaultFormatter,
  tickLength = 6,
  tickPadding = 8,
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

  // Get tick values
  const tickValues = useMemo(
    () => getTickValues(scale, tickCount, customTickValues),
    [scale, tickCount, customTickValues]
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

  // Position adjustments based on left/right
  const isLeft = position === 'left';
  const tickDirection = isLeft ? -1 : 1;
  const textAnchor = isLeft ? 'end' : 'start';
  const labelX = isLeft ? -(tickLength + tickPadding + 24) : tickLength + tickPadding + 24;

  return (
    <Group x={x} y={0}>
      {/* Axis line */}
      {showLine && (
        <Line x1={0} y1={0} x2={0} y2={length} stroke={color} strokeWidth={1} />
      )}

      {/* Ticks and labels */}
      {ticks.map((tick, index) => (
        <Group key={index} x={0} y={tick.position}>
          {/* Tick mark */}
          {showTicks && (
            <Line
              x1={0}
              y1={0}
              x2={tickLength * tickDirection}
              y2={0}
              stroke={color}
              strokeWidth={1}
            />
          )}

          {/* Tick label */}
          {showLabels && (
            <Text
              x={(tickLength + tickPadding) * tickDirection}
              y={0}
              fontSize={fontSize}
              fill={labelColor}
              textAnchor={textAnchor}
              dominantBaseline="middle"
            >
              {tick.label}
            </Text>
          )}
        </Group>
      ))}

      {/* Axis label (rotated) */}
      {label && (
        <Text
          x={labelX}
          y={length / 2}
          fontSize={labelFontSize}
          fill={labelColor}
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          rotation={-90}
        >
          {label}
        </Text>
      )}
    </Group>
  );
};

export default YAxis;
