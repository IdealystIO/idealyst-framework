/**
 * SVG Circle Component
 *
 * Renders circles for scatter plots, data points, etc.
 */

import React from 'react';
import { Circle } from '@idealyst/svg';
import type { CircleProps } from '../types';

export const SvgCircle: React.FC<CircleProps> = ({
  cx,
  cy,
  r,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  strokeOpacity,
  opacity,
}) => {
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={Math.max(0, r)}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      opacity={opacity}
    />
  );
};
