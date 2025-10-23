import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type ButtonSize = Size;
type ButtonIntent = Intent;
type ButtonType = 'contained' | 'outlined' | 'text';

type ButtonVariants = {
    size: ButtonSize;
    intent: ButtonIntent;
    type: ButtonType;
    disabled: boolean;
}

export type ExpandedButtonStyles = StylesheetStyles<keyof ButtonVariants>;

export type ButtonStylesheet = {
    button: ExpandedButtonStyles;
    icon: ExpandedButtonStyles;
    iconContainer: ExpandedButtonStyles;
    text: ExpandedButtonStyles;
}

/**
 * NOTE: The button stylesheet implementation has been moved to
 * @idealyst/components/src/Button/Button.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */