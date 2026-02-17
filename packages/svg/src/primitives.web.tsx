import React, { forwardRef, SVGProps as ReactSVGProps } from 'react';
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
 * Helper to cast forwardRef refs to native element refs.
 * Works around React 19's stricter ref callback types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asRef = <T,>(ref: unknown): any => ref;

/**
 * Helper to convert props to native SVG attributes
 */
function convertCommonProps(props: Record<string, unknown>): ReactSVGProps<SVGElement> {
  const {
    testID,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    children,
    ...rest
  } = props;

  const result: Record<string, unknown> = { ...rest };

  // Convert testID to data-testid
  if (testID) {
    result['data-testid'] = testID;
  }

  // Convert press handlers to click handlers
  if (onPress) {
    result.onClick = onPress;
  }

  return result as ReactSVGProps<SVGElement>;
}

/**
 * Helper to convert stroke-dasharray from array to string
 */
function convertStrokeDasharray(value: string | number[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value.join(' ');
  }
  return value;
}

/**
 * Helper to convert points from array to string
 */
function convertPoints(points: string | number[]): string {
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
 * Root SVG element
 */
export const Svg = forwardRef<SVGSVGElement, SvgProps>(
  ({ children, title, desc, xmlns = 'http://www.w3.org/2000/svg', xmlnsXlink, color, strokeDasharray, ...props }, ref) => {
    const svgProps = convertCommonProps(props);

    return (
      <svg
        ref={asRef<SVGSVGElement>(ref)}
        xmlns={xmlns}
        xmlnsXlink={xmlnsXlink}
        style={color ? { color } : undefined}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(svgProps as ReactSVGProps<SVGSVGElement>)}
      >
        {title && <title>{title}</title>}
        {desc && <desc>{desc}</desc>}
        {children}
      </svg>
    );
  }
);
Svg.displayName = 'Svg';

/**
 * Group element
 */
export const G = forwardRef<SVGGElement, GProps>(
  ({ children, x, y, rotation, scale, originX, originY, strokeDasharray, ...props }, ref) => {
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
      <g
        ref={asRef<SVGGElement>(ref)}
        transform={transform.trim() || undefined}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(gProps as ReactSVGProps<SVGGElement>)}
      >
        {children}
      </g>
    );
  }
);
G.displayName = 'G';

/**
 * Path element
 */
export const Path = forwardRef<SVGPathElement, PathProps>(
  ({ d, strokeDasharray, ...props }, ref) => {
    const pathProps = convertCommonProps(props);

    return (
      <path
        ref={asRef<SVGPathElement>(ref)}
        d={d}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(pathProps as ReactSVGProps<SVGPathElement>)}
      />
    );
  }
);
Path.displayName = 'Path';

/**
 * Rectangle element
 */
export const Rect = forwardRef<SVGRectElement, RectProps>(
  ({ strokeDasharray, ...props }, ref) => {
    const rectProps = convertCommonProps(props);

    return (
      <rect
        ref={asRef<SVGRectElement>(ref)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(rectProps as ReactSVGProps<SVGRectElement>)}
      />
    );
  }
);
Rect.displayName = 'Rect';

/**
 * Circle element
 */
export const Circle = forwardRef<SVGCircleElement, CircleProps>(
  ({ strokeDasharray, ...props }, ref) => {
    const circleProps = convertCommonProps(props);

    return (
      <circle
        ref={asRef<SVGCircleElement>(ref)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(circleProps as ReactSVGProps<SVGCircleElement>)}
      />
    );
  }
);
Circle.displayName = 'Circle';

/**
 * Ellipse element
 */
export const Ellipse = forwardRef<SVGEllipseElement, EllipseProps>(
  ({ strokeDasharray, ...props }, ref) => {
    const ellipseProps = convertCommonProps(props);

    return (
      <ellipse
        ref={asRef<SVGEllipseElement>(ref)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(ellipseProps as ReactSVGProps<SVGEllipseElement>)}
      />
    );
  }
);
Ellipse.displayName = 'Ellipse';

/**
 * Line element
 */
