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

    radio: ({ intent = 'primary', checked = false, disabled = false }: RadioButtonDynamicProps) => {
        const intentValue = theme.intents[intent];

        return {
            borderRadius: 9999,
            borderWidth: 1.5,
            borderStyle: 'solid' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: disabled
                ? theme.colors.surface.tertiary
                : theme.colors.surface.primary,
            borderColor: checked ? intentValue.primary : theme.colors.border.primary,
            opacity: disabled ? 0.5 : 1,
            variants: {
                size: {
                    width: theme.sizes.$radioButton.radioSize,
                    height: theme.sizes.$radioButton.radioSize,
                },
            },
            _web: {
                transition: 'all 0.2s ease',
                cursor: disabled ? 'not-allowed' : 'pointer',
                _hover: disabled ? {} : { opacity: 0.8 },
                _active: disabled ? {} : { opacity: 0.6 },
            },
        } as const;
    },

    radioDot: ({ intent = 'primary' }: RadioButtonDynamicProps) => ({
        borderRadius: 9999,
        backgroundColor: theme.intents[intent].primary,
        variants: {
            size: {
                width: theme.sizes.$radioButton.radioDotSize,
                height: theme.sizes.$radioButton.radioDotSize,
            },
        },
    }),

    label: ({ disabled = false }: RadioButtonDynamicProps) => ({
        color: theme.colors.text.primary,
        opacity: disabled ? 0.5 : 1,
        variants: {
            size: {
                fontSize: theme.sizes.$radioButton.fontSize,
            },
        },
    }),

    groupContainer: ({ orientation = 'vertical' }: RadioButtonDynamicProps) => ({
        gap: 4,
        flexDirection: orientation === 'horizontal' ? ('row' as const) : ('column' as const),
        flexWrap: orientation === 'horizontal' ? ('wrap' as const) : undefined,
        ...(orientation === 'horizontal' ? { gap: 16 } : {}),
    }),
}));
