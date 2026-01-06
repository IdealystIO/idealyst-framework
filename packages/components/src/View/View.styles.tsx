import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Surface } from '@idealyst/theme';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { ViewBackgroundVariant, ViewBorderVariant, ViewRadiusVariant } from './types';
import { ViewStyleSize } from '../utils/viewStyleProps';
import { applyExtensions } from '../extensions/applyExtension';

type ViewVariants = {
  background: ViewBackgroundVariant;
  radius: ViewRadiusVariant;
  border: ViewBorderVariant;
  gap: ViewStyleSize;
  padding: ViewStyleSize;
  paddingVertical: ViewStyleSize;
  paddingHorizontal: ViewStyleSize;
  margin: ViewStyleSize;
  marginVertical: ViewStyleSize;
  marginHorizontal: ViewStyleSize;
};

export type ExpandedViewStyles = StylesheetStyles<keyof ViewVariants>;

export type ViewStylesheet = {
  view: ExpandedViewStyles;
};

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

// Style creators for extension support
function createViewStyles(theme: Theme) {
    return () => ({
        display: 'flex' as const,
        variants: {
            background: createBackgroundVariants(theme),
            radius: createRadiusVariants(),
            border: createBorderVariants(theme),
            gap: buildGapVariants(theme),
            padding: buildPaddingVariants(theme),
            paddingVertical: buildPaddingVerticalVariants(theme),
            paddingHorizontal: buildPaddingHorizontalVariants(theme),
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        },
        _web: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const viewStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('View', theme, {
        view: createViewStyles(theme),
    });

    return {
        ...extended,
    };
});
