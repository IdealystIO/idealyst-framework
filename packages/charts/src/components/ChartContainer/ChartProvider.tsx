/**
 * Chart Provider
 *
 * App-wide provider for chart configuration including:
 * - Default renderer selection
 * - Theme overrides
 * - Animation defaults
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { Intent, Size } from '@idealyst/theme';
import type { RendererType, AnimationConfig } from '../../types';
import { svgRenderer } from '../../renderers/svg';
import { skiaRenderer, isSkiaAvailable } from '../../renderers/skia';
import type { ChartRenderer, RendererContextValue } from '../../renderers/types';

/**
 * Chart provider configuration
 */
export interface ChartProviderConfig {
  /** Default renderer for all charts */
  renderer?: RendererType;
  /** Default intent */
  defaultIntent?: Intent;
  /** Default size */
  defaultSize?: Size;
  /** Default animation configuration */
  animation?: AnimationConfig;
  /** Custom color palette for series */
  colorPalette?: string[];
}

/**
 * Chart provider context value
 */
export interface ChartProviderContextValue {
  /** Resolved renderer type */
  rendererType: 'svg' | 'skia';
  /** Renderer components */
  renderer: ChartRenderer;
  /** Whether Skia is available */
  skiaAvailable: boolean;
  /** Default intent */
  defaultIntent: Intent;
  /** Default size */
  defaultSize: Size;
  /** Animation config */
  animation: AnimationConfig;
  /** Color palette */
  colorPalette: string[];
}

/**
 * Default color palette using common chart colors
 */
const DEFAULT_COLOR_PALETTE = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#dc2626', // Red
  '#ca8a04', // Yellow
  '#9333ea', // Purple
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#db2777', // Pink
];

/**
 * Default animation configuration
 */
const DEFAULT_ANIMATION: AnimationConfig = {
  enabled: true,
  duration: 300,
  delay: 0,
  easing: 'easeOut',
};

/**
 * Chart provider context
 */
const ChartProviderContext = createContext<ChartProviderContextValue | null>(null);

/**
 * Props for ChartProvider
 */
export interface ChartProviderProps extends ChartProviderConfig {
  children: React.ReactNode;
}

/**
 * Resolve renderer based on preference and availability
 */
function resolveRenderer(preference: RendererType = 'auto'): 'svg' | 'skia' {
  switch (preference) {
    case 'svg':
      return 'svg';
    case 'skia':
      return isSkiaAvailable ? 'skia' : 'svg';
    case 'auto':
    default:
      // Auto: prefer Skia on native if available
      return isSkiaAvailable ? 'skia' : 'svg';
  }
}

/**
 * Get renderer components based on type
 */
function getRenderer(type: 'svg' | 'skia'): ChartRenderer {
  return type === 'skia' ? skiaRenderer : svgRenderer;
}

/**
 * Chart Provider Component
 *
 * Provides app-wide defaults for all charts.
 *
 * @example
 * ```tsx
 * <ChartProvider
 *   renderer="skia"
 *   defaultIntent="primary"
 *   animation={{ enabled: true, duration: 500 }}
 * >
 *   <App />
 * </ChartProvider>
 * ```
 */
export const ChartProvider: React.FC<ChartProviderProps> = ({
  renderer: rendererPreference = 'auto',
  defaultIntent = 'primary',
  defaultSize = 'md',
  animation = DEFAULT_ANIMATION,
  colorPalette = DEFAULT_COLOR_PALETTE,
  children,
}) => {
  const contextValue = useMemo<ChartProviderContextValue>(() => {
    const rendererType = resolveRenderer(rendererPreference);
    const renderer = getRenderer(rendererType);

    return {
      rendererType,
      renderer,
      skiaAvailable: isSkiaAvailable,
      defaultIntent,
      defaultSize,
      animation: { ...DEFAULT_ANIMATION, ...animation },
      colorPalette,
    };
  }, [rendererPreference, defaultIntent, defaultSize, animation, colorPalette]);

  return (
    <ChartProviderContext.Provider value={contextValue}>
      {children}
    </ChartProviderContext.Provider>
  );
};

/**
 * Hook to access chart provider context
 *
 * Returns default values if not within a ChartProvider
 */
export function useChartProvider(): ChartProviderContextValue {
  const context = useContext(ChartProviderContext);

  if (context) {
    return context;
  }

  // Return defaults if not in provider
  const rendererType = resolveRenderer('auto');
  return {
    rendererType,
    renderer: getRenderer(rendererType),
    skiaAvailable: isSkiaAvailable,
    defaultIntent: 'primary',
    defaultSize: 'md',
    animation: DEFAULT_ANIMATION,
    colorPalette: DEFAULT_COLOR_PALETTE,
  };
}

/**
 * Hook to get the current renderer
 */
export function useRenderer(): RendererContextValue {
  const { rendererType, renderer } = useChartProvider();
  return {
    type: rendererType,
    renderer,
  };
}

/**
 * Hook to get color from palette by index
 */
export function useSeriesColor(index: number, customColor?: string): string {
  const { colorPalette } = useChartProvider();

  if (customColor) return customColor;

  return colorPalette[index % colorPalette.length];
}

export default ChartProvider;
