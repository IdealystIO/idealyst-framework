/**
 * @idealyst/svg - Cross-platform SVG primitives for React and React Native
 *
 * This package provides identical SVG components that work on both web and React Native.
 * On web, it uses native SVG elements. On React Native, it wraps react-native-svg.
 */

// Export all primitives
export {
  Svg,
  G,
  Path,
  Rect,
  Circle,
  Ellipse,
  Line,
  Polyline,
  Polygon,
  Text,
  TSpan,
  TextPath,
  Use,
  Symbol,
  Defs,
  Image,
  ClipPath,
  Mask,
  LinearGradient,
  RadialGradient,
  Stop,
  Pattern,
  Marker,
  ForeignObject,
} from './primitives.web';

// Export all types
export type {
  SvgPresentationProps,
  SvgCommonProps,
  SvgProps,
  GProps,
  PathProps,
  RectProps,
  CircleProps,
  EllipseProps,
  LineProps,
  PolylineProps,
  PolygonProps,
  TextProps,
  TSpanProps,
  TextPathProps,
  UseProps,
  SymbolProps,
  DefsProps,
  ImageProps,
  ClipPathProps,
  MaskProps,
  LinearGradientProps,
  RadialGradientProps,
  StopProps,
  PatternProps,
  MarkerProps,
  ForeignObjectProps,
} from './types';
