export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SizeValue = number | string

// Size alone is not very useful, as sizes are contextual based on the component
export type AllComponentSizes = {
    button: Record<Size, ButtonSizeValue>;
    chip: Record<Size, ChipSizeValue>;
    badge: Record<Size, BadgeSizeValue>;
    icon: Record<Size, IconSizeValue>;
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