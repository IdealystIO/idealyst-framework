/**
 * SVG Renderer
 *
 * SVG-based renderer implementation using @idealyst/svg.
 * This is the default renderer for web and works on native via react-native-svg.
 */

import type { ChartRenderer } from '../types';
import { SvgCanvas } from './SvgCanvas';
import { SvgGroup } from './SvgGroup';
import { SvgPath } from './SvgPath';
import { SvgRect } from './SvgRect';
import { SvgCircle } from './SvgCircle';
import { SvgLine } from './SvgLine';
import { SvgText } from './SvgText';
import { SvgDefs, SvgLinearGradient, SvgRadialGradient } from './SvgDefs';

/**
 * SVG renderer implementation
 */
export const svgRenderer: ChartRenderer = {
  Canvas: SvgCanvas,
  Group: SvgGroup,
  Path: SvgPath,
  Rect: SvgRect,
  Circle: SvgCircle,
  Line: SvgLine,
  Text: SvgText,
  Defs: SvgDefs,
  LinearGradient: SvgLinearGradient,
  RadialGradient: SvgRadialGradient,
};

// Export individual components for direct use
export { SvgCanvas } from './SvgCanvas';
export { SvgGroup } from './SvgGroup';
export { SvgPath } from './SvgPath';
export { SvgRect } from './SvgRect';
export { SvgCircle } from './SvgCircle';
export { SvgLine } from './SvgLine';
export { SvgText } from './SvgText';
export { SvgDefs, SvgLinearGradient, SvgRadialGradient } from './SvgDefs';
