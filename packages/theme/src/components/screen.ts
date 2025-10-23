import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Surface } from "../theme/surface";
import { deepMerge } from "../util/deepMerge";

type ScreenBackground = Surface | 'transparent';
type ScreenPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

type ScreenVariants = {
    background: ScreenBackground;
    padding: ScreenPadding;
}

export type ExpandedScreenStyles = StylesheetStyles<keyof ScreenVariants>;

export type ScreenStylesheet = {
    screen: ExpandedScreenStyles;
}

/**
 * Create background variants for screen
 */
function createBackgroundVariants(theme: Theme) {
    const variants: any = {
        transparent: {
            backgroundColor: 'transparent',
        },
    };

    // Add all surface colors programmatically
    for (const surface in theme.surfaces) {
        variants[surface] = {
            backgroundColor: theme.surfaces[surface as Surface],
        };
    }

    return variants;
}

/**
 * Create padding variants for screen
 */
function createPaddingVariants(theme: Theme) {
    // TODO: Add spacing to theme
    return {
        none: {
            padding: 0,
        },
        sm: {
            padding: 8,
        },
        md: {
            padding: 16,
        },
        lg: {
            padding: 24,
        },
        xl: {
            padding: 32,
        },
    };
}

const createScreenStyles = (theme: Theme, expanded: Partial<ExpandedScreenStyles>): ExpandedScreenStyles => {
    return deepMerge({
        flex: 1,
        backgroundColor: theme.surfaces.primary,
        variants: {
            background: createBackgroundVariants(theme),
            padding: createPaddingVariants(theme),
        },
        _web: {
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            boxSizing: 'border-box',
        },
    }, expanded);
}

export const createScreenStylesheet = (theme: Theme, expanded?: Partial<ScreenStylesheet>): ScreenStylesheet => {
    return {
        screen: createScreenStyles(theme, expanded?.screen || {}),
    };
}
