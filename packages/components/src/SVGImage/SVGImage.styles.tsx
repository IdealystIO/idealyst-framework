import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';

type SVGImageIntent = Intent;

type SVGImageVariants = {
    intent: SVGImageIntent;
}

export type ExpandedSVGImageStyles = StylesheetStyles<keyof SVGImageVariants>;

export type SVGImageStylesheet = {
    container: ExpandedSVGImageStyles;
    image: ExpandedSVGImageStyles;
}

function createContainerIntentVariants(theme: Theme) {
    return {
        primary: {
            filter: `brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)`,
        },
        success: {
            filter: `brightness(0) saturate(100%) invert(64%) sepia(88%) saturate(3323%) hue-rotate(84deg) brightness(119%) contrast(119%)`,
        },
        error: {
            filter: `brightness(0) saturate(100%) invert(23%) sepia(89%) saturate(7395%) hue-rotate(4deg) brightness(102%) contrast(118%)`,
        },
        warning: {
            filter: `brightness(0) saturate(100%) invert(54%) sepia(98%) saturate(4341%) hue-rotate(21deg) brightness(101%) contrast(101%)`,
        },
        neutral: {
            filter: `brightness(0) saturate(100%) invert(52%) sepia(23%) saturate(3207%) hue-rotate(314deg) brightness(99%) contrast(96%)`,
        },
        info: {
            filter: `brightness(0) saturate(100%) invert(58%) sepia(96%) saturate(2582%) hue-rotate(165deg) brightness(99%) contrast(91%)`,
        },
    };
}

function createContainerNativeIntentVariants(theme: Theme) {
    const variants: Record<SVGImageIntent, any> = {} as any;
    for (const intent in theme.intents) {
        variants[intent as SVGImageIntent] = {
            tintColor: theme.intents[intent as SVGImageIntent].primary,
        };
    }
    return variants;
}

function createContainerStyles(theme: Theme, expanded: Partial<ExpandedSVGImageStyles>): ExpandedSVGImageStyles {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            intent: createContainerIntentVariants(theme),
        },
        _web: {
            userSelect: 'none',
        },
        _native: {
            variants: {
                intent: createContainerNativeIntentVariants(theme),
            },
        },
    }, expanded);
}

function createImageStyles(theme: Theme, expanded: Partial<ExpandedSVGImageStyles>): ExpandedSVGImageStyles {
    return deepMerge({
        _web: {
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
        },
        _native: {
            // Native image styles will be applied via Image component
        },
    }, expanded);
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const svgImageStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: createContainerStyles(theme, {}),
    image: createImageStyles(theme, {}),
  };
});