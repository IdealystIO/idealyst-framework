import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Size} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';
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
    };
}

function createFallbackSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'avatar', (size) => ({
        fontSize: size.fontSize,
    }));
}

function createAvatarStyles(theme: Theme, expanded: Partial<ExpandedAvatarStyles>): ExpandedAvatarStyles {
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

function createImageStyles(theme: Theme, expanded: Partial<ExpandedAvatarStyles>): ExpandedAvatarStyles {
    return deepMerge({
        width: '100%',
        height: '100%',
    }, expanded);
}

function createFallbackStyles(theme: Theme, expanded: Partial<ExpandedAvatarStyles>): ExpandedAvatarStyles {
    return deepMerge({
        color: theme.colors.text.primary,
        fontWeight: '600',
        variants: {
            size: createFallbackSizeVariants(theme),
        },
    }, expanded);
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const avatarStyles: ReturnType<typeof createAvatarStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    avatar: createAvatarStyles(theme, {}),
    image: createImageStyles(theme, {}),
    fallback: createFallbackStyles(theme, {}),
  };
});

function createAvatarStylesheet(theme: Theme, expanded?: Partial<AvatarStylesheet>): AvatarStylesheet {
    return {
        avatar: createAvatarStyles(theme, expanded?.avatar || {}),
        image: createImageStyles(theme, expanded?.image || {}),
        fallback: createFallbackStyles(theme, expanded?.fallback || {}),
    };
}
