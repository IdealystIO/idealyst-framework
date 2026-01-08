import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';
import { applyExtensions } from '../extensions/applyExtension';

type ImageVariants = {}

export type ExpandedImageStyles = StylesheetStyles<keyof ImageVariants>;

export type ImageStylesheet = {
    container: ExpandedImageStyles;
    image: ExpandedImageStyles;
    placeholder: ExpandedImageStyles;
    fallback: ExpandedImageStyles;
    loadingIndicator: ExpandedImageStyles;
}

// Style creators for extension support
function createContainerStyles(theme: Theme) {
    return () => ({
        position: 'relative' as const,
        overflow: 'hidden' as const,
        backgroundColor: theme.colors['gray.200'],
    });
}

function createImageStyles() {
    return () => ({
        width: '100%' as const,
        height: '100%' as const,
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const imageStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements

    return applyExtensions('Image', theme, {container: createContainerStyles(theme),
        image: createImageStyles(),
        // Additional styles (merged from return)
        // Minor utility styles (not extended)
        placeholder: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors['gray.200'],
        },
        fallback: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors['gray.300'],
            color: theme.colors['gray.600'],
        },
        loadingIndicator: {
            color: theme.colors['gray.600'],
        }});
});