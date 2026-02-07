/**
 * SVG Path Component
 *
 * Renders SVG paths with optional animation support.
 */

import React, { useMemo } from 'react';
import { Path } from '@idealyst/svg';
import type { PathProps } from '../types';

export const SvgPath: React.FC<PathProps> = ({
  d,
  fill = 'none',
  fillOpacity,
  stroke,
  strokeWidth = 1,
  strokeOpacity,
  opacity,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  strokeDasharray,
  strokeDashoffset,
  animationProgress,
}) => {
  // Convert dash array to string format
  const dashArrayString = useMemo(() => {
    if (!strokeDasharray) return undefined;
    return strokeDasharray.join(' ');
  }, [strokeDasharray]);

  // Calculate dash offset for draw animation
  const animatedDashOffset = useMemo(() => {
    if (animationProgress === undefined || strokeDashoffset === undefined) {
      return strokeDashoffset;
    }
    // Animate from full offset (hidden) to 0 (fully visible)
    return strokeDashoffset * (1 - animationProgress);
  }, [animationProgress, strokeDashoffset]);

  return (
    <Path
      d={d}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      opacity={opacity}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      strokeDasharray={dashArrayString}
      strokeDashoffset={animatedDashOffset}
    />
  );
};
