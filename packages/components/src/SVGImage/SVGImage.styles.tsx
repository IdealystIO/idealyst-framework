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
 */
export const svgImageStyles = defineStyle('SVGImage', (theme: Theme) => ({
    container: ({ intent }: SVGImageDynamicProps) => ({
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        // Native: use tintColor for intent
        ...(intent ? { tintColor: theme.intents[intent].primary } : {}),
        _web: {
            userSelect: 'none',
            // Web: use CSS filters for intent coloring
            ...(intent === 'primary' ? { filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' } : {}),
            ...(intent === 'success' ? { filter: 'brightness(0) saturate(100%) invert(64%) sepia(88%) saturate(3323%) hue-rotate(84deg) brightness(119%) contrast(119%)' } : {}),
            ...(intent === 'error' ? { filter: 'brightness(0) saturate(100%) invert(23%) sepia(89%) saturate(7395%) hue-rotate(4deg) brightness(102%) contrast(118%)' } : {}),
            ...(intent === 'warning' ? { filter: 'brightness(0) saturate(100%) invert(54%) sepia(98%) saturate(4341%) hue-rotate(21deg) brightness(101%) contrast(101%)' } : {}),
            ...(intent === 'neutral' ? { filter: 'brightness(0) saturate(100%) invert(52%) sepia(23%) saturate(3207%) hue-rotate(314deg) brightness(99%) contrast(96%)' } : {}),
            ...(intent === 'info' ? { filter: 'brightness(0) saturate(100%) invert(58%) sepia(96%) saturate(2582%) hue-rotate(165deg) brightness(99%) contrast(91%)' } : {}),
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
