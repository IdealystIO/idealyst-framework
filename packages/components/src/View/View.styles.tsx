import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Surface, ViewSizeValue} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { ViewBackgroundVariant, ViewBorderVariant, ViewRadiusVariant, ViewSpacingVariant } from './types';

type ViewVariants = {
    spacing: ViewSpacingVariant;
    background: ViewBackgroundVariant;
    radius: ViewRadiusVariant;
    border: ViewBorderVariant;
}

export type ExpandedViewStyles = StylesheetStyles<keyof ViewVariants>;

export type ViewStylesheet = {
    view: ExpandedViewStyles;
}

/**
 * Create spacing variants for view
 */
function createSpacingVariants(theme: Theme) {
    const spacingVariants = buildSizeVariants(theme, 'view', (size) => ({
        padding: size.padding,
        gap: size.spacing,
    }));

    spacingVariants['none'] = {
        padding: 0,
        gap: 0,
    };

    return spacingVariants as Record<ViewSpacingVariant, Partial<ExpandedViewStyles>>;
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
    } as const;
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
    } as const;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const viewStyles = StyleSheet.create((theme: Theme) => {
  return {
    view: {
        display: 'flex',
        variants: {
            spacing: createSpacingVariants(theme),
            background: createBackgroundVariants(theme),
            radius: createRadiusVariants(),
            border: createBorderVariants(theme),
        },
        _web: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
    },
  };
});