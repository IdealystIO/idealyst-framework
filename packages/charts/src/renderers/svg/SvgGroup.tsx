/**
 * SVG Group Component
 *
 * Groups elements together with optional transforms.
 */

import React from 'react';
import { G } from '@idealyst/svg';
import type { GroupProps } from '../types';

export const SvgGroup: React.FC<GroupProps> = ({
  x = 0,
  y = 0,
  children,
  clipPath,
  opacity,
  fill,
  stroke,
  strokeWidth,
}) => {
  return (
    <G
      x={x}
      y={y}
      clipPath={clipPath}
      opacity={opacity}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      {children}
    </G>
  );
};
