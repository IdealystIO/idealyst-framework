import { Styles } from "../styles";
import { Color, ColorValue, Theme } from "../theme";

export function getColorFromString(theme: Theme, color: Color): ColorValue {
    const [colorName, shade] = color.split('.') as [Color, string | undefined];
    const colorPallet = theme.colors.pallet;
    return colorPallet[colorName]?.[shade || '500']

}   