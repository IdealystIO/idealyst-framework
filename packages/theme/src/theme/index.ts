import { AllColorTypes, Color, ColorValue } from "./color";
import { Intent, IntentValue } from "./intent";
import { AllComponentSizes, SizeValue } from "./size";
import { AllShadowTypes } from "./shadow";
import { RadiusExtensions } from "./extensions";

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

/**
 * Base radius values.
 */
type BaseRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Custom radius values added via declaration merging.
 */
type CustomRadius = keyof RadiusExtensions;

/**
 * All available border radius values.
 *
 * @example Adding custom radii
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface RadiusExtensions {
 *     '2xl': true;
 *     full: true;
 *   }
 * }
 * ```
 */
export type Radius = BaseRadius | CustomRadius;

export type Theme = {
    intents: Record<Intent, IntentValue>;
    colors: AllColorTypes;
    sizes: AllComponentSizes;
    shadows: AllShadowTypes;
    interaction: InteractionConfig;
    radii: Record<Radius, number>;
};

export * from "./extensions";
export * from "./intent";
export * from "./size";
export * from "./color";
export * from "./shadow";
