import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent, Size, CompoundVariants, StaticStyles } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type ProgressSize = Size;
type ProgressIntent = Intent;

export type ProgressVariants = {
    size: ProgressSize;
    intent: ProgressIntent;
    rounded: boolean;
}

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

function createIntentVariants(theme: Theme) {
    const variants: any = {};
    for (const intent in theme.intents) {
        variants[intent] = {};
    }
    return variants;
}

function createLinearBarCompoundVariants(theme: Theme) {
    const compoundVariants: CompoundVariants<keyof ProgressVariants> = [];

    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        compoundVariants.push({
            intent,
            styles: {
                backgroundColor: intentValue.primary,
            },
        });
    }

    return compoundVariants;
}

function createCircularBarCompoundVariants(theme: Theme) {
    const compoundVariants: CompoundVariants<keyof ProgressVariants> = [];

    for (const intent in theme.intents) {
        const intentValue = theme.intents[intent as Intent];

        compoundVariants.push({
            intent,
            styles: {
                _web: {
                    stroke: intentValue.primary,
                },
            },
        });
    }

    return compoundVariants;
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
    linearBar: {
        height: '100%' as const,
        variants: {
            intent: createIntentVariants(theme),
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
        },
        compoundVariants: createLinearBarCompoundVariants(theme),
        _web: {
            transition: 'width 0.3s ease' as const,
        },
    },
    indeterminateBar: {
        position: 'absolute' as const,
        height: '100%' as const,
        width: '40%' as const,
        variants: {
            intent: createIntentVariants(theme),
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
        },
        compoundVariants: createLinearBarCompoundVariants(theme),
    },
    circularContainer: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        position: 'relative' as const,
        variants: {
            size: createCircularContainerSizeVariants(theme),
        },
    },
    circularTrack: {
        _web: {
            stroke: theme.colors.border.secondary,
        }
    },
    circularBar: {
        variants: {
            intent: createIntentVariants(theme),
        },
        compoundVariants: createCircularBarCompoundVariants(theme),
    },
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