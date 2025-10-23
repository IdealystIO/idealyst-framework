import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type ButtonSize = Size;
type ButtonIntent = Intent;
type ButtonType = 'contained' | 'outlined' | 'text';

type ButtonVariants = {
    size: ButtonSize;
    intent: ButtonIntent;
    type: ButtonType;
    disabled: boolean;
}

export type ExpandedButtonStyles = StylesheetStyles<keyof ButtonVariants>;

export type ButtonStylesheet = {
    button: ExpandedButtonStyles;
    icon: ExpandedButtonStyles;
    iconContainer: ExpandedButtonStyles;
    text: ExpandedButtonStyles;
}

/**
 * Create button type variants dynamically based on theme and intent
 */
function createButtonTypeVariants(theme: Theme, intent: Intent) {
    const intentValue = theme.intents[intent];

    return {
        contained: {
            borderWidth: 0,
            backgroundColor: intentValue.primary,
            color: intentValue.contrast,
        },
        outlined: {
            borderWidth: 2,
            borderStyle: 'solid',
            backgroundColor: 'transparent',
            color: intentValue.primary,
            borderColor: intentValue.primary,
        },
        text: {
            borderWidth: 0,
            backgroundColor: 'transparent',
            color: intentValue.primary,
        },
    };
}

/**
 * Generate main button styles
 */
const createButtonStyles = (theme: Theme) => {
    return ({ intent }: ButtonVariants) => {
        return {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8, // TODO - replace with theme value or composition function
            fontWeight: '600',
            textAlign: 'center',
            transition: 'all 0.1s ease',

            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    paddingVertical: size.paddingVertical,
                    paddingHorizontal: size.paddingHorizontal,
                    minHeight: size.minHeight,
                })),
                type: createButtonTypeVariants(theme, intent),
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
                },
            },
        };
    }
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
    };
}

/**
 * Generate button icon styles
 */
const createButtonIconStyles = (theme: Theme) => {
    return ({ intent }: ButtonVariants) => {
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
        };
    }
}

/**
 * Generate button text styles
 */
const createButtonTextStyles = (theme: Theme) => {
    return ({ intent }: ButtonVariants) => {
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
        };
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const buttonStyles = StyleSheet.create((theme: Theme) => {
    return {
        button: createButtonStyles(theme),
        icon: createButtonIconStyles(theme),
        iconContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4, // TODO - replace with theme value or composition function
        },
        text: createButtonTextStyles(theme),
    };
});