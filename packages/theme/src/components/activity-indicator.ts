import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type ActivityIndicatorSize = Size;
type ActivityIndicatorIntent = Intent;

type ActivityIndicatorVariants = {
    size: ActivityIndicatorSize;
    intent: ActivityIndicatorIntent;
    animating: boolean;
}

export type ExpandedActivityIndicatorStyles = StylesheetStyles<keyof ActivityIndicatorVariants>;

export type ActivityIndicatorStylesheet = {
    container: ExpandedActivityIndicatorStyles;
    spinner: ExpandedActivityIndicatorStyles;
}

/**
 * NOTE: The activity-indicator stylesheet implementation has been moved to
 * @idealyst/components/src/ActivityIndicator/ActivityIndicator.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
