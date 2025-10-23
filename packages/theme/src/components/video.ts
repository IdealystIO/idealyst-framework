import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

export type ExpandedVideoStyles = StylesheetStyles<never>;

export type VideoStylesheet = {
    container: ExpandedVideoStyles;
    video: ExpandedVideoStyles;
    fallback: ExpandedVideoStyles;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedVideoStyles>): ExpandedVideoStyles => {
    return deepMerge({
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.colors['black'],
    }, expanded);
}

const createVideoStyles = (theme: Theme, expanded: Partial<ExpandedVideoStyles>): ExpandedVideoStyles => {
    return deepMerge({
        width: '100%',
        height: '100%',
    }, expanded);
}

const createFallbackStyles = (theme: Theme, expanded: Partial<ExpandedVideoStyles>): ExpandedVideoStyles => {
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

export const createVideoStylesheet = (theme: Theme, expanded?: Partial<VideoStylesheet>): VideoStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        video: createVideoStyles(theme, expanded?.video || {}),
        fallback: createFallbackStyles(theme, expanded?.fallback || {}),
    };
}
