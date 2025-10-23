import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';

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
    };
}

function createSkeletonStyles(theme: Theme, expanded: Partial<ExpandedSkeletonStyles>): ExpandedSkeletonStyles {
    return deepMerge({
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
    }, expanded);
}

function createGroupStyles(theme: Theme, expanded: Partial<ExpandedSkeletonGroupStyles>): ExpandedSkeletonGroupStyles {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
    }, expanded);
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const skeletonStyles: ReturnType<typeof createSkeletonStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    skeleton: createSkeletonStyles(theme, {}),
    group: createGroupStyles(theme, {}),
  };
});

function createSkeletonStylesheet(theme: Theme, expanded?: Partial<SkeletonStylesheet>): SkeletonStylesheet {
    return {
        skeleton: createSkeletonStyles(theme, expanded?.skeleton || {}),
        group: createGroupStyles(theme, expanded?.group || {}),
    };
}
