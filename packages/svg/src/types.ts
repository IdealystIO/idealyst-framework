import type { ReactNode } from 'react';

/**
 * Common SVG presentation attributes shared across all SVG elements
 */
export interface SvgPresentationProps {
  /** Fill color for the shape */
  fill?: string;
  /** Fill opacity (0-1) */
  fillOpacity?: number;
  /** Fill rule for complex paths */
  fillRule?: 'nonzero' | 'evenodd';
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number | string;
  /** Stroke opacity (0-1) */
  strokeOpacity?: number;
  /** Stroke line cap style */
  strokeLinecap?: 'butt' | 'round' | 'square';
  /** Stroke line join style */
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  /** Stroke dash array pattern */
  strokeDasharray?: string | number[];
  /** Stroke dash offset */
  strokeDashoffset?: number | string;
  /** Stroke miter limit */
  strokeMiterlimit?: number;
  /** Overall opacity (0-1) */
  opacity?: number;
  /** Visibility */
  visibility?: 'visible' | 'hidden' | 'collapse';
  /** Clip path reference */
  clipPath?: string;
  /** Clip rule */
  clipRule?: 'nonzero' | 'evenodd';
  /** Mask reference */
  mask?: string;
  /** Filter reference */
  filter?: string;
  /** Marker at the start of a line */
  markerStart?: string;
  /** Marker in the middle of a line */
  markerMid?: string;
  /** Marker at the end of a line */
  markerEnd?: string;
}

/**
 * Common props for all SVG elements
 */
export interface SvgCommonProps extends SvgPresentationProps {
  /** Unique identifier */
  id?: string;
  /** Test ID for testing */
  testID?: string;
  /** Transform attribute */
  transform?: string;
  /** Transform origin (for CSS transforms) */
  transformOrigin?: string;
  /** Children elements */
  children?: ReactNode;
  /** Press handler */
  onPress?: () => void;
  /** Long press handler */
  onLongPress?: () => void;
  /** Press in handler */
  onPressIn?: () => void;
  /** Press out handler */
  onPressOut?: () => void;
}

/**
 * Root SVG element props
 */
export interface SvgProps extends SvgCommonProps {
  /** Width of the SVG viewport */
  width?: number | string;
  /** Height of the SVG viewport */
  height?: number | string;
  /** ViewBox attribute defining the coordinate system */
  viewBox?: string;
  /** How the SVG content should fit within the viewport */
  preserveAspectRatio?: string;
  /** XML namespace (auto-set on web) */
  xmlns?: string;
  /** XLink namespace for href attributes */
  xmlnsXlink?: string;
  /** Color prop for currentColor inheritance */
  color?: string;
  /** Title for accessibility */
  title?: string;
  /** Description for accessibility */
  desc?: string;
}

/**
 * Group element props
 */
export interface GProps extends SvgCommonProps {
  /** X translation */
  x?: number | string;
  /** Y translation */
  y?: number | string;
  /** Rotation in degrees */
  rotation?: number;
  /** Scale factor */
  scale?: number;
  /** X origin for transforms */
  originX?: number;
  /** Y origin for transforms */
  originY?: number;
}

/**
 * Path element props
 */
export interface PathProps extends SvgCommonProps {
  /** Path data string (d attribute) */
  d: string;
}

/**
 * Rectangle element props
 */
export interface RectProps extends SvgCommonProps {
  /** X coordinate of top-left corner */
  x?: number | string;
  /** Y coordinate of top-left corner */
  y?: number | string;
  /** Width of the rectangle */
  width: number | string;
  /** Height of the rectangle */
  height: number | string;
  /** Horizontal corner radius */
  rx?: number | string;
  /** Vertical corner radius */
  ry?: number | string;
}

/**
 * Circle element props
 */
export interface CircleProps extends SvgCommonProps {
  /** X coordinate of center */
  cx: number | string;
  /** Y coordinate of center */
  cy: number | string;
  /** Radius */
  r: number | string;
}

/**
 * Ellipse element props
 */
export interface EllipseProps extends SvgCommonProps {
  /** X coordinate of center */
  cx: number | string;
  /** Y coordinate of center */
  cy: number | string;
  /** Horizontal radius */
  rx: number | string;
  /** Vertical radius */
  ry: number | string;
}

/**
 * Line element props
 */
export interface LineProps extends SvgCommonProps {
  /** X coordinate of start point */
  x1: number | string;
  /** Y coordinate of start point */
  y1: number | string;
  /** X coordinate of end point */
  x2: number | string;
  /** Y coordinate of end point */
  y2: number | string;
}

/**
 * Polyline element props (open shape)
 */
export interface PolylineProps extends SvgCommonProps {
  /** Points as string "x1,y1 x2,y2 ..." or array of numbers */
  points: string | number[];
}

/**
 * Polygon element props (closed shape)
 */
export interface PolygonProps extends SvgCommonProps {
  /** Points as string "x1,y1 x2,y2 ..." or array of numbers */
  points: string | number[];
}

/**
 * Text element props
 */
