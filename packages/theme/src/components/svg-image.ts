import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type SVGImageIntent = Intent;

type SVGImageVariants = {
    intent: SVGImageIntent;
}

export type ExpandedSVGImageStyles = StylesheetStyles<keyof SVGImageVariants>;

export type SVGImageStylesheet = {
    container: ExpandedSVGImageStyles;
    image: ExpandedSVGImageStyles;
}

/**
 * Create intent variants for container
 * Uses CSS filters for web and tintColor for native
 */
function createContainerIntentVariants(theme: Theme) {
    // TODO: Generate these CSS filters programmatically from theme.intents colors
    return {
        primary: {
            // CSS filter for web - this is a hardcoded approximation
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
            // TODO: Calculate correct CSS filter for info color (#0ea5e9)
            filter: `brightness(0) saturate(100%) invert(58%) sepia(96%) saturate(2582%) hue-rotate(165deg) brightness(99%) contrast(91%)`,
        },
    };
}

/**
 * Create intent variants for native container
 * Uses tintColor for React Native
 */
function createContainerNativeIntentVariants(theme: Theme) {
    const variants: Record<SVGImageIntent, any> = {} as any;
    for (const intent in theme.intents) {
        variants[intent as SVGImageIntent] = {
            tintColor: theme.intents[intent as SVGImageIntent].primary,
        };
    }
    return variants;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedSVGImageStyles>): ExpandedSVGImageStyles => {
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

const createImageStyles = (theme: Theme, expanded: Partial<ExpandedSVGImageStyles>): ExpandedSVGImageStyles => {
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

export const createSVGImageStylesheet = (theme: Theme, expanded?: Partial<SVGImageStylesheet>): SVGImageStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        image: createImageStyles(theme, expanded?.image || {}),
    };
}
