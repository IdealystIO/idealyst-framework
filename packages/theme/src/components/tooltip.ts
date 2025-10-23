import { StylesheetStyles } from "../styles";
import { Size } from "../theme/size";
import { Intent } from "../theme/intent";

type TooltipSize = Size;
type TooltipIntent = Intent;
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TooltipTooltipVariants = {
    size: TooltipSize;
    intent: TooltipIntent;
}

export type ExpandedTooltipTooltipStyles = StylesheetStyles<keyof TooltipTooltipVariants>;
export type ExpandedTooltipStyles = StylesheetStyles<never>;

export type TooltipStylesheet = {
    container: ExpandedTooltipStyles;
    tooltip: ExpandedTooltipTooltipStyles;
}

/**
 * NOTE: The tooltip stylesheet implementation has been moved to
 * @idealyst/components/src/Tooltip/Tooltip.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
