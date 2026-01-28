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

type TextAreaType = 'outlined' | 'filled' | 'bare';

export type TextAreaVariants = {
    size: Size;
    intent: Intent;
    type: TextAreaType;
    focused: boolean;
    disabled: boolean;
    hasError: boolean;
    autoGrow: boolean;
    isNearLimit: boolean;
    isAtLimit: boolean;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

// Create intent variants dynamically from theme
function _createIntentVariants(theme: Theme) {
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
    container: (_props: TextAreaVariants) => ({
        display: 'flex' as const,
        flexDirection: 'column' as const,
        gap: 4,
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
    }),

    label: (_props: TextAreaVariants) => ({
        fontSize: 14,
        fontWeight: '500' as const,
        color: theme.colors.text.primary,
        variants: {
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
    }),

    textareaContainer: (_props: TextAreaVariants) => ({
        position: 'relative' as const,
        width: '100%',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: theme.colors.border.primary,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surface.primary,
        overflow: 'hidden' as const,
        variants: {
            type: {
                outlined: {
                    backgroundColor: theme.colors.surface.primary,
                    borderColor: theme.colors.border.primary,
                },
                filled: {
                    backgroundColor: theme.colors.surface.secondary,
                    borderColor: 'transparent',
                },
                bare: {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    borderColor: 'transparent',
                },
            },
            focused: {
                true: {
                    borderColor: theme.intents.primary.primary,
                },
                false: {},
            },
            disabled: {
                true: { opacity: 0.8, _web: { cursor: 'not-allowed' } },
                false: { opacity: 1 },
            },
            hasError: {
                true: { borderColor: theme.intents.danger.primary },
                false: {},
            },
        },
        _web: {
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        },
    }),

    textarea: (_props: TextAreaVariants) => ({
        width: '100%',
        color: theme.colors.text.primary,
        backgroundColor: 'transparent',
        borderWidth: 0,
        variants: {
            size: {
                fontSize: theme.sizes.$textarea.fontSize,
                padding: theme.sizes.$textarea.padding,
                lineHeight: 'auto',
            },
            autoGrow: {
                true: {
                    // Use input height as minHeight when autoGrow is enabled
                    minHeight: theme.sizes.$input.height,
                },
                false: {
                    // No minHeight - let rows attribute control height
                },
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
            display: 'block',
            width: '100%',
            fontFamily: 'inherit',
            outline: 'none',
            border: 'none',
            borderWidth: 0,
            background: 'transparent',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxSizing: 'border-box',
            resize: 'none',
        },
    }),

    helperText: (_props: TextAreaVariants) => ({
        fontSize: 12,
        variants: {
            hasError: {
                true: { color: theme.intents.danger.primary },
                false: { color: theme.colors.text.secondary },
            },
        },
    }),

    footer: (_props: TextAreaVariants) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        gap: 4,
    }),

    characterCount: (_props: TextAreaVariants) => ({
        fontSize: 12,
        color: theme.colors.text.secondary,
        variants: {
            isAtLimit: {
                true: { color: theme.intents.danger.primary },
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
    }),
}));
