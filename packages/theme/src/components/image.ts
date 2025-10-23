import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type ImageVariants = {}

export type ExpandedImageStyles = StylesheetStyles<keyof ImageVariants>;

export type ImageStylesheet = {
    container: ExpandedImageStyles;
    image: ExpandedImageStyles;
    placeholder: ExpandedImageStyles;
    fallback: ExpandedImageStyles;
    loadingIndicator: ExpandedImageStyles;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles => {
    return deepMerge({
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.colors['gray.200'], // TODO: Add surface colors to theme
    }, expanded);
}

const createImageStyles = (theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles => {
    return deepMerge({
        width: '100%',
        height: '100%',
    }, expanded);
}

const createPlaceholderStyles = (theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles => {
    return deepMerge({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors['gray.200'], // TODO: Add surface colors to theme
    }, expanded);
}

const createFallbackStyles = (theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles => {
    return deepMerge({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors['gray.300'], // TODO: Add surface colors to theme
        color: theme.colors['gray.600'], // TODO: Add text colors to theme
    }, expanded);
}

const createLoadingIndicatorStyles = (theme: Theme, expanded: Partial<ExpandedImageStyles>): ExpandedImageStyles => {
    return deepMerge({
        color: theme.colors['gray.600'], // TODO: Add text colors to theme
    }, expanded);
}

export const createImageStylesheet = (theme: Theme, expanded?: Partial<ImageStylesheet>): ImageStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        image: createImageStyles(theme, expanded?.image || {}),
        placeholder: createPlaceholderStyles(theme, expanded?.placeholder || {}),
        fallback: createFallbackStyles(theme, expanded?.fallback || {}),
        loadingIndicator: createLoadingIndicatorStyles(theme, expanded?.loadingIndicator || {}),
    };
}
