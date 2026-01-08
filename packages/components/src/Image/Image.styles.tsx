/**
 * Image styles using defineStyle.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type ImageDynamicProps = {};

/**
 * Image styles - simple container and image styles.
 */
export const imageStyles = defineStyle('Image', (theme: Theme) => ({
    container: (_props: ImageDynamicProps) => ({
        position: 'relative' as const,
        overflow: 'hidden' as const,
        backgroundColor: theme.colors['gray.200'],
    }),

    image: (_props: ImageDynamicProps) => ({
        width: '100%' as const,
        height: '100%' as const,
    }),

    placeholder: (_props: ImageDynamicProps) => ({
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: theme.colors['gray.200'],
    }),

    fallback: (_props: ImageDynamicProps) => ({
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

    loadingIndicator: (_props: ImageDynamicProps) => ({
        color: theme.colors['gray.600'],
    }),
}));
