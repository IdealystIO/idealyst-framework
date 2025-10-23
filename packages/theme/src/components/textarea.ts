import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type TextAreaSize = Size;
type TextAreaIntent = Intent;
type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';

type TextAreaLabelVariants = {
    disabled: boolean;
}

type TextAreaTextareaVariants = {
    size: TextAreaSize;
    intent: TextAreaIntent;
    disabled: boolean;
    hasError: boolean;
    resize: TextAreaResize;
}

type TextAreaHelperTextVariants = {
    hasError: boolean;
}

type TextAreaCharacterCountVariants = {
    isNearLimit: boolean;
    isAtLimit: boolean;
}

export type ExpandedTextAreaLabelStyles = StylesheetStyles<keyof TextAreaLabelVariants>;
export type ExpandedTextAreaTextareaStyles = StylesheetStyles<keyof TextAreaTextareaVariants>;
export type ExpandedTextAreaHelperTextStyles = StylesheetStyles<keyof TextAreaHelperTextVariants>;
export type ExpandedTextAreaCharacterCountStyles = StylesheetStyles<keyof TextAreaCharacterCountVariants>;
export type ExpandedTextAreaStyles = StylesheetStyles<never>;

export type TextAreaStylesheet = {
    container: ExpandedTextAreaStyles;
    label: ExpandedTextAreaLabelStyles;
    textareaContainer: ExpandedTextAreaStyles;
    textarea: ExpandedTextAreaTextareaStyles;
    helperText: ExpandedTextAreaHelperTextStyles;
    footer: ExpandedTextAreaStyles;
    characterCount: ExpandedTextAreaCharacterCountStyles;
}

/**
 * NOTE: The textarea stylesheet implementation has been moved to
 * @idealyst/components/src/TextArea/TextArea.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
