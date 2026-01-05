import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent, Size, CompoundVariants} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { ButtonGradient } from './types';

type ButtonSize = Size;
type ButtonIntent = Intent;
type ButtonType = 'contained' | 'outlined' | 'text';

export type ButtonVariants = {
    size: ButtonSize;
    intent: ButtonIntent;
    type: ButtonType;
    disabled: boolean;
    gradient?: ButtonGradient;
}

/**
 * Create intent variants (placeholder, colors handled by compound variants)
 */
function createIntentVariants(theme: Theme) {
    const variants: any = {};
    for (const intent in theme.intents) {
        variants[intent] = {};
    }
    return variants;
}

/**
 * Create type variants (structure only, colors handled by compound variants)
 */
function createTypeVariants(theme: Theme) {
    return {
        contained: {
            borderWidth: 0,
        },
        outlined: {
            borderWidth: 1,
            borderStyle: 'solid' ,
            backgroundColor: theme.colors.surface.primary,
        },
        text: {
            borderWidth: 0,
            backgroundColor: 'transparent',
        },
    } as const;
}

/**
 * Create compound variants for intent+type combinations
 */
function createButtonCompoundVariants(theme: Theme): CompoundVariants<keyof ButtonVariants> {
    const compoundVariants: CompoundVariants<keyof ButtonVariants> = [];

    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent];

        // Contained + intent
        compoundVariants.push({
            intent,
            type: 'contained',
            styles: {
                backgroundColor: intentValue.primary,
                color: intentValue.contrast,
            },
        });

        // Outlined + intent
        compoundVariants.push({
            intent,
            type: 'outlined',
            styles: {
                color: intentValue.primary,
                borderColor: intentValue.primary,
            },
        });

        // Text + intent
        compoundVariants.push({
            intent,
            type: 'text',
            styles: {
                color: intentValue.primary,
            },
        });
    };

    return compoundVariants;
}

/**
 * Create gradient variant styles for web
 * Applies a transparent overlay gradient over the intent background color
 */
function createGradientVariants() {
    return {
        'darken': {
            _web: {
                backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.15) 100%)',
            },
        },
        'lighten': {
            _web: {
                backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%)',
            },
        },
    } as const;
}

/**
 * Create icon compound variants for intent+type combinations
 */
function createIconCompoundVariants(theme: Theme): CompoundVariants<keyof ButtonVariants> {
    const compoundVariants: CompoundVariants<keyof ButtonVariants> = [];

    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        // Contained + intent
        compoundVariants.push({
            intent,
            type: 'contained',
            styles: { color: intentValue.contrast },
        });

        // Outlined + intent
        compoundVariants.push({
            intent,
            type: 'outlined',
            styles: { color: intentValue.primary },
        });

        // Text + intent
        compoundVariants.push({
            intent,
            type: 'text',
            styles: { color: intentValue.primary },
        });
    }

    return compoundVariants;
}

/**
 * Create icon color variants dynamically based on theme, intent, and type
 */
function createIconColorVariants(theme: Theme, intent: Intent) {
    const intentValue = theme.intents[intent];

    return {
        contained: {
            color: intentValue.contrast,
        },
        outlined: {
            color: intentValue.primary,
        },
        text: {
            color: intentValue.primary,
        },
    } as const;
}

/**
 * Generate button icon styles
 */
const createButtonIconStyles = (theme: Theme) => {
    return ({ intent }: Partial<ButtonVariants>) => {
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    width: size.iconSize,
                    height: size.iconSize,
                })),
                type: createIconColorVariants(theme, intent),
            },
        } as const;
    };
}

/**
 * Generate button text styles
 */
const createButtonTextStyles = (theme: Theme) => {
    return ({ intent }: Partial<ButtonVariants>) => {
        return {
            fontWeight: '600',
            textAlign: 'center',
            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    fontSize: size.fontSize,
                })),
                type: createIconColorVariants(theme, intent), // Text uses same colors as icons
                disabled: {
                    true: { opacity: 0.6 },
                    false: { opacity: 1 },
                },
            },
        } as const;
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const buttonStyles = StyleSheet.create((theme: Theme) => {
    return {
        button: {
            boxSizing: 'border-box',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            fontWeight: '600',
            textAlign: 'center',
            _web: {
                display: 'flex',
                transition: 'all 0.1s ease',
            },
            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    paddingVertical: size.paddingVertical,
                    paddingHorizontal: size.paddingHorizontal,
                    minHeight: size.minHeight,
                })),
                type: createTypeVariants(theme),
                disabled: {
                    true: { opacity: 0.6 },
                    false: { opacity: 1, _web: {
                        cursor: 'pointer',
                        _hover: {
                            opacity: 0.90,
                        },
                        _active: {
                            opacity: 0.75,
                        },
                    } },
                } as const,
                gradient: createGradientVariants(),
            } as const,
            compoundVariants: createButtonCompoundVariants(theme),
        } as const,
        icon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    width: size.iconSize,
                    height: size.iconSize,
                })),
                intent: createIntentVariants(theme),
                type: createTypeVariants(theme),
            } as const,
            compoundVariants: createIconCompoundVariants(theme),
        } as const,
        iconContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
        } as const,
        text: {
            fontWeight: '600',
            textAlign: 'center',
            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    fontSize: size.fontSize,
                })),
                intent: createIntentVariants(theme),
                type: createTypeVariants(theme),
                disabled: {
                    true: { opacity: 0.6 },
                    false: { opacity: 1 },
                },
            },
            compoundVariants: createIconCompoundVariants(theme), // Text uses same colors as icons
        } as const,
    };
});