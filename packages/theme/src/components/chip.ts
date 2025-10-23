import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";

type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ChipType = 'filled' | 'outlined' | 'soft';
type ChipIntent = Intent;

type ChipVariants = {
    size: ChipSize;
    type: ChipType;
    intent: ChipIntent;
    selected: boolean;
    disabled: boolean;
    selectable: boolean;
}

export type ExpandedChipStyles = StylesheetStyles<keyof ChipVariants>;

export type ChipStylesheet = {
    container: ExpandedChipStyles;
    label: ExpandedChipStyles;
    icon: ExpandedChipStyles;
    deleteButton: ExpandedChipStyles;
    deleteIcon: ExpandedChipStyles;
}

/**
 * NOTE: The chip stylesheet implementation has been moved to
 * @idealyst/components/src/Chip/Chip.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
