/**
 * SVG Canvas Component
 *
 * Root container for SVG-based chart rendering.
 */

import React from 'react';
import { Svg } from '@idealyst/svg';
import type { CanvasProps } from '../types';

export const SvgCanvas: React.FC<CanvasProps> = ({
  width,
  height,
  children,
  testID,
  accessibilityLabel,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      testID={testID}
      // @ts-expect-error - aria-label is valid for SVG on web
      aria-label={accessibilityLabel}
    >
      {children}
    </Svg>
  );
};
