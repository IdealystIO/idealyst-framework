export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SizeValue = number | string

// Size alone is not very useful, as sizes are contextual based on the component
export type AllComponentSizes = {
    button: Record<Size, ButtonSizeValue>;
}


// Derivative size values based on context
export type ButtonSizeValue = {
    paddingVertical: SizeValue;
    paddingHorizontal: SizeValue;
    minHeight: SizeValue;
}