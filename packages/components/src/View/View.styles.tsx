import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';
import { Surface } from '@idealyst/theme/src/theme/surface';

type ViewSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ViewMargin = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ViewBackground = Surface | 'transparent';
type ViewRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ViewBorder = 'none' | 'thin' | 'thick';

type ViewVariants = {
    spacing: ViewSpacing;
    margin: ViewMargin;
    background: ViewBackground;
    radius: ViewRadius;
    border: ViewBorder;
}

export type ExpandedViewStyles = StylesheetStyles<keyof ViewVariants>;

export type ViewStylesheet = {
    view: ExpandedViewStyles;
}

/**
 * Create spacing variants for view
 */
function createSpacingVariants() {
    return {
        none: { gap: 0 },
        xs: { gap: 4 },
        sm: { gap: 8 },
        md: { gap: 16 },
        lg: { gap: 24 },
        xl: { gap: 32 },
    };
}

/**
 * Create margin variants for view
 */
function createMarginVariants() {
    return {
        none: { margin: 0 },
        xs: { margin: 4 },
        sm: { margin: 8 },
        md: { margin: 16 },
        lg: { margin: 24 },
        xl: { margin: 32 },
    };
}

/**
 * Create background variants for view
 */
function createBackgroundVariants(theme: Theme) {
    const variants: any = {
        transparent: {
            backgroundColor: 'transparent',
        },
    };

    // Add all surface colors programmatically
    for (const surface in theme.colors.surface) {
        variants[surface] = {
            backgroundColor: theme.colors.surface[surface as Surface],
        };
    }

    return variants;
}

/**
 * Create radius variants for view
 */
function createRadiusVariants() {
    return {
        none: { borderRadius: 0 },
        xs: { borderRadius: 2 },
        sm: { borderRadius: 4 },
        md: { borderRadius: 8 },
        lg: { borderRadius: 12 },
        xl: { borderRadius: 16 },
    };
}

/**
 * Create border variants for view
 */
function createBorderVariants(theme: Theme) {
    return {
        none: {
            borderWidth: 0,
        },
        thin: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors['gray.300'],
        },
        thick: {
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: theme.colors['gray.300'],
        },
    };
}

function createViewStyles(theme: Theme, expanded: Partial<ExpandedViewStyles>): ExpandedViewStyles {
    return deepMerge({
        display: 'flex',
        variants: {
            spacing: createSpacingVariants(),
            margin: createMarginVariants(),
            background: createBackgroundVariants(theme),
            radius: createRadiusVariants(),
            border: createBorderVariants(theme),
        },
        _web: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
    }, expanded);
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const viewStyles: ReturnType<typeof createViewStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    view: createViewStyles(theme, {}),
  };
});

function createViewStylesheet(theme: Theme, expanded?: Partial<ViewStylesheet>): ViewStylesheet {
    return {
        view: createViewStyles(theme, expanded?.view || {}),
    };
}
