/**
 * SVG Definitions Components
 *
 * Container for gradients, clip paths, and other definitions.
 */

import React from 'react';
import { Defs, LinearGradient, RadialGradient, Stop } from '@idealyst/svg';
import type { DefsProps, LinearGradientDef, RadialGradientDef } from '../types';

/**
 * Definitions container
 */
export const SvgDefs: React.FC<DefsProps> = ({ children }) => {
  return <Defs>{children}</Defs>;
};

/**
 * Linear gradient definition
 */
export const SvgLinearGradient: React.FC<LinearGradientDef> = ({
  id,
  x1,
  y1,
  x2,
  y2,
  stops,
}) => {
  return (
    <LinearGradient id={id} x1={`${x1 * 100}%`} y1={`${y1 * 100}%`} x2={`${x2 * 100}%`} y2={`${y2 * 100}%`}>
      {stops.map((stop, index) => (
        <Stop
          key={index}
          offset={`${stop.offset * 100}%`}
          stopColor={stop.color}
          stopOpacity={stop.opacity}
        />
      ))}
    </LinearGradient>
  );
};

/**
 * Radial gradient definition
 */
export const SvgRadialGradient: React.FC<RadialGradientDef> = ({
  id,
  cx,
  cy,
  r,
  stops,
}) => {
  return (
    <RadialGradient id={id} cx={`${cx * 100}%`} cy={`${cy * 100}%`} r={`${r * 100}%`}>
      {stops.map((stop, index) => (
        <Stop
          key={index}
          offset={`${stop.offset * 100}%`}
          stopColor={stop.color}
          stopOpacity={stop.opacity}
        />
      ))}
    </RadialGradient>
  );
};
