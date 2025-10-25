import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { TextAreaIntentVariant } from './types';


/**
 * Create size variants for textarea
 */
function createTextareaSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'textarea', (size) => ({
        fontSize: size.fontSize,
        padding: size.padding,
        lineHeight: size.lineHeight,
        minHeight: size.minHeight,
    }));
}

/**
 * Get textarea styles based on intent, disabled, and hasError state
 */
function getTextareaIntentStyles(theme: Theme, intent: TextAreaIntentVariant, disabled: boolean, hasError: boolean) {
    if (disabled || hasError) {
        return {} as const;
    }

    const intentValue = theme.intents[intent];
    const baseStyles: any = {};

    // For success and warning, set border color
    if (intent === 'success' || intent === 'warning') {
        baseStyles.borderColor = intentValue.primary;
    }

    // Focus styles for all intents when not disabled and not in error
    baseStyles._web = {
        _focus: {
            borderColor: intentValue.primary,
            boxShadow: `0 0 0 2px ${intentValue.primary}33`,
        },
    };

    return baseStyles;
}

const createTextareaStyles = (theme: Theme) => {
    return ({ intent, disabled, hasError }: { intent: TextAreaIntentVariant, disabled: boolean, hasError: boolean }) => {
        const intentStyles = getTextareaIntentStyles(theme, intent, disabled, hasError);

        return {
            width: '100%',
            color: theme.colors.text.primary,
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            lineHeight: 'normal',
            ...intentStyles,
            variants: {
                size: createTextareaSizeVariants(theme),
                disabled: {
                    true: {
                        opacity: 0.5,
                        backgroundColor: theme.colors.surface.secondary,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {},
                },
                hasError: {
                    true: {
                        borderColor: theme.intents.error.primary,
                    },
                    false: {},
                },
                resize: {
                    none: {
                        _web: {
                            resize: 'none',
                        },
                    },
                    vertical: {
                        _web: {
                            resize: 'vertical',
                        },
                    },
                    horizontal: {
                        _web: {
                            resize: 'horizontal',
                        },
                    },
                    both: {
                        _web: {
                            resize: 'both',
                        },
                    },
                },
            },
            _web: {
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
                overflowY: 'hidden',
            },
        } as const;
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
export const textAreaStyles = StyleSheet.create((theme: Theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        },
        label: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text.primary,
            variants: {
                disabled: {
                    true: {
                        opacity: 0.5,
                    },
                    false: {},
                },
            },
        },
        textareaContainer: {
            position: 'relative',
        },
        textarea: createTextareaStyles(theme),
        helperText: {
            fontSize: 12,
            color: theme.colors.text.secondary,
            variants: {
                hasError: {
                    true: {
                        color: theme.intents.error.primary,
                    },
                    false: {},
                },
            },
        },
        footer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 4,
        },
        characterCount: {
            fontSize: 12,
            color: theme.colors.text.secondary,
            variants: {
                isNearLimit: {
                    true: {
                        color: theme.intents.warning.primary,
                    },
                    false: {},
                },
                isAtLimit: {
                    true: {
                        color: theme.intents.error.primary,
                    },
                    false: {},
                },
            },
        },
    };
});
