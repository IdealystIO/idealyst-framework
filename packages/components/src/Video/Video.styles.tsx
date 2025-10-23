import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';

export type ExpandedVideoStyles = StylesheetStyles<never>;

export type VideoStylesheet = {
    container: ExpandedVideoStyles;
    video: ExpandedVideoStyles;
    fallback: ExpandedVideoStyles;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const videoStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.colors['black'],
    },
    video: {
        width: '100%',
        height: '100%',
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
  };
});