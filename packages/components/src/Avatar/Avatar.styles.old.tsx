import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Size } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { applyExtensions } from '../extensions/applyExtension';

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

function createAvatarSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'avatar', (size) => ({
        width: size.width,
        height: size.height,
    }));
}

function createAvatarShapeVariants(theme: Theme) {
    return {
        circle: {
            borderRadius: 9999,
        },
        square: {
            borderRadius: 8,
        },
    } as const;
}

function createFallbackSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'avatar', (size) => ({
        fontSize: size.fontSize,
    }));
}

/**
 * Create container styles
 */
function createContainerStyles(theme: Theme) {
    return () => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: theme.colors.surface.secondary,
        overflow: 'hidden' as const,
        variants: {
            size: createAvatarSizeVariants(theme),
            shape: createAvatarShapeVariants(theme),
        },
    });
}

/**
 * Create image styles
 */
function createImageStyles() {
    return () => ({
        width: '100%' as const,
        height: '100%' as const,
    });
}

/**
 * Create fallback styles
 */
function createFallbackStyles(theme: Theme) {
    return () => ({
        color: theme.colors.text.primary,
        fontWeight: '600' as const,
        variants: {
            size: createFallbackSizeVariants(theme),
        },
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const avatarStyles = StyleSheet.create((theme: Theme) => {
  // Apply extensions to main visual elements

  return applyExtensions('Avatar', theme, {avatar: createContainerStyles(theme),
    fallback: createFallbackStyles(theme),
        // Additional styles (merged from return)
        // Minor utility styles (not extended)
    image: {
        width: '100%',
        height: '100%',
    }});
});