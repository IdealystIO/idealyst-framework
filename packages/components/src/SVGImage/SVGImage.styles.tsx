/**
 * SVGImage styles using defineStyle with dynamic intent handling.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type SVGImageDynamicProps = {
    intent?: Intent;
};

/**
 * SVGImage styles with intent-based coloring.
 * Uses CSS filters on web and tintColor on native.
 *
 * Note: CSS filters are hardcoded per-intent because they can't be
 * dynamically computed from color values.
 */
export const svgImageStyles = defineStyle('SVGImage', (theme: Theme) => ({
    container: (_props: SVGImageDynamicProps) => ({
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            intent: {
                primary: {
                    tintColor: theme.intents.primary.primary,
                    _web: {
                        filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)',
                    },
                },
                success: {
                    tintColor: theme.intents.success.primary,
                    _web: {
                        filter: 'brightness(0) saturate(100%) invert(64%) sepia(88%) saturate(3323%) hue-rotate(84deg) brightness(119%) contrast(119%)',
                    },
                },
                danger: {
                    tintColor: theme.intents.danger.primary,
                    _web: {
                        filter: 'brightness(0) saturate(100%) invert(23%) sepia(89%) saturate(7395%) hue-rotate(4deg) brightness(102%) contrast(118%)',
                    },
                },
                warning: {
                    tintColor: theme.intents.warning.primary,
                    _web: {
                        filter: 'brightness(0) saturate(100%) invert(54%) sepia(98%) saturate(4341%) hue-rotate(21deg) brightness(101%) contrast(101%)',
                    },
                },
                neutral: {
                    tintColor: theme.intents.neutral.primary,
                    _web: {
                        filter: 'brightness(0) saturate(100%) invert(52%) sepia(23%) saturate(3207%) hue-rotate(314deg) brightness(99%) contrast(96%)',
                    },
                },
                info: {
                    tintColor: theme.intents.info.primary,
                    _web: {
                        filter: 'brightness(0) saturate(100%) invert(58%) sepia(96%) saturate(2582%) hue-rotate(165deg) brightness(99%) contrast(91%)',
                    },
                },
            },
        },
        _web: {
            userSelect: 'none',
        },
    }),

    image: (_props: SVGImageDynamicProps) => ({
        _web: {
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
        },
    }),
}));
