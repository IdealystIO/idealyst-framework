import React, { forwardRef } from 'react';
import RNSvg, {
  G as RNG,
  Path as RNPath,
  Rect as RNRect,
  Circle as RNCircle,
  Ellipse as RNEllipse,
  Line as RNLine,
  Polyline as RNPolyline,
  Polygon as RNPolygon,
  Text as RNText,
  TSpan as RNTSpan,
  TextPath as RNTextPath,
  Use as RNUse,
  Symbol as RNSymbol,
  Defs as RNDefs,
  Image as RNImage,
  ClipPath as RNClipPath,
  Mask as RNMask,
  LinearGradient as RNLinearGradient,
  RadialGradient as RNRadialGradient,
  Stop as RNStop,
  Pattern as RNPattern,
  Marker as RNMarker,
  ForeignObject as RNForeignObject,
} from 'react-native-svg';
import type {
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

/**
 * Helper to convert stroke-dasharray from string to array for native
 */
function convertStrokeDasharray(value: string | number[] | undefined): number[] | undefined {
  if (typeof value === 'string') {
    return value.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
  }
  return value;
}

/**
 * Helper to convert points string to array for native
 */
function convertPoints(points: string | number[]): string {
  // react-native-svg expects a string for points
  if (Array.isArray(points)) {
    const pairs: string[] = [];
    for (let i = 0; i < points.length; i += 2) {
      if (i + 1 < points.length) {
        pairs.push(`${points[i]},${points[i + 1]}`);
      }
    }
    return pairs.join(' ');
  }
  return points;
}

/**
 * Helper to convert common props for native
 */
function convertCommonProps(props: Record<string, unknown>): Record<string, unknown> {
  const {
    testID,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    strokeDasharray,
    ...rest
  } = props;

  const result: Record<string, unknown> = { ...rest };

  if (testID) {
    result.testID = testID;
  }
  if (onPress) {
    result.onPress = onPress;
  }
  if (onLongPress) {
    result.onLongPress = onLongPress;
  }
  if (onPressIn) {
    result.onPressIn = onPressIn;
  }
  if (onPressOut) {
    result.onPressOut = onPressOut;
  }
  if (strokeDasharray !== undefined) {
    result.strokeDasharray = convertStrokeDasharray(strokeDasharray);
  }

  return result;
}

/**
 * Root SVG element
 */
export const Svg = forwardRef<typeof RNSvg, SvgProps>(
  ({ children, title, desc, xmlns, xmlnsXlink, color, ...props }, ref) => {
    const svgProps = convertCommonProps(props);

    return (
      <RNSvg ref={ref as any} color={color} {...(svgProps as any)}>
        {children}
      </RNSvg>
    );
  }
);
Svg.displayName = 'Svg';

/**
 * Group element
 */
export const G = forwardRef<typeof RNG, GProps>(
  ({ children, x, y, rotation, scale, originX, originY, ...props }, ref) => {
    const gProps = convertCommonProps(props);

    // Build transform string from convenience props
    let transform = props.transform || '';
    if (x !== undefined || y !== undefined) {
      transform = `translate(${x || 0}, ${y || 0}) ${transform}`;
    }
    if (rotation !== undefined) {
      const ox = originX || 0;
      const oy = originY || 0;
      transform = `${transform} rotate(${rotation}, ${ox}, ${oy})`;
    }
    if (scale !== undefined) {
      transform = `${transform} scale(${scale})`;
    }

    return (
      <RNG
        ref={ref as any}
        transform={transform.trim() || undefined}
        {...(gProps as any)}
      >
        {children}
      </RNG>
    );
  }
);
G.displayName = 'G';

/**
 * Path element
 */
export const Path = forwardRef<typeof RNPath, PathProps>(
  ({ d, ...props }, ref) => {
    const pathProps = convertCommonProps(props);

    return <RNPath ref={ref as any} d={d} {...(pathProps as any)} />;
  }
);
Path.displayName = 'Path';

/**
 * Rectangle element
 */
export const Rect = forwardRef<typeof RNRect, RectProps>(
  (props, ref) => {
    const rectProps = convertCommonProps(props);

    return <RNRect ref={ref as any} {...(rectProps as any)} />;
  }
);
Rect.displayName = 'Rect';

/**
 * Circle element
 */
export const Circle = forwardRef<typeof RNCircle, CircleProps>(
  (props, ref) => {
    const circleProps = convertCommonProps(props);

    return <RNCircle ref={ref as any} {...(circleProps as any)} />;
  }
);
Circle.displayName = 'Circle';

/**
 * Ellipse element
 */
export const Ellipse = forwardRef<typeof RNEllipse, EllipseProps>(
  (props, ref) => {
    const ellipseProps = convertCommonProps(props);

    return <RNEllipse ref={ref as any} {...(ellipseProps as any)} />;
  }
);
Ellipse.displayName = 'Ellipse';

/**
 * Line element
 */
export const Line = forwardRef<typeof RNLine, LineProps>(
  (props, ref) => {
    const lineProps = convertCommonProps(props);

    return <RNLine ref={ref as any} {...(lineProps as any)} />;
  }
);
Line.displayName = 'Line';

/**
 * Polyline element (open shape)
 */
export const Polyline = forwardRef<typeof RNPolyline, PolylineProps>(
  ({ points, ...props }, ref) => {
    const polylineProps = convertCommonProps(props);

    return (
      <RNPolyline
        ref={ref as any}
        points={convertPoints(points)}
        {...(polylineProps as any)}
      />
    );
  }
);
Polyline.displayName = 'Polyline';

/**
 * Polygon element (closed shape)
 */
export const Polygon = forwardRef<typeof RNPolygon, PolygonProps>(
  ({ points, ...props }, ref) => {
    const polygonProps = convertCommonProps(props);

    return (
      <RNPolygon
        ref={ref as any}
        points={convertPoints(points)}
        {...(polygonProps as any)}
      />
    );
  }
);
Polygon.displayName = 'Polygon';

/**
 * Text element
 */
export const Text = forwardRef<typeof RNText, TextProps>(
  ({ children, ...props }, ref) => {
    const textProps = convertCommonProps(props);

    return (
      <RNText ref={ref as any} {...(textProps as any)}>
        {children}
      </RNText>
    );
  }
);
Text.displayName = 'Text';

/**
 * TSpan element (text span)
 */
export const TSpan = forwardRef<typeof RNTSpan, TSpanProps>(
  ({ children, inlineSize, ...props }, ref) => {
    const tspanProps = convertCommonProps(props);

    return (
      <RNTSpan ref={ref as any} {...(tspanProps as any)}>
        {children}
      </RNTSpan>
    );
  }
);
TSpan.displayName = 'TSpan';

/**
 * TextPath element (text along a path)
 */
export const TextPath = forwardRef<typeof RNTextPath, TextPathProps>(
  ({ children, href, path, ...props }, ref) => {
    const textPathProps = convertCommonProps(props);

    return (
      <RNTextPath ref={ref as any} href={href} {...(textPathProps as any)}>
        {children}
      </RNTextPath>
    );
  }
);
TextPath.displayName = 'TextPath';

/**
 * Use element (reference another element)
 */
export const Use = forwardRef<typeof RNUse, UseProps>(
  ({ href, ...props }, ref) => {
    const useProps = convertCommonProps(props);

    return <RNUse ref={ref as any} href={href} {...(useProps as any)} />;
  }
);
Use.displayName = 'Use';

/**
 * Symbol element (reusable graphics)
 */
export const Symbol = forwardRef<typeof RNSymbol, SymbolProps>(
  ({ children, ...props }, ref) => {
    const symbolProps = convertCommonProps(props);

    return (
      <RNSymbol ref={ref as any} {...(symbolProps as any)}>
        {children}
      </RNSymbol>
    );
  }
);
Symbol.displayName = 'Symbol';

/**
 * Defs element (definitions container)
 */
export const Defs = forwardRef<typeof RNDefs, DefsProps>(
  ({ children, ...props }, ref) => {
    const defsProps = convertCommonProps(props);

    return (
      <RNDefs ref={ref as any} {...(defsProps as any)}>
        {children}
      </RNDefs>
    );
  }
);
Defs.displayName = 'Defs';

/**
 * Image element
 */
export const Image = forwardRef<typeof RNImage, ImageProps>(
  ({ href, ...props }, ref) => {
    const imageProps = convertCommonProps(props);

    return <RNImage ref={ref as any} href={href} {...(imageProps as any)} />;
  }
);
Image.displayName = 'Image';

/**
 * ClipPath element
 */
export const ClipPath = forwardRef<typeof RNClipPath, ClipPathProps>(
  ({ children, ...props }, ref) => {
    const clipPathProps = convertCommonProps(props);

    return (
      <RNClipPath ref={ref as any} {...(clipPathProps as any)}>
        {children}
      </RNClipPath>
    );
  }
);
ClipPath.displayName = 'ClipPath';

/**
 * Mask element
 */
export const Mask = forwardRef<typeof RNMask, MaskProps>(
  ({ children, ...props }, ref) => {
    const maskProps = convertCommonProps(props);

    return (
      <RNMask ref={ref as any} {...(maskProps as any)}>
        {children}
      </RNMask>
    );
  }
);
Mask.displayName = 'Mask';

/**
 * LinearGradient element
 */
export const LinearGradient = forwardRef<typeof RNLinearGradient, LinearGradientProps>(
  ({ children, ...props }, ref) => {
    const linearGradientProps = convertCommonProps(props);

    return (
      <RNLinearGradient ref={ref as any} {...(linearGradientProps as any)}>
        {children}
      </RNLinearGradient>
    );
  }
);
LinearGradient.displayName = 'LinearGradient';

/**
 * RadialGradient element
 */
export const RadialGradient = forwardRef<typeof RNRadialGradient, RadialGradientProps>(
  ({ children, ...props }, ref) => {
    const radialGradientProps = convertCommonProps(props);

    return (
      <RNRadialGradient ref={ref as any} {...(radialGradientProps as any)}>
        {children}
      </RNRadialGradient>
    );
  }
);
RadialGradient.displayName = 'RadialGradient';

/**
 * Stop element (for gradients)
 */
export const Stop = forwardRef<typeof RNStop, StopProps>(
  ({ offset, stopColor, stopOpacity }, ref) => {
    return (
      <RNStop
        ref={ref as any}
        offset={offset}
        stopColor={stopColor}
        stopOpacity={stopOpacity}
      />
    );
  }
);
Stop.displayName = 'Stop';

/**
 * Pattern element
 */
export const Pattern = forwardRef<typeof RNPattern, PatternProps>(
  ({ children, ...props }, ref) => {
    const patternProps = convertCommonProps(props);

    return (
      <RNPattern ref={ref as any} {...(patternProps as any)}>
        {children}
      </RNPattern>
    );
  }
);
Pattern.displayName = 'Pattern';

/**
 * Marker element
 */
export const Marker = forwardRef<typeof RNMarker, MarkerProps>(
  ({ children, ...props }, ref) => {
    const markerProps = convertCommonProps(props);

    return (
      <RNMarker ref={ref as any} {...(markerProps as any)}>
        {children}
      </RNMarker>
    );
  }
);
Marker.displayName = 'Marker';

/**
 * ForeignObject element (embed HTML/native views in SVG)
 */
export const ForeignObject = forwardRef<typeof RNForeignObject, ForeignObjectProps>(
  ({ children, ...props }, ref) => {
    const foreignObjectProps = convertCommonProps(props);

    return (
      <RNForeignObject ref={ref as any} {...(foreignObjectProps as any)}>
        {children}
      </RNForeignObject>
    );
  }
);
ForeignObject.displayName = 'ForeignObject';
