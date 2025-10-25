import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type TooltipSize = Size;
type TooltipIntent = Intent;

type TooltipTooltipVariants = {
    size: TooltipSize;
    intent: TooltipIntent;
}

export type ExpandedTooltipTooltipStyles = StylesheetStyles<keyof TooltipTooltipVariants>;
export type ExpandedTooltipStyles = StylesheetStyles<never>;

export type TooltipStylesheet = {
    container: ExpandedTooltipStyles;
    tooltip: ExpandedTooltipTooltipStyles;
}

function createTooltipSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'tooltip', (size) => ({
        fontSize: size.fontSize,
        padding: size.padding,
    }));
}

function createTooltipIntentVariants(theme: Theme) {
    const intents: Record<string, any> = {};

    for (const [intentName, intentValue] of Object.entries(theme.intents)) {
        intents[intentName] = {
            backgroundColor: intentValue.primary,
            color: intentValue.contrast,
        };
    }

    return intents;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const tooltipStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: {
        position: 'relative',
        _web: {
            display: 'inline-flex',
            width: 'fit-content',
        },
    } as const,
    tooltip: {
        borderRadius: 8,
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        variants: {
            size: createTooltipSizeVariants(theme),
            intent: createTooltipIntentVariants(theme),
        },
        _web: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            pointerEvents: 'none',
            width: 'max-content',
            wordWrap: 'break-word',
        },
    } as const,
  } as const;
});