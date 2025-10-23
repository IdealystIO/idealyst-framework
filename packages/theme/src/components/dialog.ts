import { StylesheetStyles } from "../styles";

type DialogSize = 'sm' | 'md' | 'lg' | 'fullscreen';
type DialogType = 'default' | 'alert' | 'confirmation';

type DialogVariants = {
    size: DialogSize;
    type: DialogType;
}

export type ExpandedDialogStyles = StylesheetStyles<keyof DialogVariants>;

export type DialogStylesheet = {
    backdrop: ExpandedDialogStyles;
    container: ExpandedDialogStyles;
    header: ExpandedDialogStyles;
    title: ExpandedDialogStyles;
    closeButton: ExpandedDialogStyles;
    closeButtonText: ExpandedDialogStyles;
    content: ExpandedDialogStyles;
    modal: ExpandedDialogStyles;
}

/**
 * NOTE: The dialog stylesheet implementation has been moved to
 * @idealyst/components/src/Dialog/Dialog.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
