/**
 * TextArea styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type ResizeMode = 'none' | 'vertical' | 'horizontal' | 'both';

export type TextAreaDynamicProps = {
    size?: Size;
    intent?: Intent;
    disabled?: boolean;
    hasError?: boolean;
    resize?: ResizeMode;
    isNearLimit?: boolean;
    isAtLimit?: boolean;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * TextArea styles with intent/disabled/error handling.
 */
export const textAreaStyles = defineStyle('TextArea', (theme: Theme) => ({
    container: (_props: TextAreaDynamicProps) => ({
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

    label: ({ disabled = false }: TextAreaDynamicProps) => ({
        fontSize: 14,
        fontWeight: '500' as const,
        color: theme.colors.text.primary,
        opacity: disabled ? 0.5 : 1,
    }),

    textareaContainer: (_props: TextAreaDynamicProps) => ({
        position: 'relative' as const,
    }),

    textarea: ({ intent = 'primary', disabled = false, hasError = false, resize = 'none' }: TextAreaDynamicProps) => {
        const intentValue = theme.intents[intent];
        const errorColor = theme.intents.error.primary;

        // Get border color based on state
        let borderColor = theme.colors.border.primary;
        if (hasError) {
            borderColor = errorColor;
        } else if (intent === 'success' || intent === 'warning') {
            borderColor = intentValue.primary;
        }

        // Get web-specific styles
        const webFocusStyles = hasError
            ? { borderColor: errorColor, boxShadow: `0 0 0 2px ${errorColor}33` }
            : { borderColor: intentValue.primary, boxShadow: `0 0 0 2px ${intentValue.primary}33` };

        return {
            width: '100%',
            color: theme.colors.text.primary,
            backgroundColor: disabled ? theme.colors.surface.secondary : theme.colors.surface.primary,
            borderWidth: 1,
            borderStyle: 'solid' as const,
            borderColor,
            borderRadius: 8,
            opacity: disabled ? 0.5 : 1,
            variants: {
                size: {
                    fontSize: theme.sizes.$textarea.fontSize,
                    padding: theme.sizes.$textarea.padding,
                    lineHeight: theme.sizes.$textarea.lineHeight,
                    minHeight: theme.sizes.$textarea.minHeight,
                },
            },
            _web: {
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
                overflowY: 'hidden',
                cursor: disabled ? 'not-allowed' : 'text',
                resize: resize,
                _focus: disabled ? {} : webFocusStyles,
            },
        } as const;
    },

    helperText: ({ hasError = false }: TextAreaDynamicProps) => ({
        fontSize: 12,
        color: hasError ? theme.intents.error.primary : theme.colors.text.secondary,
    }),

    footer: (_props: TextAreaDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        gap: 4,
    }),

    characterCount: ({ isNearLimit = false, isAtLimit = false }: TextAreaDynamicProps) => ({
        fontSize: 12,
        color: isAtLimit
            ? theme.intents.error.primary
            : isNearLimit
                ? theme.intents.warning.primary
                : theme.colors.text.secondary,
    }),
}));
