/**
 * SVG Text Component
 *
 * Renders text for labels, axis ticks, etc.
 */

import React from 'react';
import { Text } from '@idealyst/svg';
import type { TextProps } from '../types';

export const SvgText: React.FC<TextProps> = ({
  x,
  y,
  children,
  fontSize = 12,
  fontFamily,
  fontWeight = 'normal',
  textAnchor = 'start',
  dominantBaseline = 'auto',
  fill,
  fillOpacity,
  opacity,
  rotation,
}) => {
  // Build transform for rotation
  const transform = rotation ? `rotate(${rotation}, ${x}, ${y})` : undefined;

  return (
    <Text
      x={x}
      y={y}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      fill={fill}
      fillOpacity={fillOpacity}
      opacity={opacity}
      transform={transform}
    >
      {String(children)}
    </Text>
  );
};
