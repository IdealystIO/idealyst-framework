import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';
import { applyExtensions } from '../extensions/applyExtension';

export type ExpandedVideoStyles = StylesheetStyles<never>;

export type VideoStylesheet = {
    container: ExpandedVideoStyles;
    video: ExpandedVideoStyles;
    fallback: ExpandedVideoStyles;
}

// Style creators for extension support
function createContainerStyles(theme: Theme) {
    return () => ({
        position: 'relative' as const,
        overflow: 'hidden' as const,
        backgroundColor: theme.colors['black'],
    });
}

function createVideoStyles() {
    return () => ({
        width: '100%' as const,
        height: '100%' as const,
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const videoStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements

    return applyExtensions('Video', theme, {container: createContainerStyles(theme),
        video: createVideoStyles(),
        // Additional styles (merged from return)
        // Minor utility styles (not extended)
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
        }});
});