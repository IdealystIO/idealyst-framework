/**
 * useChartTooltip - Native Stub
 *
 * Placeholder for native chart tooltip. Touch-based tooltip interaction
 * (long press / pan) can be implemented here later.
 */

export type { UseChartTooltipOptions, UseChartTooltipResult, ScreenPoint, ScreenBar } from './useChartTooltip';

import type { UseChartTooltipOptions, UseChartTooltipResult } from './useChartTooltip';

export function useChartTooltip(_options: UseChartTooltipOptions): UseChartTooltipResult {
  return {
    tooltipContext: null,
    tooltipX: null,
    activePointIndex: null,
    containerProps: {},
  };
}
