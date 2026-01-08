/**
 * Skeleton styles using defineStyle.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type SkeletonShape = 'rectangle' | 'rounded' | 'circle';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export type SkeletonDynamicProps = {
    shape?: SkeletonShape;
    animation?: SkeletonAnimation;
};

/**
 * Skeleton styles with shape and animation variants.
 */
export const skeletonStyles = defineStyle('Skeleton', (theme: Theme) => ({
    skeleton: (_props: SkeletonDynamicProps) => ({
        backgroundColor: theme.colors.surface.tertiary,
        overflow: 'hidden' as const,
        variants: {
            shape: {
                rectangle: { borderRadius: 0 },
                rounded: { borderRadius: 8 },
                circle: { borderRadius: 9999 },
            },
            animation: {
                pulse: {},
                wave: {},
                none: {},
            },
        },
    }),

    group: (_props: {}) => ({
        display: 'flex' as const,
        flexDirection: 'column' as const,
    }),
}));
