import { StylesheetStyles } from "../styles";
import { Intent } from "../theme/intent";

type CardType = 'default' | 'outlined' | 'elevated' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardRadius = 'none' | 'sm' | 'md' | 'lg';
type CardIntent = Intent | 'info' | 'neutral';

type CardVariants = {
    type: CardType;
    padding: CardPadding;
    radius: CardRadius;
    intent: CardIntent;
    clickable: boolean;
    disabled: boolean;
}

export type ExpandedCardStyles = StylesheetStyles<keyof CardVariants>;

export type CardStylesheet = {
    card: ExpandedCardStyles;
}

/**
 * NOTE: The card stylesheet implementation has been moved to
 * @idealyst/components/src/Card/Card.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
