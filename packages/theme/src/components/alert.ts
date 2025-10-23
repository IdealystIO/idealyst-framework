import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";

type AlertType = 'filled' | 'outlined' | 'soft';
type AlertIntent = Intent | 'info';

type AlertVariants = {
    type: AlertType;
    intent: AlertIntent;
}

export type ExpandedAlertStyles = StylesheetStyles<keyof AlertVariants>;

export type AlertStylesheet = {
    container: ExpandedAlertStyles;
    iconContainer: ExpandedAlertStyles;
    content: ExpandedAlertStyles;
    title: ExpandedAlertStyles;
    message: ExpandedAlertStyles;
    actions: ExpandedAlertStyles;
    closeButton: ExpandedAlertStyles;
    closeIcon: ExpandedAlertStyles;
}

/**
 * NOTE: The alert stylesheet implementation has been moved to
 * @idealyst/components/src/Alert/Alert.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
