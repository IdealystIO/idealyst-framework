import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type AvatarSize = 'sm' | 'md' | 'lg' | 'xlarge';
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
function createAvatarSizeVariants() {
    return {
        sm: {
            width: 32,
            height: 32,
        },
        md: {
            width: 40,
            height: 40,
        },
        lg: {
            width: 48,
            height: 48,
        },
        xlarge: {
            width: 64,
            height: 64,
        },
    };
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
            borderRadius: theme.borderRadius?.md || 8,
        },
    };
}

/**
 * Create size variants for fallback text
 */
function createFallbackSizeVariants() {
    return {
        sm: {
            fontSize: 14,
        },
        md: {
            fontSize: 16,
        },
        lg: {
            fontSize: 18,
        },
        xlarge: {
            fontSize: 24,
        },
    };
}

/**
 * Generate avatar container styles
 */
const createAvatarStyles = (theme: Theme, expanded: Partial<ExpandedAvatarStyles>): ExpandedAvatarStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
        overflow: 'hidden',
        variants: {
            size: createAvatarSizeVariants(),
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
        color: theme.colors?.text?.primary || '#000000',
        fontWeight: '600',
        variants: {
            size: createFallbackSizeVariants(),
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
