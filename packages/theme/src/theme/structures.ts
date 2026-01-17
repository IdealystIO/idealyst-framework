/**
 * Structural type definitions for theme values.
 * These define WHAT the values look like, independent of RegisteredTheme.
 * Used by the builder before RegisteredTheme is available.
 */

/**
 * Intent value structure - the colors for each intent.
 */
export type IntentValue = {
    primary: string;
    contrast: string;
    light: string;
    dark: string;
};

/**
 * Shadow value structure for cross-platform shadows.
 */
export type ShadowValue = {
    elevation: number;
    shadowColor: string;
    shadowOffset: {
        width: number;
        height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    boxShadow?: string;
} | {};

/**
 * A color value string (hex, rgb, rgba, etc.)
 */
export type ColorValue = string;

/**
 * Shade values for palette colors (50-900 scale).
 */
export type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Size value - can be number or string
 */
export type SizeValue = number | string;

/**
 * Breakpoint value - must be a non-negative number representing pixels.
 * The first breakpoint in a set MUST be 0 (simulates CSS cascading behavior).
 */
export type BreakpointValue = number;

/**
 * Interaction state configuration for hover, focus, active states
 */
export type InteractionConfig = {
    focusedBackground: string;
    focusBorder: string;
    opacity: {
        hover: number;
        active: number;
        disabled: number;
    };
};

/**
 * Typography variants for semantic text styling
 */
export type Typography =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption';

/**
 * Typography style values
 */
export type TypographyValue = {
    fontSize: SizeValue;
    lineHeight: SizeValue;
    fontWeight: '300' | '400' | '500' | '600' | '700';
};

// Component size value structures
export type ButtonSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
    fontSize: SizeValue;
    lineHeight: SizeValue;
    iconSize: SizeValue;
};

export type IconButtonSizeValue = {
    size: SizeValue;
    iconSize: SizeValue;
};

export type ChipSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
    borderRadius: SizeValue;
    fontSize: SizeValue;
    lineHeight: SizeValue;
    iconSize: SizeValue;
};

export type BadgeSizeValue = {
    minWidth: SizeValue;
    height: SizeValue;
    paddingHorizontal: SizeValue;
    fontSize: SizeValue;
    lineHeight: SizeValue;
    iconSize: SizeValue;
};

export type IconSizeValue = {
    width: SizeValue;
    height: SizeValue;
    fontSize: SizeValue;
};

export type InputSizeValue = {
    height: SizeValue;
    paddingHorizontal: SizeValue;
    fontSize: SizeValue;
    iconSize: SizeValue;
    iconMargin: SizeValue;
};

export type RadioButtonSizeValue = {
    radioSize: SizeValue;
    radioDotSize: SizeValue;
    fontSize: SizeValue;
    gap: SizeValue;
};

export type SelectSizeValue = {
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
    fontSize: SizeValue;
    iconSize: SizeValue;
    borderRadius: SizeValue;
};

export type SliderSizeValue = {
    trackHeight: SizeValue;
    thumbSize: SizeValue;
    thumbIconSize: SizeValue;
    markHeight: SizeValue;
    labelFontSize: SizeValue;
};

export type SwitchSizeValue = {
    trackWidth: SizeValue;
    trackHeight: SizeValue;
    thumbSize: SizeValue;
    thumbIconSize: SizeValue;
    translateX: SizeValue;
};

export type TextAreaSizeValue = {
    fontSize: SizeValue;
    padding: SizeValue;
    lineHeight: SizeValue;
    minHeight: SizeValue;
};

export type AvatarSizeValue = {
    width: SizeValue;
    height: SizeValue;
    fontSize: SizeValue;
};

export type ProgressSizeValue = {
    linearHeight: SizeValue;
    circularSize: SizeValue;
    labelFontSize: SizeValue;
    circularLabelFontSize: SizeValue;
};

export type AccordionSizeValue = {
    headerPadding: SizeValue;
    headerFontSize: SizeValue;
    iconSize: SizeValue;
    contentPadding: SizeValue;
};

export type ActivityIndicatorSizeValue = {
    size: SizeValue;
    borderWidth: SizeValue;
};

export type AlertSizeValue = {
    padding: SizeValue;
    gap: SizeValue;
    borderRadius: SizeValue;
    titleFontSize: SizeValue;
    titleLineHeight: SizeValue;
    messageFontSize: SizeValue;
    messageLineHeight: SizeValue;
    iconSize: SizeValue;
    closeIconSize: SizeValue;
};

export type BreadcrumbSizeValue = {
    fontSize: SizeValue;
    lineHeight: SizeValue;
    iconSize: SizeValue;
};

export type ListSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
    iconSize: SizeValue;
    labelFontSize: SizeValue;
    labelLineHeight: SizeValue;
};

export type MenuSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    iconSize: SizeValue;
    labelFontSize: SizeValue;
};

export type TextSizeValue = {
    fontSize: SizeValue;
    lineHeight: SizeValue;
};

export type TabBarSizeValue = {
    fontSize: SizeValue;
    lineHeight: SizeValue;
    padding: SizeValue;
};

export type TableSizeValue = {
    padding: SizeValue;
    fontSize: SizeValue;
    lineHeight: SizeValue;
};

export type TooltipSizeValue = {
    fontSize: SizeValue;
    padding: SizeValue;
};

export type ViewSizeValue = {
    padding: SizeValue;
    spacing: SizeValue;
};
