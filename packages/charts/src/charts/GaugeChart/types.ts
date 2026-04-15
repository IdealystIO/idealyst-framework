/**
 * GaugeChart Types
 */

import type { Intent, Size } from '@idealyst/theme';
import type { GaugeSegment, RendererType } from '../../types';
import type { ReactNode } from 'react';

/**
 * GaugeChart props
 */
export interface GaugeChartProps {
  /** Current value (0-1 where 0 = far left, 1 = far right) */
  value: number;

  /** Colored arc segments (proportions should sum to 1) */
  segments: GaugeSegment[];

  // Dimensions
  /** Chart width */
  width?: number | string;
  /** Chart height — defaults to half the width + space for labels */
  height?: number | string;

  // Appearance
  /** Arc thickness in pixels */
  arcThickness?: number;
  /** Corner radius on segment ends */
  cornerRadius?: number;
  /** Gap between segments in degrees (default: 2) */
  segmentGap?: number;
  /** Needle color */
  needleColor?: string;
  /** Background arc color (drawn behind segments if segments don't cover full arc) */
  backgroundColor?: string;

  // Labels
  /** Formatted value shown prominently (e.g. "12%", "$5K") */
  formattedValue?: string;
  /** Color for the formatted value text */
  valueColor?: string;
  /** Title text above the gauge */
  title?: string;
  /** Subtitle text below the gauge */
  subtitle?: string;
  /** Custom content rendered below the gauge arc */
  renderFooter?: () => ReactNode;

  // Theming
  /** Theme intent for default colors */
  intent?: Intent;
  /** Size variant */
  size?: Size;
  /** Renderer type */
  renderer?: RendererType;

  // Animation
  /** Enable needle sweep animation */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;

  // A11y
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}
