import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent, Size } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

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

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const progressStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: {
        gap: 4 as const,
    },
    linearTrack: {
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
    },
    linearBar: createLinearBarStyles(theme),
    indeterminateBar: createIndeterminateBarStyles(theme),
    circularContainer: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        position: 'relative' as const,
        variants: {
            size: createCircularContainerSizeVariants(theme),
        } as const,
    } as const,
    circularTrack: {
        _web: {
            stroke: theme.colors.border.secondary,
        }
    },
    circularBar: createCircularBarStyles(theme),
    label: {
        color: theme.colors.text.primary,
        textAlign: 'center' as const,
        variants: {
            size: createLabelSizeVariants(theme),
        },
    },
    circularLabel: {
        position: 'absolute' as const,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        variants: {
            size: createCircularLabelSizeVariants(theme),
        },
    },
  };
});
