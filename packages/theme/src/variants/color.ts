import { Styles } from "../styles";
import { Color, ColorValue, Theme } from "../theme";

/**
 * Probably not necessary, colors are meant to be explicit colors from the pallette
 * @param theme 
 * @param builder 
 * @returns 
 */
export function buildColorVariants(theme: Theme, builder: (color: ColorValue) => Styles): Record<Color, Styles> {
    const variants = {} as Record<Color, Styles>;
    const colors = theme.colors as Record<string, ColorValue>;

    for (const colorName in colors) {
        variants[colorName as Color] = builder(colors[colorName]);
    }

    return variants;
}