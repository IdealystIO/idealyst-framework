import { StylesheetStyles } from "../styles";
import { Color } from "../theme/color";
import { Size } from "../theme/size";

type TextSize = Size;
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

type TextVariants = {
    size: TextSize;
    weight: TextWeight;
    align: TextAlign;
    color: Color;
}

export type ExpandedTextStyles = StylesheetStyles<keyof TextVariants>;

export type TextStylesheet = {
    text: ExpandedTextStyles;
}

/**
 * NOTE: The text stylesheet implementation has been moved to
 * @idealyst/components/src/Text/Text.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
