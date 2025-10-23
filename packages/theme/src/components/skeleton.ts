import { StylesheetStyles } from "../styles";

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
 * NOTE: The skeleton stylesheet implementation has been moved to
 * @idealyst/components/src/Skeleton/Skeleton.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
