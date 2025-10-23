import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type ProgressSize = Size;
type ProgressIntent = Intent;

type ProgressVariants = {
    size: ProgressSize;
    intent: ProgressIntent;
    rounded: boolean;
}

export type ExpandedProgressStyles = StylesheetStyles<keyof ProgressVariants>;

export type ProgressStylesheet = {
    container: ExpandedProgressStyles;
    linearTrack: ExpandedProgressStyles;
    linearBar: ExpandedProgressStyles;
    indeterminateBar: ExpandedProgressStyles;
    circularContainer: ExpandedProgressStyles;
    circularTrack: ExpandedProgressStyles;
    circularBar: ExpandedProgressStyles;
    label: ExpandedProgressStyles;
    circularLabel: ExpandedProgressStyles;
}

/**
 * NOTE: The progress stylesheet implementation has been moved to
 * @idealyst/components/src/Progress/Progress.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
