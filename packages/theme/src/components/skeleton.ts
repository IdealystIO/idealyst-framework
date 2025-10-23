import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

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
            borderRadius: 8, // TODO: Add borderRadius to theme
        },
        circle: {
            borderRadius: 9999, // TODO: Add borderRadius to theme
        },
    };
}

const createSkeletonStyles = (theme: Theme, expanded: Partial<ExpandedSkeletonStyles>): ExpandedSkeletonStyles => {
    return deepMerge({
        backgroundColor: theme.colors['gray.200'], // TODO: Add surface colors to theme
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

const createGroupStyles = (theme: Theme, expanded: Partial<ExpandedSkeletonGroupStyles>): ExpandedSkeletonGroupStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
    }, expanded);
}

export const createSkeletonStylesheet = (theme: Theme, expanded?: Partial<SkeletonStylesheet>): SkeletonStylesheet => {
    return {
        skeleton: createSkeletonStyles(theme, expanded?.skeleton || {}),
        group: createGroupStyles(theme, expanded?.group || {}),
    };
}
