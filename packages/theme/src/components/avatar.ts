import { StylesheetStyles } from "../styles";
import { Size } from "../theme/size";

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
 * NOTE: The avatar stylesheet implementation has been moved to
 * @idealyst/components/src/Avatar/Avatar.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
