import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

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
 * Helper to get intent colors, mapping 'info' to 'primary'
 */
function getIntentColors(theme: Theme, intent: CardIntent) {
    if (intent === 'neutral' || intent === 'info') {
        return theme.intents.primary; // Map both neutral and info to primary for simplicity
    }
    return theme.intents[intent as Intent];
}

/**
 * Create type variants for card
 */
function createCardTypeVariants(theme: Theme) {
    return {
        default: {
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        elevated: {
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 0,
            _web: {
                border: 'none',
            },
        },
        filled: {
            backgroundColor: theme.colors.surface.secondary,
            borderWidth: 0,
            _web: {
                border: 'none',
            },
        },
    };
}

/**
 * Create padding variants for card
 */
function createCardPaddingVariants(theme: Theme) {
    return {
        none: { padding: 0 },
        sm: { padding: 8 },
        md: { padding: 16 },
        lg: { padding: 24 },
    };
}

/**
 * Create radius variants for card
 */
function createCardRadiusVariants(theme: Theme) {
    return {
        none: { borderRadius: 0 },
        sm: { borderRadius: 4 },
        md: { borderRadius: 8 },
        lg: { borderRadius: 12 },
    };
}

/**
 * Create compound variants for card
 */
function createCardCompoundVariants(theme: Theme): CompoundVariants<keyof CardVariants> {
    const variants: CompoundVariants<keyof CardVariants> = [];
    const intents: CardIntent[] = ['primary', 'success', 'error', 'warning', 'info', 'neutral'];

    // Elevated variant with shadows
    variants.push({
        type: 'elevated',
        styles: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            _web: {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
            },
        },
    });

    // Intent color combinations for outlined variant
    for (const intent of intents) {
        if (intent !== 'neutral') {
            const colors = getIntentColors(theme, intent);
            variants.push({
                type: 'outlined',
                intent: intent,
                styles: {
                    borderColor: colors.primary,
                    _web: {
                        border: `1px solid ${colors.primary}`,
                    },
                },
            });
        }
    }

    // Intent color combinations for filled variant
    for (const intent of intents) {
        if (intent !== 'neutral') {
            const colors = getIntentColors(theme, intent);
            variants.push({
                type: 'filled',
                intent: intent,
                styles: {
                    backgroundColor: colors.light || colors.primary + '20',
                },
            });
        }
    }

    return variants;
}

/**
 * Generate card styles
 */
const createCardStyles = (theme: Theme, expanded: Partial<ExpandedCardStyles>): ExpandedCardStyles => {
    return deepMerge({
        backgroundColor: theme.colors.surface.primary,
        position: 'relative',
        overflow: 'hidden',
        variants: {
            type: createCardTypeVariants(theme),
            padding: createCardPaddingVariants(theme),
            radius: createCardRadiusVariants(theme),
            intent: {
                neutral: {},
                primary: {},
                success: {},
                error: {},
                warning: {},
                info: {},
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
        compoundVariants: createCardCompoundVariants(theme),
        _web: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
    }, expanded);
}

/**
 * Generate card stylesheet
 */
export const createCardStylesheet = (theme: Theme, expanded?: Partial<CardStylesheet>): CardStylesheet => {
    return {
        card: createCardStyles(theme, expanded?.card || {}),
    };
}
