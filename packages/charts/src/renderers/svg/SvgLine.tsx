/**
 * SVG Line Component
 *
 * Renders straight lines for axes, grid lines, etc.
 */

import React from 'react';
import { Line } from '@idealyst/svg';
import type { LineProps } from '../types';

export const SvgLine: React.FC<LineProps> = ({
  x1,
  y1,
  x2,
  y2,
  stroke,
  strokeWidth = 1,
  strokeOpacity,
  opacity,
  strokeLinecap,
  strokeDasharray,
}) => {
  return (
    <Line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      opacity={opacity}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray?.join(' ')}
    />
  );
};
