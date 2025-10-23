import { StylesheetStyles } from "../styles";

type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

type PopoverVariants = {
    placement: PopoverPlacement;
}

export type ExpandedPopoverStyles = StylesheetStyles<keyof PopoverVariants>;

export type PopoverStylesheet = {
    container: ExpandedPopoverStyles;
    content: ExpandedPopoverStyles;
    arrow: ExpandedPopoverStyles;
    backdrop: ExpandedPopoverStyles;
}

/**
 * NOTE: The popover stylesheet implementation has been moved to
 * @idealyst/components/src/Popover/Popover.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
