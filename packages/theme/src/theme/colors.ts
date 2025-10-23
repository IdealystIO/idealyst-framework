export type Pallet = 'red' | 'blue' | 'green' | 'yellow' | 'gray' | 'black' | 'white';
export type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type Color = `${Pallet}.${Shade}` | Pallet;
export type ColorValue = string;

export type Surface = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'inverse-secondary' | 'inverse-tertiary';
export type Text = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'inverse-secondary' | 'inverse-tertiary';
export type Border = 'primary' | 'secondary' | 'tertiary' | 'disabled';

export type AllColorTypes = {
    surface: Record<Surface, ColorValue>;
    text: Record<Text, ColorValue>;
    border: Record<Border, ColorValue>;
    pallet: Record<Pallet, Record<Shade, ColorValue>>;
}