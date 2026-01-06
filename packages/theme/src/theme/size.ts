import { SizeExtensions } from './extensions';

/**
 * Base size variants.
 */
type BaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Custom size variants added via declaration merging.
 */
type CustomSize = keyof SizeExtensions;

/**
 * All available size variants.
 *
 * @example Adding custom sizes
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface SizeExtensions {
 *     '2xl': true;
 *     '3xl': true;
 *   }
 * }
 * ```
 */
export type Size = BaseSize | CustomSize;

export type SizeValue = number | string

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
    | 'caption'

/**
 * Typography style values
 */
export type TypographyValue = {
    fontSize: SizeValue;
    lineHeight: SizeValue;
    fontWeight: '300' | '400' | '500' | '600' | '700';
}

// Size alone is not very useful, as sizes are contextual based on the component
export type AllComponentSizes = {
    button: Record<Size, ButtonSizeValue>;
    chip: Record<Size, ChipSizeValue>;
    badge: Record<Size, BadgeSizeValue>;
    icon: Record<Size, IconSizeValue>;
    input: Record<Size, InputSizeValue>;
    radioButton: Record<Size, RadioButtonSizeValue>;
    select: Record<Size, SelectSizeValue>;
    slider: Record<Size, SliderSizeValue>;
    switch: Record<Size, SwitchSizeValue>;
    textarea: Record<Size, TextAreaSizeValue>;
    avatar: Record<Size, AvatarSizeValue>;
    progress: Record<Size, ProgressSizeValue>;
    accordion: Record<Size, AccordionSizeValue>;
    activityIndicator: Record<Size, ActivityIndicatorSizeValue>;
    breadcrumb: Record<Size, BreadcrumbSizeValue>;
    list: Record<Size, ListSizeValue>;
    menu: Record<Size, MenuSizeValue>;
    text: Record<Size, TextSizeValue>;
    tabBar: Record<Size, TabBarSizeValue>;
    table: Record<Size, TableSizeValue>;
    tooltip: Record<Size, TooltipSizeValue>;
    view: Record<Size, ViewSizeValue>;
    typography: Record<Typography, TypographyValue>;
}


// Derivative size values based on context
export type ButtonSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
    fontSize: SizeValue;
    iconSize: SizeValue;
}

export type ChipSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
    borderRadius: SizeValue;
    fontSize: SizeValue;
    lineHeight: SizeValue;
    iconSize: SizeValue;
}

export type BadgeSizeValue = {
    minWidth: SizeValue;
    height: SizeValue;
    paddingHorizontal: SizeValue;
    fontSize: SizeValue;
    lineHeight: SizeValue;
    iconSize: SizeValue;
}

export type IconSizeValue = {
    width: SizeValue;
    height: SizeValue;
    fontSize: SizeValue;
}

export type InputSizeValue = {
    height: SizeValue;
    paddingHorizontal: SizeValue;
    fontSize: SizeValue;
    iconSize: SizeValue;
    iconMargin: SizeValue;
}

export type RadioButtonSizeValue = {
    radioSize: SizeValue;
    radioDotSize: SizeValue;
    fontSize: SizeValue;
    gap: SizeValue;
}

export type SelectSizeValue = {
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
    fontSize: SizeValue;
    iconSize: SizeValue;
}

export type SliderSizeValue = {
    trackHeight: SizeValue;
    thumbSize: SizeValue;
    thumbIconSize: SizeValue;
    markHeight: SizeValue;
    labelFontSize: SizeValue;
}

export type SwitchSizeValue = {
    trackWidth: SizeValue;
    trackHeight: SizeValue;
    thumbSize: SizeValue;
    thumbIconSize: SizeValue;
    translateX: SizeValue;
}

export type TextAreaSizeValue = {
    fontSize: SizeValue;
    padding: SizeValue;
    lineHeight: SizeValue;
    minHeight: SizeValue;
}

export type AvatarSizeValue = {
    width: SizeValue;
    height: SizeValue;
    fontSize: SizeValue;
}

export type ProgressSizeValue = {
    linearHeight: SizeValue;
    circularSize: SizeValue;
    labelFontSize: SizeValue;
    circularLabelFontSize: SizeValue;
}

export type AccordionSizeValue = {
    headerPadding: SizeValue;
    headerFontSize: SizeValue;
    iconSize: SizeValue;
    contentPadding: SizeValue;
}

export type ActivityIndicatorSizeValue = {
    size: SizeValue;
    borderWidth: SizeValue;
}

export type BreadcrumbSizeValue = {
    fontSize: SizeValue;
    lineHeight: SizeValue;
    iconSize: SizeValue;
}

export type ListSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
    iconSize: SizeValue;
    labelFontSize: SizeValue;
    labelLineHeight: SizeValue;
}

export type MenuSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    iconSize: SizeValue;
    labelFontSize: SizeValue;
}

export type TextSizeValue = {
    fontSize: SizeValue;
    lineHeight: SizeValue;
}

export type TabBarSizeValue = {
    fontSize: SizeValue;
    lineHeight: SizeValue;
    padding: SizeValue;
}

export type TableSizeValue = {
    padding: SizeValue;
    fontSize: SizeValue;
    lineHeight: SizeValue;
}

export type TooltipSizeValue = {
    fontSize: SizeValue;
    padding: SizeValue;
}

export type ViewSizeValue = {
    padding: SizeValue;
    spacing: SizeValue;
}