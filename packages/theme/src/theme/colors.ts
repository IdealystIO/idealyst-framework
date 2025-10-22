export type ColorPallet = 'red' | 'blue' | 'green' | 'yellow' | 'gray' | 'black' | 'white';
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type Color = `${ColorPallet}.${ColorShade}` | ColorPallet;
export type ColorValue = string;