/**
 * Slider styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type SliderDynamicProps = {
    size?: Size;
    intent?: Intent;
    disabled?: boolean;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * Slider styles with intent/disabled handling.
 */
export const sliderStyles = defineStyle('Slider', (theme: Theme) => ({
    container: (_props: SliderDynamicProps) => ({
        gap: 4,
        paddingVertical: 8,
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

    sliderWrapper: (_props: SliderDynamicProps) => ({
        position: 'relative' as const,
        paddingVertical: 4,
    }),

    track: ({ disabled = false }: SliderDynamicProps) => ({
        backgroundColor: theme.colors.surface.tertiary,
        borderRadius: 9999,
        position: 'relative' as const,
        opacity: disabled ? 0.5 : 1,
        variants: {
            size: {
                height: theme.sizes.$slider.trackHeight,
            },
        },
        _web: {
            cursor: disabled ? 'not-allowed' : 'pointer',
        },
    }),

    filledTrack: ({ intent = 'primary' }: SliderDynamicProps) => ({
        position: 'absolute' as const,
        height: '100%',
        borderRadius: 9999,
        top: 0,
        left: 0,
        backgroundColor: theme.intents[intent].primary,
    }),

    thumb: ({ intent = 'primary', disabled = false }: SliderDynamicProps) => ({
        position: 'absolute' as const,
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 9999,
        borderWidth: 2,
        borderStyle: 'solid' as const,
        borderColor: theme.intents[intent].primary,
        top: '50%',
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        opacity: disabled ? 0.6 : 1,
        variants: {
            size: {
                width: theme.sizes.$slider.thumbSize,
                height: theme.sizes.$slider.thumbSize,
            },
        },
        _web: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.15s ease, box-shadow 0.2s ease',
            cursor: disabled ? 'not-allowed' : 'grab',
            _hover: disabled ? {} : { transform: 'translate(-50%, -50%) scale(1.05)' },
            _active: disabled ? {} : { cursor: 'grabbing', transform: 'translate(-50%, -50%) scale(1.1)' },
        },
    }),

    thumbActive: (_props: SliderDynamicProps) => ({
        _web: {
            transform: 'translate(-50%, -50%) scale(1.1)',
        },
    }),

    thumbIcon: ({ intent = 'primary' }: SliderDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        color: theme.intents[intent].primary,
        variants: {
            size: {
                width: theme.sizes.$slider.thumbIconSize,
                height: theme.sizes.$slider.thumbIconSize,
                minWidth: theme.sizes.$slider.thumbIconSize,
                maxWidth: theme.sizes.$slider.thumbIconSize,
                minHeight: theme.sizes.$slider.thumbIconSize,
                maxHeight: theme.sizes.$slider.thumbIconSize,
            },
        },
    }),

    valueLabel: (_props: SliderDynamicProps) => ({
        fontSize: 12,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        textAlign: 'center' as const,
    }),

    minMaxLabels: (_props: SliderDynamicProps) => ({
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        marginTop: 4,
    }),

    minMaxLabel: (_props: SliderDynamicProps) => ({
        fontSize: 12,
        color: theme.colors.text.secondary,
    }),

    marks: (_props: SliderDynamicProps) => ({
        position: 'absolute' as const,
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    }),

    mark: (_props: SliderDynamicProps) => ({
        position: 'absolute' as const,
        width: 2,
        backgroundColor: theme.colors.border.secondary,
        top: '50%',
        variants: {
            size: {
                height: theme.sizes.$slider.markHeight,
            },
        },
        _web: {
            transform: 'translate(-50%, -50%)',
        },
    }),

    markLabel: (_props: SliderDynamicProps) => ({
        position: 'absolute' as const,
        fontSize: 10,
        color: theme.colors.text.secondary,
        top: '100%',
        marginTop: 4,
        _web: {
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
        },
    }),
}));
