import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, } from '@idealyst/theme';

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
 * Create type variants for card
 */
function createCardTypeVariants(theme: Theme, intent?: CardIntent) {

    const intentColors = theme.intents[intent];

    return {
        default: {
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 1,
            borderColor: intentColors?.primary || theme.colors.border.secondary,
            borderStyle: 'solid',
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: intentColors?.primary || theme.colors.border.secondary,
            borderStyle: 'solid',
        },
        elevated: {
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 0,
            borderStyle: 'none',
            ...theme.shadows.md,
        },
        filled: {
            backgroundColor: theme.colors.surface.secondary,
            borderWidth: 0,
            borderStyle: 'none',
        },
    };
}

/**
 * Generate card styles
 */
function createCardStyles(theme: Theme)  {
    return ({ intent }: CardVariants) => {
        return {
            backgroundColor: theme.colors.surface.primary,
            position: 'relative',
            overflow: 'hidden',
            variants: {
                type: createCardTypeVariants(theme, intent),
                padding: {
                    none: { padding: 0 },
                    sm: { padding: 8 },
                    md: { padding: 16 },
                    lg: { padding: 24 },
                },
                radius: {
                    none: { borderRadius: 0 },
                    sm: { borderRadius: 4 },
                    md: { borderRadius: 8 },
                    lg: { borderRadius: 12 },
                },
                clickable: {
                    true: {
                        _web: {
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            _hover: {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
                            },
                        },
                    },
                    false: {
                        _web: {
                            cursor: 'default',
                        },
                    },
                },
                disabled: {
                    true: {
                        opacity: 0.6,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {
                        opacity: 1,
                    },
                },
            },
            _web: {
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
            },
        };
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const cardStyles = StyleSheet.create((theme: Theme) => {
  return {
    card: createCardStyles(theme),
  };
});