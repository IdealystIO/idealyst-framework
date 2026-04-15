/**
 * ReferenceLines Component
 *
 * Renders horizontal (Y-axis) and vertical (X-axis) reference lines
 * for targets, thresholds, averages, and other indicators.
 */

import React from 'react';
import { useRenderer } from '../ChartContainer';
import type { AxisScale } from './types';
import type { ReferenceLine } from '../../types';

/**
 * Convert strokeStyle to a dash array
 */
function getDashArray(style: ReferenceLine['strokeStyle']): number[] | undefined {
  switch (style) {
    case 'dashed': return [6, 4];
    case 'dotted': return [2, 3];
    default: return undefined;
  }
}

/**
 * Get position for a value on a scale
 */
function getPosition(scale: AxisScale, value: number | string): number {
  if (typeof scale === 'function') {
    const result = scale(value as never);
    if (typeof result === 'number') return result;
  }
  return 0;
}

export interface ReferenceLinesProps {
  /** Reference line definitions */
  lines: ReferenceLine[];
  /** X scale (for vertical reference lines) */
  xScale: AxisScale;
  /** Y scale (for horizontal reference lines) */
  yScale: AxisScale;
  /** Inner chart width */
  innerWidth: number;
  /** Inner chart height */
  innerHeight: number;
}

export const ReferenceLines: React.FC<ReferenceLinesProps> = ({
  lines,
  xScale,
  yScale,
  innerWidth,
  innerHeight,
}) => {
  const { renderer } = useRenderer();
  const { Group, Line, Text } = renderer;

  return (
    <Group x={0} y={0}>
      {lines.map((ref, index) => {
        const color = ref.color ?? '#94a3b8';
        const strokeWidth = ref.strokeWidth ?? 1.5;
        const opacity = ref.opacity ?? 0.7;
        const dashArray = getDashArray(ref.strokeStyle ?? 'dashed');
        const labelPos = ref.labelPosition ?? 'end';

        if (ref.axis === 'y') {
          // Horizontal line at a Y value
          const y = getPosition(yScale, ref.value as number);

          // Label positioning
          let labelX: number;
          let anchor: 'start' | 'middle' | 'end';
          if (labelPos === 'start') {
            labelX = 0;
            anchor = 'start';
          } else if (labelPos === 'center') {
            labelX = innerWidth / 2;
            anchor = 'middle';
          } else {
            labelX = innerWidth;
            anchor = 'end';
          }

          return (
            <Group key={`ref-y-${index}`} x={0} y={0}>
              <Line
                x1={0}
                y1={y}
                x2={innerWidth}
                y2={y}
                stroke={color}
                strokeWidth={strokeWidth}
                opacity={opacity}
                strokeDasharray={dashArray}
              />
              {ref.label && (
                <Text
                  x={labelX}
                  y={y - 5}
                  fontSize={10}
                  fontWeight="bold"
                  fill={color}
                  opacity={opacity}
                  textAnchor={anchor}
                  dominantBaseline="auto"
                >
                  {ref.label}
                </Text>
              )}
            </Group>
          );
        }

        // Vertical line at an X value
        const x = getPosition(xScale, ref.value);

        // For band scales, offset to center of band
        const hasBandwidth = 'bandwidth' in xScale && typeof xScale.bandwidth === 'function';
        const bandOffset = hasBandwidth ? xScale.bandwidth() / 2 : 0;
        const xPos = x + bandOffset;

        // Label positioning
        let labelY: number;
        let baseline: 'auto' | 'hanging';
        if (labelPos === 'start') {
          labelY = 0;
          baseline = 'hanging';
        } else if (labelPos === 'center') {
          labelY = innerHeight / 2;
          baseline = 'auto';
        } else {
          labelY = 0;
          baseline = 'hanging';
        }

        return (
          <Group key={`ref-x-${index}`} x={0} y={0}>
            <Line
              x1={xPos}
              y1={0}
              x2={xPos}
              y2={innerHeight}
              stroke={color}
              strokeWidth={strokeWidth}
              opacity={opacity}
              strokeDasharray={dashArray}
            />
            {ref.label && (
              <Text
                x={xPos + 4}
                y={labelY}
                fontSize={10}
                fontWeight="bold"
                fill={color}
                opacity={opacity}
                textAnchor="start"
                dominantBaseline={baseline}
              >
                {ref.label}
              </Text>
            )}
          </Group>
        );
      })}
    </Group>
  );
};
