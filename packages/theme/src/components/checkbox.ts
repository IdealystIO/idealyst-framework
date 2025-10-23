import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type CheckboxSize = Size;
type CheckboxIntent = Intent | 'info';
type CheckboxType = 'default' | 'outlined';

type CheckboxVariants = {
    size: CheckboxSize;
    intent: CheckboxIntent;
    type: CheckboxType;
    checked: boolean;
    disabled: boolean;
    visible: boolean;
    error: boolean;
}

export type ExpandedCheckboxStyles = StylesheetStyles<keyof CheckboxVariants>;

export type CheckboxStylesheet = {
    wrapper: ExpandedCheckboxStyles;
    container: ExpandedCheckboxStyles;
    checkbox: ExpandedCheckboxStyles;
    label: ExpandedCheckboxStyles;
    checkmark: ExpandedCheckboxStyles;
    helperText: ExpandedCheckboxStyles;
}

/**
 * NOTE: The checkbox stylesheet implementation has been moved to
 * @idealyst/components/src/Checkbox/Checkbox.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
