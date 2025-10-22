import { Styles } from "../styles";
import { Color, ColorValue, Theme } from "../theme";

export function buildColorVariants(theme: Theme, builder: (color: ColorValue) => Styles): Record<Color, Styles> {
    const variants = {} as Record<Color, Styles>;
    const colors = theme.colors as Record<string, ColorValue>;

    for (const colorName in colors) {
        variants[colorName as Color] = builder(colors[colorName]);
    }

    return variants;
}