export const Line = forwardRef<SVGLineElement, LineProps>(
  ({ strokeDasharray, ...props }, ref) => {
    const lineProps = convertCommonProps(props);

    return (
      <line
        ref={asRef<SVGLineElement>(ref)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(lineProps as ReactSVGProps<SVGLineElement>)}
      />
    );
  }
);
Line.displayName = 'Line';

/**
 * Polyline element (open shape)
 */
export const Polyline = forwardRef<SVGPolylineElement, PolylineProps>(
  ({ points, strokeDasharray, ...props }, ref) => {
    const polylineProps = convertCommonProps(props);

    return (
      <polyline
        ref={asRef<SVGPolylineElement>(ref)}
        points={convertPoints(points)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(polylineProps as ReactSVGProps<SVGPolylineElement>)}
      />
    );
  }
);
Polyline.displayName = 'Polyline';

/**
 * Polygon element (closed shape)
 */
export const Polygon = forwardRef<SVGPolygonElement, PolygonProps>(
  ({ points, strokeDasharray, ...props }, ref) => {
    const polygonProps = convertCommonProps(props);

    return (
      <polygon
        ref={asRef<SVGPolygonElement>(ref)}
        points={convertPoints(points)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(polygonProps as ReactSVGProps<SVGPolygonElement>)}
      />
    );
  }
);
Polygon.displayName = 'Polygon';

/**
 * Text element
 */
export const Text = forwardRef<SVGTextElement, TextProps>(
  ({ children, strokeDasharray, ...props }, ref) => {
    const textProps = convertCommonProps(props);

    return (
      <text
        ref={asRef<SVGTextElement>(ref)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(textProps as ReactSVGProps<SVGTextElement>)}
      >
        {children}
      </text>
    );
  }
);
Text.displayName = 'Text';

/**
 * TSpan element (text span)
 */
export const TSpan = forwardRef<SVGTSpanElement, TSpanProps>(
  ({ children, inlineSize, strokeDasharray, ...props }, ref) => {
    const tspanProps = convertCommonProps(props);

    return (
      <tspan
        ref={asRef<SVGTSpanElement>(ref)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(tspanProps as ReactSVGProps<SVGTSpanElement>)}
      >
        {children}
      </tspan>
    );
  }
);
TSpan.displayName = 'TSpan';

/**
 * TextPath element (text along a path)
 */
export const TextPath = forwardRef<SVGTextPathElement, TextPathProps>(
  ({ children, href, path, strokeDasharray, ...props }, ref) => {
    const textPathProps = convertCommonProps(props);

    return (
      <textPath
        ref={asRef<SVGTextPathElement>(ref)}
        href={href}
        path={path}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(textPathProps as ReactSVGProps<SVGTextPathElement>)}
      >
        {children}
      </textPath>
    );
  }
);
TextPath.displayName = 'TextPath';

/**
 * Use element (reference another element)
 */
export const Use = forwardRef<SVGUseElement, UseProps>(
  ({ href, strokeDasharray, ...props }, ref) => {
    const useProps = convertCommonProps(props);

    return (
      <use
        ref={asRef<SVGUseElement>(ref)}
        href={href}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(useProps as ReactSVGProps<SVGUseElement>)}
      />
    );
  }
);
Use.displayName = 'Use';

/**
 * Symbol element (reusable graphics)
 */
export const Symbol = forwardRef<SVGSymbolElement, SymbolProps>(
  ({ children, strokeDasharray, ...props }, ref) => {
    const symbolProps = convertCommonProps(props);

    return (
      <symbol
        ref={asRef<SVGSymbolElement>(ref)}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(symbolProps as ReactSVGProps<SVGSymbolElement>)}
      >
        {children}
      </symbol>
    );
  }
);
Symbol.displayName = 'Symbol';

/**
 * Defs element (definitions container)
 */
export const Defs = forwardRef<SVGDefsElement, DefsProps>(
  ({ children, ...props }, ref) => {
    const defsProps = convertCommonProps(props);

    return (
      <defs ref={asRef<SVGDefsElement>(ref)} {...(defsProps as ReactSVGProps<SVGDefsElement>)}>
        {children}
      </defs>
    );
  }
);
Defs.displayName = 'Defs';

/**
 * Image element
 */
