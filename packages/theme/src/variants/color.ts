import { ColorValue, Pallet, Shade, Theme } from "../theme";

export function getColorFromString(theme: Theme, color: string): ColorValue {
    const [colorName, shadeStr] = color.split('.') as [Pallet, string | undefined];
    const colorPallet = theme.colors.pallet;
    const shade = (shadeStr ? Number(shadeStr) : 500) as Shade;
    return colorPallet[colorName]?.[shade];
}   