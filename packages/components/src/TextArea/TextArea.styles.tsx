/**
 * TextArea styles using static styles with variants.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper, CompoundVariants } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type TextAreaVariants = {
    size: Size;
    intent: Intent;
    disabled: boolean;
    hasError: boolean;
    isNearLimit: boolean;
    isAtLimit: boolean;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

// Create intent variants dynamically from theme
function createIntentVariants(theme: Theme) {
    const variants: Record<string, object> = {};
    for (const intent in theme.intents) {
        variants[intent] = {};
    }
    return variants;
}

/**
 * TextArea styles with static styles and variants.
 */
export const textAreaStyles = defineStyle('TextArea', (theme: Theme) => ({
    container: {
        display: 'flex' as const,
        flexDirection: 'column' as const,
        gap: 4,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        borderRadius: theme.radii.md,
        variants: {
            margin: {
                margin: theme.sizes.$view.padding,
            },
            marginVertical: {
                marginVertical: theme.sizes.$view.padding,
            },
            marginHorizontal: {
                marginHorizontal: theme.sizes.$view.padding,
            },
        },
    },

    label: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: theme.colors.text.primary,
        variants: {
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
    },

    textareaContainer: {
        position: 'relative' as const,
        variants: {
            disabled: {
                true: { opacity: 0.8 },
                false: { opacity: 1 },
            },
        },
    },

    textarea: {
        width: '100%',
        color: theme.colors.text.primary,
        variants: {
            size: {
                fontSize: theme.sizes.$textarea.fontSize,
                padding: theme.sizes.$textarea.padding,
                lineHeight: theme.sizes.$textarea.lineHeight,
                minHeight: theme.sizes.$textarea.minHeight,
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {
                    opacity: 1,
                    _web: {
                        cursor: 'text',
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
    },

    helperText: {
        fontSize: 12,
        variants: {
            hasError: {
                true: { color: theme.intents.error.primary },
                false: { color: theme.colors.text.secondary },
            },
        },
    },

    footer: {
        display: 'flex' as const,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        gap: 4,
    },

    characterCount: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        variants: {
            isAtLimit: {
                true: { color: theme.intents.error.primary },
                false: {},
            },
            isNearLimit: {
                true: {},
                false: {},
            },
        },
        compoundVariants: [
            {
                isNearLimit: true,
                isAtLimit: false,
                styles: {
                    color: theme.intents.warning.primary,
                },
            },
        ] as CompoundVariants<keyof TextAreaVariants>,
    },
}));
