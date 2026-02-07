/**
 * SVG Rect Component
 *
 * Renders rectangles with optional rounded corners.
 */

import React from 'react';
import { Rect } from '@idealyst/svg';
import type { RectProps } from '../types';

export const SvgRect: React.FC<RectProps> = ({
  x,
  y,
  width,
  height,
  rx,
  ry,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  strokeOpacity,
  opacity,
}) => {
  return (
    <Rect
      x={x}
      y={y}
      width={Math.max(0, width)}
      height={Math.max(0, height)}
      rx={rx}
      ry={ry ?? rx}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      opacity={opacity}
    />
  );
};
