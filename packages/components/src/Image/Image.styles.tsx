import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';

type ImageVariants = {}

export type ExpandedImageStyles = StylesheetStyles<keyof ImageVariants>;

export type ImageStylesheet = {
    container: ExpandedImageStyles;
    image: ExpandedImageStyles;
    placeholder: ExpandedImageStyles;
    fallback: ExpandedImageStyles;
    loadingIndicator: ExpandedImageStyles;
}

function createContainerStyles(theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles {
    return deepMerge({
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.colors['gray.200'],
    }, expanded);
}

function createImageStyles(theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles {
    return deepMerge({
        width: '100%',
        height: '100%',
    }, expanded);
}

function createPlaceholderStyles(theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles {
    return deepMerge({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors['gray.200'],
    }, expanded);
}

function createFallbackStyles(theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles {
    return deepMerge({
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
    }, expanded);
}

function createLoadingIndicatorStyles(theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles {
    return deepMerge({
        color: theme.colors['gray.600'],
    }, expanded);
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const imageStyles: ReturnType<typeof createImageStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    container: createContainerStyles(theme, {}),
    image: createImageStyles(theme, {}),
    placeholder: createPlaceholderStyles(theme, {}),
    fallback: createFallbackStyles(theme, {}),
    loadingIndicator: createLoadingIndicatorStyles(theme, {}),
  };
});

function createImageStylesheet(theme: Theme, expanded?: Partial<ImageStylesheet>): ImageStylesheet {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        image: createImageStyles(theme, expanded?.image || {}),
        placeholder: createPlaceholderStyles(theme, expanded?.placeholder || {}),
        fallback: createFallbackStyles(theme, expanded?.fallback || {}),
        loadingIndicator: createLoadingIndicatorStyles(theme, expanded?.loadingIndicator || {}),
    };
}
