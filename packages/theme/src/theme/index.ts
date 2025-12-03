import { AllColorTypes, Color, ColorValue } from "./color";
import { Intent, IntentValue } from "./intent";
import { AllComponentSizes, SizeValue } from "./size";
import { AllShadowTypes } from "./shadow";

/**
 * Interaction state configuration for hover, focus, active states
 */
export type InteractionConfig = {
    /** Background color for focused/highlighted items (e.g., list items, select options) */
    focusedBackground: string;
    /** Border/outline color for focused elements */
    focusBorder: string;
    /** Opacity values for various interaction states */
    opacity: {
        /** Opacity for hovered elements */
        hover: number;
        /** Opacity for active/pressed elements */
        active: number;
        /** Opacity for disabled elements */
        disabled: number;
    };
};

export type Theme = {
    intents: Record<Intent, IntentValue>;
    colors: AllColorTypes;
    sizes: AllComponentSizes;
    shadows: AllShadowTypes;
    interaction: InteractionConfig;
};

export * from "./intent";
export * from "./size";
export * from "./color";
export * from "./shadow";
