import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type RadioButtonSize = Size;
type RadioButtonIntent = Intent;
type RadioGroupOrientation = 'horizontal' | 'vertical';

type RadioButtonVariants = {
    size: RadioButtonSize;
    intent: RadioButtonIntent;
    checked: boolean;
    disabled: boolean;
}

type RadioGroupVariants = {
    orientation: RadioGroupOrientation;
}

export type ExpandedRadioButtonStyles = StylesheetStyles<keyof RadioButtonVariants>;
export type ExpandedRadioGroupStyles = StylesheetStyles<keyof RadioGroupVariants>;

export type RadioButtonStylesheet = {
    container: ExpandedRadioButtonStyles;
    radio: ExpandedRadioButtonStyles;
    radioDot: ExpandedRadioButtonStyles;
    label: ExpandedRadioButtonStyles;
    groupContainer: ExpandedRadioGroupStyles;
}

/**
 * NOTE: The radio-button stylesheet implementation has been moved to
 * @idealyst/components/src/RadioButton/RadioButton.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
