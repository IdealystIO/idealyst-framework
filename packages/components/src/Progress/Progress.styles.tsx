import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent, Size } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { applyExtensions } from '../extensions/applyExtension';

type ProgressSize = Size;
type ProgressIntent = Intent;

export type ProgressVariants = {
    size: ProgressSize;
    intent: ProgressIntent;
    rounded: boolean;
}

type ProgressDynamicProps = {
    intent?: ProgressIntent;
};

function createLinearTrackSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        height: size.linearHeight,
    }));
}

function createCircularContainerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        width: size.circularSize,
        height: size.circularSize,
    }));
}

function createLabelSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        fontSize: size.labelFontSize,
    }));
}

function createCircularLabelSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        fontSize: size.circularLabelFontSize,
    }));
}

/**
 * Get bar background color based on intent
 */
function getBarBackgroundColor(theme: Theme, intent: ProgressIntent): string {
    return theme.intents[intent].primary;
}

/**
 * Create dynamic linear bar styles
 */
function createLinearBarStyles(theme: Theme) {
    return ({ intent = 'primary' }: ProgressDynamicProps) => {
        return {
            height: '100%' as const,
            backgroundColor: getBarBackgroundColor(theme, intent),
            variants: {
                rounded: {
                    true: { borderRadius: 9999 },
                    false: { borderRadius: 0 },
                },
            },
            _web: {
                transition: 'width 0.3s ease' as const,
            },
        } as const;
    };
}

/**
 * Create dynamic indeterminate bar styles
 */
function createIndeterminateBarStyles(theme: Theme) {
    return ({ intent = 'primary' }: ProgressDynamicProps) => {
        return {
            position: 'absolute' as const,
            height: '100%' as const,
            width: '40%' as const,
            backgroundColor: getBarBackgroundColor(theme, intent),
            variants: {
                rounded: {
                    true: { borderRadius: 9999 },
                    false: { borderRadius: 0 },
                },
            },
        } as const;
    };
}

/**
 * Create dynamic circular bar styles
 */
function createCircularBarStyles(theme: Theme) {
    return ({ intent = 'primary' }: ProgressDynamicProps) => {
        return {
            _web: {
                stroke: getBarBackgroundColor(theme, intent),
            },
        } as const;
    };
}

/**
 * Create container styles
 */
function createContainerStyles() {
    return () => ({
        gap: 4 as const,
    });
}

/**
 * Create linear track styles
 */
function createLinearTrackStyles(theme: Theme) {
    return () => ({
        backgroundColor: theme.colors.border.secondary,
        overflow: 'hidden' as const,
        position: 'relative' as const,
        variants: {
            size: createLinearTrackSizeVariants(theme),
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
        },
    });
}

/**
 * Create circular container styles
 */
function createCircularContainerStyles(theme: Theme) {
    return () => ({
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        position: 'relative' as const,
        variants: {
            size: createCircularContainerSizeVariants(theme),
        } as const,
    });
}

/**
 * Create circular track styles
 */
function createCircularTrackStyles(theme: Theme) {
    return () => ({
        _web: {
            stroke: theme.colors.border.secondary,
        },
    });
}

/**
 * Create label styles
 */
function createLabelStyles(theme: Theme) {
    return () => ({
        color: theme.colors.text.primary,
        textAlign: 'center' as const,
        variants: {
            size: createLabelSizeVariants(theme),
        },
    });
}

/**
 * Create circular label styles
 */
function createCircularLabelStyles(theme: Theme) {
    return () => ({
        position: 'absolute' as const,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        variants: {
            size: createCircularLabelSizeVariants(theme),
        },
    });
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const progressStyles = StyleSheet.create((theme: Theme) => {
  // Apply extensions to main visual elements
  const extended = applyExtensions('Progress', theme, {
    container: createContainerStyles(),
    linearTrack: createLinearTrackStyles(theme),
    linearBar: createLinearBarStyles(theme),
  });

  return {
    ...extended,
    // Minor utility styles (not extended)
    indeterminateBar: createIndeterminateBarStyles(theme),
    circularContainer: createCircularContainerStyles(theme)(),
    circularTrack: createCircularTrackStyles(theme)(),
    circularBar: createCircularBarStyles(theme),
    label: createLabelStyles(theme)(),
    circularLabel: createCircularLabelStyles(theme)(),
  };
});
