/**
 * Chart Container
 *
 * Root container for charts that:
 * - Tracks container dimensions (responsive)
 * - Provides chart context to children
 * - Handles padding/margin calculations
 */

import React, { useMemo, useState, useCallback, useRef } from 'react';
import { View, type LayoutChangeEvent } from '@idealyst/components';
import type { Intent, Size } from '@idealyst/theme';
import type { ChartPadding, ChartContextValue, RendererType } from '../../types';
import { DEFAULT_PADDING } from '../../types';
import { ChartContext } from './ChartContext';

/**
 * Props for ChartContainer
 */
export interface ChartContainerProps {
  /** Chart width (pixels or CSS value) */
  width?: number | string;
  /** Chart height (pixels or CSS value) */
  height?: number | string;
  /** Aspect ratio (width/height) - used if only width is specified */
  aspectRatio?: number;
  /** Padding around the chart area */
  padding?: Partial<ChartPadding> | number;
  /** Theme intent */
  intent?: Intent;
  /** Size variant */
  size?: Size;
  /** Renderer type */
  renderer?: RendererType;
  /** Children */
  children: React.ReactNode;
  /** Test ID */
  testID?: string;
}

/**
 * Normalize padding input to full ChartPadding object
 */
function normalizePadding(
  padding: Partial<ChartPadding> | number | undefined,
  size: Size
): ChartPadding {
  const defaultPadding = DEFAULT_PADDING[size];

  if (padding === undefined) {
    return defaultPadding;
  }

  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
  }

  return {
    top: padding.top ?? defaultPadding.top,
    right: padding.right ?? defaultPadding.right,
    bottom: padding.bottom ?? defaultPadding.bottom,
    left: padding.left ?? defaultPadding.left,
  };
}

/**
 * Determine actual renderer based on preference and platform
 */
function resolveRenderer(preference: RendererType = 'auto'): 'svg' | 'skia' {
  if (preference === 'svg') return 'svg';
  if (preference === 'skia') return 'skia';

  // Auto: Use Skia on native if available, SVG everywhere else
  // For now, default to SVG until Skia is fully implemented
  return 'svg';
}

/**
 * Chart Container Component
 *
 * Wraps chart content and provides dimensions, padding, and context.
 *
 * @example
 * ```tsx
 * <ChartContainer
 *   width={400}
 *   height={300}
 *   padding={20}
 *   intent="primary"
 *   size="md"
 * >
 *   <LineChart data={data} />
 * </ChartContainer>
 * ```
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  width: propWidth,
  height: propHeight,
  aspectRatio,
  padding: propPadding,
  intent = 'primary',
  size = 'md',
  renderer: rendererPreference = 'auto',
  children,
  testID,
}) => {
  // Track measured dimensions for responsive sizing
  const [measuredWidth, setMeasuredWidth] = useState<number>(0);
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);
  const containerRef = useRef(null);

  // Handle layout changes
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setMeasuredWidth(width);
    setMeasuredHeight(height);
  }, []);

  // Calculate actual dimensions
  const { width, height } = useMemo(() => {
    let w: number;
    let h: number;

    // Determine width
    if (typeof propWidth === 'number') {
      w = propWidth;
    } else if (measuredWidth > 0) {
      w = measuredWidth;
    } else {
      w = 300; // Default fallback
    }

    // Determine height
    if (typeof propHeight === 'number') {
      h = propHeight;
    } else if (aspectRatio && w > 0) {
      h = w / aspectRatio;
    } else if (measuredHeight > 0) {
      h = measuredHeight;
    } else {
      h = 200; // Default fallback
    }

    return { width: w, height: h };
  }, [propWidth, propHeight, aspectRatio, measuredWidth, measuredHeight]);

  // Normalize padding
  const padding = useMemo(() => normalizePadding(propPadding, size), [propPadding, size]);

  // Calculate inner dimensions (chart area without padding)
  const innerWidth = Math.max(0, width - padding.left - padding.right);
  const innerHeight = Math.max(0, height - padding.top - padding.bottom);

  // Resolve renderer
  const renderer = useMemo(() => resolveRenderer(rendererPreference), [rendererPreference]);

  // Build context value
  const contextValue: ChartContextValue = useMemo(
    () => ({
      width,
      height,
      padding,
      innerWidth,
      innerHeight,
      intent,
      size,
      renderer,
    }),
    [width, height, padding, innerWidth, innerHeight, intent, size, renderer]
  );

  // Container style
  const containerStyle = useMemo(
    () => ({
      width: propWidth ?? '100%',
      height: propHeight ?? (aspectRatio ? undefined : 200),
      aspectRatio: aspectRatio && !propHeight ? aspectRatio : undefined,
    }),
    [propWidth, propHeight, aspectRatio]
  );

  return (
    <ChartContext.Provider value={contextValue}>
      <View
        ref={containerRef}
        style={containerStyle}
        onLayout={onLayout}
        testID={testID}
      >
        {/* Only render children when we have valid dimensions */}
        {width > 0 && height > 0 ? children : null}
      </View>
    </ChartContext.Provider>
  );
};

export default ChartContainer;
