/**
 * RadioButton styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type RadioGroupOrientation = 'horizontal' | 'vertical';

export type RadioButtonDynamicProps = {
    size?: Size;
    intent?: Intent;
    checked?: boolean;
    disabled?: boolean;
    orientation?: RadioGroupOrientation;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * RadioButton styles with intent/checked/disabled handling.
 */
export const radioButtonStyles = defineStyle('RadioButton', (theme: Theme) => ({
    container: (_props: RadioButtonDynamicProps) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        paddingVertical: 4,
        variants: {
            size: {
                gap: theme.sizes.$radioButton.gap,
            },
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

    radio: (_props: RadioButtonDynamicProps) => ({
        borderRadius: 9999,
        borderWidth: 1.5,
        borderStyle: 'solid' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            size: {
                width: theme.sizes.$radioButton.radioSize,
                height: theme.sizes.$radioButton.radioSize,
            },
            checked: {
                true: {
                    borderColor: theme.$intents.primary,
                },
                false: {
                    borderColor: theme.colors.border.primary,
                },
            },
            disabled: {
                true: {
                    backgroundColor: theme.colors.surface.tertiary,
                    opacity: 0.5,
                },
                false: {
                    backgroundColor: theme.colors.surface.primary,
                    opacity: 1,
                },
            },
        },
        _web: {
            transition: 'all 0.2s ease',
        },
    }),

    radioDot: (_props: RadioButtonDynamicProps) => ({
        borderRadius: 9999,
        variants: {
            size: {
                width: theme.sizes.$radioButton.radioDotSize,
                height: theme.sizes.$radioButton.radioDotSize,
            },
            intent: {
                backgroundColor: theme.$intents.primary,
            },
        },
    }),

    label: (_props: RadioButtonDynamicProps) => ({
        color: theme.colors.text.primary,
        variants: {
            size: {
                fontSize: theme.sizes.$radioButton.fontSize,
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
    }),

    groupContainer: (_props: RadioButtonDynamicProps) => ({
        gap: 4,
        variants: {
            orientation: {
                horizontal: {
                    flexDirection: 'row' as const,
                    flexWrap: 'wrap' as const,
                    gap: 16,
                },
                vertical: {
                    flexDirection: 'column' as const,
                },
            },
        },
    }),

    groupWrapper: (_props: RadioButtonDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'column' as const,
        gap: 4,
    }),

    groupLabel: (_props: RadioButtonDynamicProps) => ({
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

    groupHelperText: (_props: RadioButtonDynamicProps) => ({
        fontSize: 12,
        variants: {
            hasError: {
                true: { color: theme.intents.danger.primary },
                false: { color: theme.colors.text.secondary },
            },
        },
    }),
}));