export interface TextProps extends SvgCommonProps {
  /** X coordinate */
  x?: number | string;
  /** Y coordinate */
  y?: number | string;
  /** X offset for each character */
  dx?: number | string;
  /** Y offset for each character */
  dy?: number | string;
  /** Rotation for each character */
  rotate?: string | number[];
  /** Font size */
  fontSize?: number | string;
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number | string;
  /** Font style */
  fontStyle?: 'normal' | 'italic' | 'oblique';
  /** Text anchor/alignment */
  textAnchor?: 'start' | 'middle' | 'end';
  /** Dominant baseline */
  dominantBaseline?: 'auto' | 'text-bottom' | 'alphabetic' | 'ideographic' | 'middle' | 'central' | 'mathematical' | 'hanging' | 'text-top';
  /** Alignment baseline */
  alignmentBaseline?: 'auto' | 'baseline' | 'before-edge' | 'text-before-edge' | 'middle' | 'central' | 'after-edge' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical';
  /** Text decoration */
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  /** Letter spacing */
  letterSpacing?: number | string;
  /** Word spacing */
  wordSpacing?: number | string;
  /** Text content */
  children?: ReactNode;
}

/**
 * TSpan element props (text span within Text)
 */
export interface TSpanProps extends TextProps {
  /** Inline element (no children required) */
  inlineSize?: number | string;
}

/**
 * TextPath element props (text along a path)
 */
export interface TextPathProps extends TextProps {
  /** Reference to path element (href or xlinkHref) */
  href?: string;
  /** Start offset along the path */
  startOffset?: number | string;
  /** Method of rendering text along path */
  method?: 'align' | 'stretch';
  /** Spacing between characters */
  spacing?: 'auto' | 'exact';
  /** Side of path to render text */
  side?: 'left' | 'right';
  /** Path data directly (alternative to href) */
  path?: string;
}

/**
 * Use element props (reference another element)
 */
export interface UseProps extends SvgCommonProps {
  /** Reference to element (href or xlinkHref) */
  href?: string;
  /** X position */
  x?: number | string;
  /** Y position */
  y?: number | string;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
}

/**
 * Symbol element props (reusable graphics)
 */
export interface SymbolProps extends SvgCommonProps {
  /** ViewBox for the symbol */
  viewBox?: string;
  /** Preserve aspect ratio */
  preserveAspectRatio?: string;
}

/**
 * Defs element props (definitions container)
 */
export interface DefsProps extends SvgCommonProps {}

/**
 * Image element props
 */
export interface ImageProps extends SvgCommonProps {
  /** Image source URL (href or xlinkHref) */
  href?: string;
  /** X position */
  x?: number | string;
  /** Y position */
  y?: number | string;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Preserve aspect ratio */
  preserveAspectRatio?: string;
}

/**
 * ClipPath element props
 */
export interface ClipPathProps extends SvgCommonProps {
  /** Clip path units */
  clipPathUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
}

/**
 * Mask element props
 */
export interface MaskProps extends SvgCommonProps {
  /** X position */
  x?: number | string;
  /** Y position */
  y?: number | string;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Mask units */
  maskUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  /** Mask content units */
  maskContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
}

/**
 * LinearGradient element props
 */
export interface LinearGradientProps extends SvgCommonProps {
  /** X coordinate of start point (0-1 or percentage) */
  x1?: number | string;
  /** Y coordinate of start point (0-1 or percentage) */
  y1?: number | string;
  /** X coordinate of end point (0-1 or percentage) */
  x2?: number | string;
  /** Y coordinate of end point (0-1 or percentage) */
  y2?: number | string;
  /** Gradient units */
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  /** Gradient transform */
  gradientTransform?: string;
  /** Spread method */
  spreadMethod?: 'pad' | 'reflect' | 'repeat';
}

/**
 * RadialGradient element props
 */
export interface RadialGradientProps extends SvgCommonProps {
  /** X coordinate of center */
  cx?: number | string;
  /** Y coordinate of center */
  cy?: number | string;
  /** Radius */
  r?: number | string;
  /** X coordinate of focal point */
  fx?: number | string;
  /** Y coordinate of focal point */
  fy?: number | string;
  /** Gradient units */
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  /** Gradient transform */
  gradientTransform?: string;
  /** Spread method */
  spreadMethod?: 'pad' | 'reflect' | 'repeat';
}

/**
 * Stop element props (for gradients)
 */
export interface StopProps {
  /** Offset along the gradient (0-1 or percentage) */
  offset: number | string;
  /** Stop color */
  stopColor?: string;
  /** Stop opacity (0-1) */
  stopOpacity?: number;
}

/**
 * Pattern element props
 */
export interface PatternProps extends SvgCommonProps {
  /** X position */
  x?: number | string;
  /** Y position */
  y?: number | string;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** ViewBox for the pattern */
  viewBox?: string;
  /** Pattern units */
  patternUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  /** Pattern content units */
  patternContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
  /** Pattern transform */
  patternTransform?: string;
}

/**
 * Marker element props
 */
export interface MarkerProps extends SvgCommonProps {
  /** Reference X coordinate */
  refX?: number | string;
  /** Reference Y coordinate */
  refY?: number | string;
  /** Marker width */
  markerWidth?: number | string;
  /** Marker height */
  markerHeight?: number | string;
  /** Marker units */
  markerUnits?: 'userSpaceOnUse' | 'strokeWidth';
  /** Orientation */
  orient?: 'auto' | 'auto-start-reverse' | number | string;
  /** ViewBox */
  viewBox?: string;
  /** Preserve aspect ratio */
  preserveAspectRatio?: string;
}

/**
 * ForeignObject element props (embed HTML in SVG)
 */
export interface ForeignObjectProps extends SvgCommonProps {
  /** X position */
  x?: number | string;
  /** Y position */
  y?: number | string;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
}
