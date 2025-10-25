import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';

type SkeletonShape = 'rectangle' | 'rounded' | 'circle';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

type SkeletonVariants = {
    shape: SkeletonShape;
    animation: SkeletonAnimation;
}

export type ExpandedSkeletonStyles = StylesheetStyles<keyof SkeletonVariants>;
export type ExpandedSkeletonGroupStyles = StylesheetStyles<never>;

export type SkeletonStylesheet = {
    skeleton: ExpandedSkeletonStyles;
    group: ExpandedSkeletonGroupStyles;
}

/**
 * Create shape variants for skeleton
 */
function createShapeVariants(theme: Theme) {
    return {
        rectangle: {
            borderRadius: 0,
        },
        rounded: {
            borderRadius: 8,
        },
        circle: {
            borderRadius: 9999,
        },
    } as const;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const skeletonStyles = StyleSheet.create((theme: Theme) => {
  return {
    skeleton: {
        backgroundColor: theme.colors.surface.tertiary,
        overflow: 'hidden',
        variants: {
            shape: createShapeVariants(theme),
            animation: {
                pulse: {},
                wave: {},
                none: {},
            },
        },
    },
    group: {
        display: 'flex',
        flexDirection: 'column',
    },
  };
});