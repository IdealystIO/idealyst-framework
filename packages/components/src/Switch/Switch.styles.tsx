/**
 * Switch styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type LabelPosition = 'left' | 'right';

export type SwitchDynamicProps = {
    size?: Size;
    intent?: Intent;
    checked?: boolean;
    disabled?: boolean;
    labelPosition?: LabelPosition;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * Switch styles with intent/checked/disabled handling.
 */
export const switchStyles = defineStyle('Switch', (theme: Theme) => ({
    container: (_props: SwitchDynamicProps) => ({
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
    }),

    switchContainer: (_props: SwitchDynamicProps) => ({
        justifyContent: 'center' as const,
        variants: {
            disabled: {
                true: { _web: { cursor: 'not-allowed' } },
                false: { _web: { cursor: 'pointer' } },
            },
        },
        _web: {
            border: 'none',
            padding: 0,
            backgroundColor: 'transparent',
            width: 'fit-content',
        },
    }),

    switchTrack: (_props: SwitchDynamicProps) => ({
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
    }),

    switchThumb: ({ size = 'md', checked = false }: SwitchDynamicProps) => {
        // translateX needs runtime calculation based on size
        const sizeValue = theme.sizes.switch[size] ?? theme.sizes.switch.md;
        const translateX = checked ? sizeValue.translateX : 0;

        return {
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
            },
            _web: {
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease',
                transform: `translateY(-50%) translateX(${translateX}px)`,
            },
        } as const;
    },

    thumbIcon: (_props: SwitchDynamicProps) => ({
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
    }),

    label: (_props: SwitchDynamicProps) => ({
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
    }),
}));
