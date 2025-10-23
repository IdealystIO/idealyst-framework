import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';
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

function createContainerStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles {
    return deepMerge({
        gap: 4,
    }, expanded);
}

function createLinearTrackStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles {
    return deepMerge({
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
    }, expanded);
}

function createLinearBarStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>) {
    return ({ intent }: { intent: ProgressIntent }) => {
        return deepMerge({
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
        }, expanded);
    }
}

function createIndeterminateBarStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>) {
    return ({ intent }: { intent: ProgressIntent }) => {
        return deepMerge({
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
        }, expanded);
    }
}

function createCircularContainerStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        variants: {
            size: createCircularContainerSizeVariants(theme),
        },
    }, expanded);
}

function createCircularTrackStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles {
    return deepMerge({
        stroke: theme.colors.border.secondary,
    }, expanded);
}

function createCircularBarStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>) {
    return ({ intent }: { intent: ProgressIntent }) => {
        return deepMerge({
            stroke: getCircularBarColor(theme, intent),
        }, expanded);
    }
}

function createLabelStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles {
    return deepMerge({
        color: theme.colors.text.primary,
        textAlign: 'center',
        variants: {
            size: createLabelSizeVariants(theme),
        },
    }, expanded);
}

function createCircularLabelStyles(theme: Theme, expanded: Partial<ExpandedProgressStyles>): ExpandedProgressStyles {
    return deepMerge({
        position: 'absolute',
        fontWeight: '600',
        color: theme.colors.text.primary,
        variants: {
            size: createCircularLabelSizeVariants(theme),
        },
    }, expanded);
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const progressStyles: ReturnType<typeof createProgressStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    container: createContainerStyles(theme, {}),
    linearTrack: createLinearTrackStyles(theme, {}),
    linearBar: createLinearBarStyles(theme, {}),
    indeterminateBar: createIndeterminateBarStyles(theme, {}),
    circularContainer: createCircularContainerStyles(theme, {}),
    circularTrack: createCircularTrackStyles(theme, {}),
    circularBar: createCircularBarStyles(theme, {}),
    label: createLabelStyles(theme, {}),
    circularLabel: createCircularLabelStyles(theme, {}),
  };
});

function createProgressStylesheet(theme: Theme, expanded?: Partial<ProgressStylesheet>): ProgressStylesheet {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        linearTrack: createLinearTrackStyles(theme, expanded?.linearTrack || {}),
        linearBar: createLinearBarStyles(theme, expanded?.linearBar || {}),
        indeterminateBar: createIndeterminateBarStyles(theme, expanded?.indeterminateBar || {}),
        circularContainer: createCircularContainerStyles(theme, expanded?.circularContainer || {}),
        circularTrack: createCircularTrackStyles(theme, expanded?.circularTrack || {}),
        circularBar: createCircularBarStyles(theme, expanded?.circularBar || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        circularLabel: createCircularLabelStyles(theme, expanded?.circularLabel || {}),
    };
}
