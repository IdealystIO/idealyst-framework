/**
 * Input styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type InputType = 'outlined' | 'filled' | 'bare';

export type InputDynamicProps = {
    type?: InputType;
    focused?: boolean;
    hasError?: boolean;
    disabled?: boolean;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * Input styles with type/state handling.
 */
export const inputStyles = defineStyle('Input', (theme: Theme) => ({
    container: ({ type = 'outlined', focused = false, hasError = false, disabled = false }: InputDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        width: '100%',
        minWidth: 0,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: theme.colors.border.primary,
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
                false: {
                    
                },
            },
            disabled: {
                true: { opacity: 0.8, _web: { cursor: 'not-allowed' } },
                false: { opacity: 1 }
            },
            hasError: {
                true: { borderColor: theme.intents.error.primary },
                false: { borderColor: theme.colors.border.primary },
            },
            // $iterator expands for each input size
            size: {
                height: theme.sizes.$input.height,
                paddingHorizontal: theme.sizes.$input.paddingHorizontal,
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
        _web: {
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }
    }),

    input: (_props: InputDynamicProps) => ({
        flex: 1,
        minWidth: 0,
        backgroundColor: 'transparent' as const,
        color: theme.colors.text.primary,
        fontWeight: '400' as const,
        variants: {
            size: {
                fontSize: theme.sizes.$input.fontSize,
            },
        },
        _web: {
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
        },
    }),

    leftIconContainer: (_props: InputDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        variants: {
            size: {
                marginRight: theme.sizes.$input.iconMargin,
            },
        },
    }),

    rightIconContainer: (_props: InputDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        variants: {
            size: {
                marginLeft: theme.sizes.$input.iconMargin,
            },
        },
    }),

    leftIcon: (_props: InputDynamicProps) => ({
        color: theme.colors.text.secondary,
        variants: {
            size: {
                fontSize: theme.sizes.$input.iconSize,
                width: theme.sizes.$input.iconSize,
                height: theme.sizes.$input.iconSize,
            },
        },
    }),

    rightIcon: (_props: InputDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        color: theme.colors.text.secondary,
        variants: {
            size: {
                fontSize: theme.sizes.$input.iconSize,
                width: theme.sizes.$input.iconSize,
                height: theme.sizes.$input.iconSize,
            },
        },
    }),

    passwordToggle: (_props: InputDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        padding: 0,
        variants: {
            size: {
                marginLeft: theme.sizes.$input.iconMargin,
            },
        },
        _web: {
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            _hover: { opacity: 0.7 },
            _active: { opacity: 0.5 },
        },
    }),

    passwordToggleIcon: (_props: InputDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        color: theme.colors.text.secondary,
        variants: {
            size: {
                fontSize: theme.sizes.$input.iconSize,
                width: theme.sizes.$input.iconSize,
                height: theme.sizes.$input.iconSize,
            },
        },
    }),
}));
