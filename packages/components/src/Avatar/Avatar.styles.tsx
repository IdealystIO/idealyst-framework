import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

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

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const avatarStyles = StyleSheet.create((theme: Theme) => {
  return {
    avatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface.secondary,
        overflow: 'hidden',
        variants: {
            size: createAvatarSizeVariants(theme),
            shape: createAvatarShapeVariants(theme),
        },
    },
    image: {
        width: '100%',
        height: '100%',
    },
    fallback: {
        color: theme.colors.text.primary,
        fontWeight: '600',
        variants: {
            size: createFallbackSizeVariants(theme),
        },
    },
  };
});