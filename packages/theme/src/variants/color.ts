import { ColorValue, Pallet, Theme } from "../theme";

export function getColorFromString(theme: Theme, color: string): ColorValue {
    const [colorName, shade] = color.split('.') as [Pallet, string | undefined];
    const colorPallet = theme.colors.pallet;
    return colorPallet[colorName]?.[shade || '500']
}   