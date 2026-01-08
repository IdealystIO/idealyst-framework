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

/**
 * Create dynamic screen styles.
 * Returns a function to ensure Unistyles can track theme changes.
 */
function createScreenStyles(theme: Theme) {
    return (_props?: {}) => ({
        flex: 1,
        variants: {
            background: generateBackgroundVariants(theme),
            safeArea: {
                true: {},
                false: {},
            },
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

/**
 * Create dynamic screen content styles for ScrollView.
 * No flex: 1 so content can grow beyond screen height.
 */
function createScreenContentStyles(theme: Theme) {
    return (_props?: {}) => ({
        variants: {
            background: generateBackgroundVariants(theme),
            safeArea: {
                true: {},
                false: {},
            },
            gap: buildGapVariants(theme),
            padding: buildPaddingVariants(theme),
            paddingVertical: buildPaddingVerticalVariants(theme),
            paddingHorizontal: buildPaddingHorizontalVariants(theme),
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        },
    });
}

// Styles use applyExtensions to enable theme extensions and ensure proper
// reactivity with Unistyles' native Shadow Tree updates.
export const screenStyles = StyleSheet.create((theme: Theme) => {
    return applyExtensions('Screen', theme, {
        screen: createScreenStyles(theme),
        screenContent: createScreenContentStyles(theme),
    });
});
