/**
 * Video styles using defineStyle.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type VideoDynamicProps = {};

/**
 * Video styles - container, video element, and fallback.
 */
export const videoStyles = defineStyle('Video', (theme: Theme) => ({
    container: (_props: VideoDynamicProps) => ({
        position: 'relative' as const,
        overflow: 'hidden' as const,
        backgroundColor: theme.colors['black'],
    }),

    video: (_props: VideoDynamicProps) => ({
        width: '100%' as const,
        height: '100%' as const,
    }),

    fallback: (_props: VideoDynamicProps) => ({
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: theme.colors['gray.300'],
        color: theme.colors['gray.600'],
    }),
}));
