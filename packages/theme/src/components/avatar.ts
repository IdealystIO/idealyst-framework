import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type AvatarSize = Size;
type AvatarShape = 'circle' | 'square';

type AvatarVariants = {
    size: AvatarSize;
    shape: AvatarShape;
}

export type ExpandedAvatarStyles = StylesheetStyles<keyof AvatarVariants>;

export type AvatarStylesheet = {
    avatar: ExpandedAvatarStyles;
    image: ExpandedAvatarStyles;
    fallback: ExpandedAvatarStyles;
}

/**
 * Create size variants for avatar
 */
function createAvatarSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'avatar', (size) => ({
        width: size.width,
        height: size.height,
    }));
}

/**
 * Create shape variants for avatar
 */
function createAvatarShapeVariants(theme: Theme) {
    return {
        circle: {
            borderRadius: 9999,
        },
        square: {
            borderRadius: 8,
        },
    };
}

/**
 * Create size variants for fallback text
 */
function createFallbackSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'avatar', (size) => ({
        fontSize: size.fontSize,
    }));
}

/**
 * Generate avatar container styles
 */
const createAvatarStyles = (theme: Theme, expanded: Partial<ExpandedAvatarStyles>): ExpandedAvatarStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface.secondary,
        overflow: 'hidden',
        variants: {
            size: createAvatarSizeVariants(theme),
            shape: createAvatarShapeVariants(theme),
        },
    }, expanded);
}

/**
 * Generate avatar image styles
 */
const createImageStyles = (theme: Theme, expanded: Partial<ExpandedAvatarStyles>): ExpandedAvatarStyles => {
    return deepMerge({
        width: '100%',
        height: '100%',
    }, expanded);
}

/**
 * Generate avatar fallback text styles
 */
const createFallbackStyles = (theme: Theme, expanded: Partial<ExpandedAvatarStyles>): ExpandedAvatarStyles => {
    return deepMerge({
        color: theme.colors.text.primary,
        fontWeight: '600',
        variants: {
            size: createFallbackSizeVariants(theme),
        },
    }, expanded);
}

/**
 * Generate avatar stylesheet
 */
export const createAvatarStylesheet = (theme: Theme, expanded?: Partial<AvatarStylesheet>): AvatarStylesheet => {
    return {
        avatar: createAvatarStyles(theme, expanded?.avatar || {}),
        image: createImageStyles(theme, expanded?.image || {}),
        fallback: createFallbackStyles(theme, expanded?.fallback || {}),
    };
}
