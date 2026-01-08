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
    }),

    label: ({ disabled = false }: TextAreaDynamicProps) => ({
        fontSize: 14,
        fontWeight: '500' as const,
        color: theme.colors.text.primary,
    }),

    textareaContainer: (_props: TextAreaDynamicProps) => ({
        position: 'relative' as const,
        variants: {
            disabled: {
                true: {
                    opacity: 1,
                },
                false: {
                    opacity: 0.8,
                },
            },
        }
    }),

    textarea: ({ disabled = false, resize = 'none' }: TextAreaDynamicProps) => ({
            width: '100%',
            color: theme.colors.text.primary,
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
            },
    }),

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