export const Image = forwardRef<SVGImageElement, ImageProps>(
  ({ href, strokeDasharray, ...props }, ref) => {
    const imageProps = convertCommonProps(props);

    return (
      <image
        ref={asRef<SVGImageElement>(ref)}
        href={href}
        strokeDasharray={convertStrokeDasharray(strokeDasharray)}
        {...(imageProps as ReactSVGProps<SVGImageElement>)}
      />
    );
  }
);
Image.displayName = 'Image';

/**
 * ClipPath element
 */
export const ClipPath = forwardRef<SVGClipPathElement, ClipPathProps>(
  ({ children, ...props }, ref) => {
    const clipPathProps = convertCommonProps(props);

    return (
      <clipPath ref={asRef<SVGClipPathElement>(ref)} {...(clipPathProps as ReactSVGProps<SVGClipPathElement>)}>
        {children}
      </clipPath>
    );
  }
);
ClipPath.displayName = 'ClipPath';

/**
 * Mask element
 */
export const Mask = forwardRef<SVGMaskElement, MaskProps>(
  ({ children, ...props }, ref) => {
    const maskProps = convertCommonProps(props);

    return (
      <mask ref={asRef<SVGMaskElement>(ref)} {...(maskProps as ReactSVGProps<SVGMaskElement>)}>
        {children}
      </mask>
    );
  }
);
Mask.displayName = 'Mask';

/**
 * LinearGradient element
 */
export const LinearGradient = forwardRef<SVGLinearGradientElement, LinearGradientProps>(
  ({ children, ...props }, ref) => {
    const linearGradientProps = convertCommonProps(props);

    return (
      <linearGradient ref={asRef<SVGLinearGradientElement>(ref)} {...(linearGradientProps as ReactSVGProps<SVGLinearGradientElement>)}>
        {children}
      </linearGradient>
    );
  }
);
LinearGradient.displayName = 'LinearGradient';

/**
 * RadialGradient element
 */
export const RadialGradient = forwardRef<SVGRadialGradientElement, RadialGradientProps>(
  ({ children, ...props }, ref) => {
    const radialGradientProps = convertCommonProps(props);

    return (
      <radialGradient ref={asRef<SVGRadialGradientElement>(ref)} {...(radialGradientProps as ReactSVGProps<SVGRadialGradientElement>)}>
        {children}
      </radialGradient>
    );
  }
);
RadialGradient.displayName = 'RadialGradient';

/**
 * Stop element (for gradients)
 */
export const Stop = forwardRef<SVGStopElement, StopProps>(
  ({ offset, stopColor, stopOpacity, ...props }, ref) => {
    return (
      <stop
        ref={asRef<SVGStopElement>(ref)}
        offset={offset}
        stopColor={stopColor}
        stopOpacity={stopOpacity}
        {...(props as ReactSVGProps<SVGStopElement>)}
      />
    );
  }
);
Stop.displayName = 'Stop';

/**
 * Pattern element
 */
export const Pattern = forwardRef<SVGPatternElement, PatternProps>(
  ({ children, ...props }, ref) => {
    const patternProps = convertCommonProps(props);

    return (
      <pattern ref={asRef<SVGPatternElement>(ref)} {...(patternProps as ReactSVGProps<SVGPatternElement>)}>
        {children}
      </pattern>
    );
  }
);
Pattern.displayName = 'Pattern';

/**
 * Marker element
 */
export const Marker = forwardRef<SVGMarkerElement, MarkerProps>(
  ({ children, ...props }, ref) => {
    const markerProps = convertCommonProps(props);

    return (
      <marker ref={asRef<SVGMarkerElement>(ref)} {...(markerProps as ReactSVGProps<SVGMarkerElement>)}>
        {children}
      </marker>
    );
  }
);
Marker.displayName = 'Marker';

/**
 * ForeignObject element (embed HTML in SVG)
 */
export const ForeignObject = forwardRef<SVGForeignObjectElement, ForeignObjectProps>(
  ({ children, ...props }, ref) => {
    const foreignObjectProps = convertCommonProps(props);

    return (
      <foreignObject ref={asRef<SVGForeignObjectElement>(ref)} {...(foreignObjectProps as ReactSVGProps<SVGForeignObjectElement>)}>
        {children}
      </foreignObject>
    );
  }
);
ForeignObject.displayName = 'ForeignObject';
