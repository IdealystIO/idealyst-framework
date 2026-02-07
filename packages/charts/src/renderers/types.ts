/**
 * Renderer Abstraction Types
 *
 * Defines the interface that both SVG and Skia renderers implement.
 * This allows charts to be renderer-agnostic.
 */

import type { ReactNode } from 'react';

/**
 * Available renderer types
 */
export type RendererType = 'svg' | 'skia';

/**
 * Common style properties shared across renderers
 */
export interface CommonStyleProps {
  /** Fill color */
  fill?: string;
  /** Fill opacity (0-1) */
  fillOpacity?: number;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Stroke opacity (0-1) */
  strokeOpacity?: number;
  /** Overall opacity (0-1) */
  opacity?: number;
  /** Stroke line cap */
  strokeLinecap?: 'butt' | 'round' | 'square';
  /** Stroke line join */
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  /** Stroke dash array */
  strokeDasharray?: number[];
  /** Stroke dash offset */
  strokeDashoffset?: number;
}

/**
 * Canvas (root container) props
 */
export interface CanvasProps {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Children to render */
  children: ReactNode;
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Group props for organizing elements
 */
export interface GroupProps extends CommonStyleProps {
  /** X translation */
  x?: number;
  /** Y translation */
  y?: number;
  /** Children elements */
  children: ReactNode;
  /** Clip to bounds */
  clipPath?: string;
}

/**
 * Path props
 */
export interface PathProps extends CommonStyleProps {
  /** SVG path data string */
  d: string;
  /** Animation progress (0-1) for draw animation */
  animationProgress?: number;
}

/**
 * Rectangle props
 */
export interface RectProps extends CommonStyleProps {
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** Corner radius (all corners) */
  rx?: number;
  /** Corner radius Y (if different from rx) */
  ry?: number;
}

/**
 * Circle props
 */
export interface CircleProps extends CommonStyleProps {
  /** Center X */
  cx: number;
  /** Center Y */
  cy: number;
  /** Radius */
  r: number;
}

/**
 * Line props
 */
export interface LineProps extends CommonStyleProps {
  /** Start X */
  x1: number;
  /** Start Y */
  y1: number;
  /** End X */
  x2: number;
  /** End Y */
  y2: number;
}

/**
 * Text props
 */
export interface TextProps extends CommonStyleProps {
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Text content */
  children: string | number;
  /** Font size */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: 'normal' | 'bold' | number;
  /** Text anchor (horizontal alignment) */
  textAnchor?: 'start' | 'middle' | 'end';
  /** Dominant baseline (vertical alignment) */
  dominantBaseline?: 'auto' | 'middle' | 'hanging' | 'alphabetic';
  /** Rotation in degrees */
  rotation?: number;
}

/**
 * Linear gradient definition
 */
export interface LinearGradientDef {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: Array<{
    offset: number;
    color: string;
    opacity?: number;
  }>;
}

/**
 * Radial gradient definition
 */
export interface RadialGradientDef {
  id: string;
  cx: number;
  cy: number;
  r: number;
  stops: Array<{
    offset: number;
    color: string;
    opacity?: number;
  }>;
}

/**
 * Definitions container props (for gradients, clip paths, etc.)
 */
export interface DefsProps {
  children: ReactNode;
}

/**
 * Renderer interface that both SVG and Skia implement
 */
export interface ChartRenderer {
  /** Root canvas component */
  Canvas: React.FC<CanvasProps>;
  /** Group component for transforms */
  Group: React.FC<GroupProps>;
  /** Path component */
  Path: React.FC<PathProps>;
  /** Rectangle component */
  Rect: React.FC<RectProps>;
  /** Circle component */
  Circle: React.FC<CircleProps>;
  /** Line component */
  Line: React.FC<LineProps>;
  /** Text component */
  Text: React.FC<TextProps>;
  /** Definitions container */
  Defs: React.FC<DefsProps>;
  /** Linear gradient component */
  LinearGradient: React.FC<LinearGradientDef>;
  /** Radial gradient component */
  RadialGradient: React.FC<RadialGradientDef>;
}

/**
 * Renderer context value
 */
export interface RendererContextValue {
  /** Current renderer type */
  type: RendererType;
  /** Renderer components */
  renderer: ChartRenderer;
}

/**
 * Animation-related props that can be added to any component
 */
export interface AnimatableProps {
  /** Enable animation */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Animation easing */
  animationEasing?: 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut';
}

/**
 * Interactive props that can be added to any component
 */
export interface InteractiveProps {
  /** Press handler */
  onPress?: () => void;
  /** Long press handler */
  onLongPress?: () => void;
  /** Hover start handler (web only) */
  onHoverStart?: () => void;
  /** Hover end handler (web only) */
  onHoverEnd?: () => void;
  /** Whether the element is pressable */
  pressable?: boolean;
}
