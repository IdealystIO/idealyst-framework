/**
 * Grid Lines Component
 *
 * Renders horizontal or vertical grid lines for chart backgrounds.
 */

import React, { useMemo } from 'react';
import { useRenderer } from '../ChartContainer';
import type { GridLinesProps, AxisScale } from './types';

/**
 * Get tick values from scale
 */
function getTickValues(
  scale: AxisScale,
  count: number,
  customTickValues?: (number | string | Date)[]
): (number | string | Date)[] {
  if (customTickValues) return customTickValues;

  // Check if scale has ticks method (linear/time scales)
  if ('ticks' in scale && typeof scale.ticks === 'function') {
    return scale.ticks(count);
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
 * Grid Lines Component
 *
 * @example
 * ```tsx
 * // Horizontal grid lines (from Y scale)
 * <GridLines
 *   scale={yScale}
 *   width={innerWidth}
 *   height={innerHeight}
 *   direction="horizontal"
 *   count={5}
 * />
 *
 * // Vertical grid lines (from X scale)
 * <GridLines
 *   scale={xScale}
 *   width={innerWidth}
 *   height={innerHeight}
 *   direction="vertical"
 *   count={10}
 * />
 * ```
 */
export const GridLines: React.FC<GridLinesProps> = ({
  scale,
  width,
  height,
  direction,
  count = 5,
  tickValues: customTickValues,
  color = '#e2e8f0',
  opacity = 0.5,
  dashArray,
}) => {
  const { renderer } = useRenderer();
  const { Group, Line } = renderer;

  // Get tick values
  const tickValues = useMemo(
    () => getTickValues(scale, count, customTickValues),
    [scale, count, customTickValues]
  );

  // Calculate line positions
  const lines = useMemo(() => {
    // For band scales, position at band center
    const hasBandwidth = 'bandwidth' in scale && typeof scale.bandwidth === 'function';
    const bandOffset = hasBandwidth ? scale.bandwidth() / 2 : 0;

    return tickValues.map((value) => getTickPosition(scale, value) + bandOffset);
  }, [tickValues, scale]);

  if (direction === 'horizontal') {
    // Horizontal lines (Y positions, full width)
    return (
      <Group x={0} y={0}>
        {lines.map((y, index) => (
          <Line
            key={index}
            x1={0}
            y1={y}
            x2={width}
            y2={y}
            stroke={color}
            strokeWidth={1}
            opacity={opacity}
            strokeDasharray={dashArray}
          />
        ))}
      </Group>
    );
  }

  // Vertical lines (X positions, full height)
  return (
    <Group x={0} y={0}>
      {lines.map((x, index) => (
        <Line
          key={index}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke={color}
          strokeWidth={1}
          opacity={opacity}
          strokeDasharray={dashArray}
        />
      ))}
    </Group>
  );
};

export default GridLines;
