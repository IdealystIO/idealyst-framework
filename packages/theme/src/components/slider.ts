import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type SliderSize = Size;
type SliderIntent = Intent;

type SliderTrackVariants = {
    size: SliderSize;
    disabled: boolean;
}

type SliderFilledTrackVariants = {
    intent: SliderIntent;
}

type SliderThumbVariants = {
    size: SliderSize;
    intent: SliderIntent;
    disabled: boolean;
}

type SliderThumbIconVariants = {
    size: SliderSize;
    intent: SliderIntent;
}

type SliderMarkVariants = {
    size: SliderSize;
}

export type ExpandedSliderTrackStyles = StylesheetStyles<keyof SliderTrackVariants>;
export type ExpandedSliderFilledTrackStyles = StylesheetStyles<keyof SliderFilledTrackVariants>;
export type ExpandedSliderThumbStyles = StylesheetStyles<keyof SliderThumbVariants>;
export type ExpandedSliderThumbIconStyles = StylesheetStyles<keyof SliderThumbIconVariants>;
export type ExpandedSliderMarkStyles = StylesheetStyles<keyof SliderMarkVariants>;
export type ExpandedSliderStyles = StylesheetStyles<never>;

export type SliderStylesheet = {
    container: ExpandedSliderStyles;
    sliderWrapper: ExpandedSliderStyles;
    track: ExpandedSliderTrackStyles;
    filledTrack: ExpandedSliderFilledTrackStyles;
    thumb: ExpandedSliderThumbStyles;
    thumbActive: ExpandedSliderStyles;
    thumbIcon: ExpandedSliderThumbIconStyles;
    valueLabel: ExpandedSliderStyles;
    minMaxLabels: ExpandedSliderStyles;
    minMaxLabel: ExpandedSliderStyles;
    marks: ExpandedSliderStyles;
    mark: ExpandedSliderMarkStyles;
    markLabel: ExpandedSliderStyles;
}

/**
 * NOTE: The slider stylesheet implementation has been moved to
 * @idealyst/components/src/Slider/Slider.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
