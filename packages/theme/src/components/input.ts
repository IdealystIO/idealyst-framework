import { StylesheetStyles } from "../styles";
import { Size } from "../theme/size";

type InputSize = Size;
type InputType = 'default' | 'outlined' | 'filled' | 'bare';

type InputVariants = {
    size: InputSize;
    type: InputType;
    focused: boolean;
    hasError: boolean;
    disabled: boolean;
}

export type ExpandedInputStyles = StylesheetStyles<keyof InputVariants>;

export type InputStylesheet = {
    container: ExpandedInputStyles;
    leftIconContainer: ExpandedInputStyles;
    rightIconContainer: ExpandedInputStyles;
    leftIcon: ExpandedInputStyles;
    rightIcon: ExpandedInputStyles;
    passwordToggle: ExpandedInputStyles;
    passwordToggleIcon: ExpandedInputStyles;
    input: ExpandedInputStyles;
}

/**
 * NOTE: The input stylesheet implementation has been moved to
 * @idealyst/components/src/Input/Input.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
