import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type SwitchSize = Size;
type SwitchIntent = Intent;
type LabelPosition = 'left' | 'right';

type SwitchTrackVariants = {
    size: SwitchSize;
    checked: boolean;
    intent: SwitchIntent;
    disabled: boolean;
}

type SwitchThumbVariants = {
    size: SwitchSize;
    checked: boolean;
}

type ThumbIconVariants = {
    size: SwitchSize;
    checked: boolean;
    intent: SwitchIntent;
}

type LabelVariants = {
    disabled: boolean;
    position: LabelPosition;
}

export type ExpandedSwitchTrackStyles = StylesheetStyles<keyof SwitchTrackVariants>;
export type ExpandedSwitchThumbStyles = StylesheetStyles<keyof SwitchThumbVariants>;
export type ExpandedThumbIconStyles = StylesheetStyles<keyof ThumbIconVariants>;
export type ExpandedLabelStyles = StylesheetStyles<keyof LabelVariants>;
export type ExpandedSwitchStyles = StylesheetStyles<never>;

export type SwitchStylesheet = {
    container: ExpandedSwitchStyles;
    switchContainer: ExpandedSwitchStyles;
    switchTrack: ExpandedSwitchTrackStyles;
    switchThumb: ExpandedSwitchThumbStyles;
    thumbIcon: ExpandedThumbIconStyles;
    label: ExpandedLabelStyles;
}

/**
 * NOTE: The switch stylesheet implementation has been moved to
 * @idealyst/components/src/Switch/Switch.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
