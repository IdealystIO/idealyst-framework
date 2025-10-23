export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SizeValue = number | string

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