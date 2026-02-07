/**
 * Chart Context
 *
 * Provides chart dimensions, theme, and renderer to child components.
 */

import { createContext, useContext } from 'react';
import type { ChartContextValue } from '../../types';

/**
 * Chart context - provides shared state to all chart components
 */
export const ChartContext = createContext<ChartContextValue | null>(null);

/**
 * Hook to access chart context
 *
 * @throws Error if used outside of ChartContainer
 *
 * @example
 * ```tsx
 * const { width, height, innerWidth, innerHeight, padding } = useChart();
 * ```
 */
export function useChart(): ChartContextValue {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error(
      'useChart must be used within a ChartContainer. ' +
        'Make sure your chart component is wrapped in <ChartContainer>.'
    );
  }

  return context;
}

/**
 * Hook to optionally access chart context (returns null if not in context)
 */
export function useChartOptional(): ChartContextValue | null {
  return useContext(ChartContext);
}
