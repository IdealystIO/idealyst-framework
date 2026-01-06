import { StyleSheet } from 'react-native-unistyles';
import { Theme } from '@idealyst/theme';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { applyExtensions } from '../extensions/applyExtension';

function generateBackgroundVariants(theme: Theme) {
  return {
    primary: { backgroundColor: theme.colors.surface.primary },
    secondary: { backgroundColor: theme.colors.surface.secondary },
    tertiary: { backgroundColor: theme.colors.surface.tertiary },
    inverse: { backgroundColor: theme.colors.surface.inverse },
    'inverse-secondary': { backgroundColor: theme.colors.surface['inverse-secondary'] },
    'inverse-tertiary': { backgroundColor: theme.colors.surface['inverse-tertiary'] },
    transparent: { backgroundColor: 'transparent' },
  };
}

// Style creators for extension support
function createScreenStyles(theme: Theme) {
    return () => ({
        flex: 1,
        variants: {
            background: generateBackgroundVariants(theme),
            safeArea: {
                true: {},
                false: {},
            },
            // Spacing variants from ContainerStyleProps
            gap: buildGapVariants(theme),
            padding: buildPaddingVariants(theme),
            paddingVertical: buildPaddingVerticalVariants(theme),
            paddingHorizontal: buildPaddingHorizontalVariants(theme),
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        },
        _web: {
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            boxSizing: 'border-box',
        },
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const screenStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('Screen', theme, {
        screen: createScreenStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
        // Content style for ScrollView - no flex: 1 so content can grow
        screenContent: {
            backgroundColor: theme.colors.surface.primary,
            variants: {
                background: generateBackgroundVariants(theme),
                safeArea: {
                    true: {},
                    false: {},
                },
                // Spacing variants from ContainerStyleProps
                gap: buildGapVariants(theme),
                padding: buildPaddingVariants(theme),
                paddingVertical: buildPaddingVerticalVariants(theme),
                paddingHorizontal: buildPaddingHorizontalVariants(theme),
                margin: buildMarginVariants(theme),
                marginVertical: buildMarginVerticalVariants(theme),
                marginHorizontal: buildMarginHorizontalVariants(theme),
            },
        },
    };
});
