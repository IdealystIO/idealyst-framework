/**
 * Switch styles using static defineStyle with variants.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

/**
 * Switch styles with intent/checked/disabled handling via static variants.
 */
export const switchStyles = defineStyle('Switch', (theme: Theme) => ({
    container: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 8,
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

    switchContainer: {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        variants: {
            disabled: {
                true: { _web: { cursor: 'not-allowed' } },
                false: { _web: { cursor: 'pointer' } },
            },
        },
        _web: {
            display: 'inline-flex',
            border: 'none',
            padding: 0,
            backgroundColor: 'transparent',
            width: 'fit-content',
            verticalAlign: 'middle',
        },
    },

    switchTrack: {
        borderRadius: 9999,
        position: 'relative' as const,
        pointerEvents: 'none' as const,
        variants: {
            size: {
                width: theme.sizes.$switch.trackWidth,
                height: theme.sizes.$switch.trackHeight,
            },
            checked: {
                false: {
                    backgroundColor: theme.colors.border.secondary,
                },
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
        compoundVariants: [
            {
                checked: true,
                styles: {
                    backgroundColor: theme.$intents.primary,
                },
            },
        ],
        _web: {
            transition: 'background-color 0.2s ease',
        },
    },

    switchThumb: {
        position: 'absolute' as const,
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 9999,
        top: '50%',
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
        variants: {
            size: {
                width: theme.sizes.$switch.thumbSize,
                height: theme.sizes.$switch.thumbSize,
                left: 2,
            },
            checked: {
                false: {
                    _web: {
                        transform: 'translateY(-50%) translateX(0px)',
                    },
                },
            },
        },
        compoundVariants: [
            {
                checked: true,
                size: 'xs',
                styles: {
                    _web: { transform: `translateY(-50%) translateX(${14}px)` },
                },
            },
            {
                checked: true,
                size: 'sm',
                styles: {
                    _web: { transform: `translateY(-50%) translateX(${16}px)` },
                },
            },
            {
                checked: true,
                size: 'md',
                styles: {
                    _web: { transform: `translateY(-50%) translateX(${20}px)` },
                },
            },
            {
                checked: true,
                size: 'lg',
                styles: {
                    _web: { transform: `translateY(-50%) translateX(${24}px)` },
                },
            },
            {
                checked: true,
                size: 'xl',
                styles: {
                    _web: { transform: `translateY(-50%) translateX(${28}px)` },
                },
            },
        ],
        _web: {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease',
        },
    },

    thumbIcon: {
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            size: {
                width: theme.sizes.$switch.thumbIconSize,
                height: theme.sizes.$switch.thumbIconSize,
            },
            checked: {
                false: {
                    color: theme.colors.border.secondary,
                },
            },
        },
        compoundVariants: [
            {
                checked: true,
                styles: {
                    color: theme.$intents.primary,
                },
            },
        ],
    },

    label: {
        fontSize: 14,
        color: theme.colors.text.primary,
        variants: {
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
            labelPosition: {
                left: { marginRight: 8, marginLeft: 0 },
                right: { marginLeft: 8, marginRight: 0 },
            },
        },
    },

    wrapper: {
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
    },

    helperText: {
        fontSize: 12,
        variants: {
            hasError: {
                true: { color: theme.intents.danger.primary },
                false: { color: theme.colors.text.secondary },
            },
        },
    },
}));
