import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";

type SelectSize = Size;
type SelectType = 'outlined' | 'filled';
type SelectIntent = Intent;

type SelectTriggerVariants = {
    type: SelectType;
    size: SelectSize;
    intent: SelectIntent;
    disabled: boolean;
    error: boolean;
    focused: boolean;
}

type SelectOptionVariants = {
    selected: boolean;
    disabled: boolean;
}

type SelectHelperTextVariants = {
    error: boolean;
}

export type ExpandedSelectTriggerStyles = StylesheetStyles<keyof SelectTriggerVariants>;
export type ExpandedSelectOptionStyles = StylesheetStyles<keyof SelectOptionVariants>;
export type ExpandedSelectHelperTextStyles = StylesheetStyles<keyof SelectHelperTextVariants>;
export type ExpandedSelectStyles = StylesheetStyles<never>;

export type SelectStylesheet = {
    container: ExpandedSelectStyles;
    label: ExpandedSelectStyles;
    trigger: ExpandedSelectTriggerStyles;
    triggerContent: ExpandedSelectStyles;
    triggerText: ExpandedSelectStyles;
    placeholder: ExpandedSelectStyles;
    icon: ExpandedSelectStyles;
    chevron: ExpandedSelectStyles;
    chevronOpen: ExpandedSelectStyles;
    dropdown: ExpandedSelectStyles;
    searchContainer: ExpandedSelectStyles;
    searchInput: ExpandedSelectStyles;
    optionsList: ExpandedSelectStyles;
    option: ExpandedSelectOptionStyles;
    optionContent: ExpandedSelectStyles;
    optionIcon: ExpandedSelectStyles;
    optionText: ExpandedSelectStyles;
    optionTextDisabled: ExpandedSelectStyles;
    helperText: ExpandedSelectHelperTextStyles;
    overlay: ExpandedSelectStyles;
}

/**
 * NOTE: The select stylesheet implementation has been moved to
 * @idealyst/components/src/Select/Select.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
