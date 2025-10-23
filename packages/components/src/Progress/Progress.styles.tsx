import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type ProgressSize = Size;
type ProgressIntent = Intent;

type ProgressVariants = {
    size: ProgressSize;
    intent: ProgressIntent;
    rounded: boolean;
}

export type ExpandedProgressStyles = StylesheetStyles<keyof ProgressVariants>;

export type ProgressStylesheet = {
    container: ExpandedProgressStyles;
    linearTrack: ExpandedProgressStyles;
    linearBar: ExpandedProgressStyles;
    indeterminateBar: ExpandedProgressStyles;
    circularContainer: ExpandedProgressStyles;
    circularTrack: ExpandedProgressStyles;
    circularBar: ExpandedProgressStyles;
    label: ExpandedProgressStyles;
    circularLabel: ExpandedProgressStyles;
}

function createLinearTrackSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        height: size.linearHeight,
    }));
}

function getLinearBarColor(theme: Theme, intent: ProgressIntent) {
    return theme.intents[intent].primary;
}

function createCircularContainerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'progress', (size) => ({
        width: size.circularSize,
        height: size.circularSize,
    }));
}

function getCircularBarColor(theme: Theme, intent: ProgressIntent) {
    return theme.intents[intent].primary;
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

function createLinearBarStyles(theme: Theme) {
    return ({ intent }: { intent: ProgressIntent }) => {
        return {
            height: '100%',
            backgroundColor: getLinearBarColor(theme, intent),
            variants: {
                rounded: {
                    true: { borderRadius: 9999 },
                    false: { borderRadius: 0 },
                },
            },
            _web: {
                transition: 'width 0.3s ease',
            },
        };
    }
}

function createIndeterminateBarStyles(theme: Theme) {
    return ({ intent }: { intent: ProgressIntent }) => {
        return {
            position: 'absolute',
            height: '100%',
            width: '40%',
            backgroundColor: getLinearBarColor(theme, intent),
            variants: {
                rounded: {
                    true: { borderRadius: 9999 },
                    false: { borderRadius: 0 },
                },
            },
        };
    }
}

function createCircularBarStyles(theme: Theme) {
    return ({ intent }: { intent: ProgressIntent }) => {
        return {
            stroke: getCircularBarColor(theme, intent),
        };
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const progressStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: {
        gap: 4,
    },
    linearTrack: {
        backgroundColor: theme.colors.border.secondary,
        overflow: 'hidden',
        position: 'relative',
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
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        variants: {
            size: createCircularContainerSizeVariants(theme),
        },
    },
    circularTrack: {
        stroke: theme.colors.border.secondary,
    },
    circularBar: createCircularBarStyles(theme),
    label: {
        color: theme.colors.text.primary,
        textAlign: 'center',
        variants: {
            size: createLabelSizeVariants(theme),
        },
    },
    circularLabel: {
        position: 'absolute',
        fontWeight: '600',
        color: theme.colors.text.primary,
        variants: {
            size: createCircularLabelSizeVariants(theme),
        },
    },
  };
});