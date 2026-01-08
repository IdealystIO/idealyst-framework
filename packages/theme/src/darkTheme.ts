import { createTheme } from './builder';
import { lightTheme } from './lightTheme';

// =============================================================================
// Build Dark Theme
// =============================================================================

// Note: No explicit type annotation - let TypeScript infer from builder
export const darkTheme = createTheme()
    // Intents (brighter for dark backgrounds)
    .addIntent('primary', {
        primary: '#60a5fa',
        contrast: '#0f172a',
        light: '#3b82f6',
        dark: '#1e3a8a',
    })
    .addIntent('success', {
        primary: '#34d399',
        contrast: '#0f172a',
        light: '#6ee7b7',
        dark: '#047857',
    })
    .addIntent('error', {
        primary: '#f87171',
        contrast: '#0f172a',
        light: '#fca5a5',
        dark: '#b91c1c',
    })
    .addIntent('warning', {
        primary: '#fb923c',
        contrast: '#0f172a',
        light: '#fdba74',
        dark: '#c2410c',
    })
    .addIntent('neutral', {
        primary: '#9ca3af',
        contrast: '#0f172a',
        light: '#d1d5db',
        dark: '#4b5563',
    })
    .addIntent('info', {
        primary: '#38bdf8',
        contrast: '#0f172a',
        light: '#7dd3fc',
        dark: '#0369a1',
    })
    // Radii (same as light)
    .addRadius('none', 0)
    .addRadius('xs', 2)
    .addRadius('sm', 4)
    .addRadius('md', 8)
    .addRadius('lg', 12)
    .addRadius('xl', 16)
    // Shadows (higher opacity for dark backgrounds)
    .addShadow('none', {})
    .addShadow('sm', {
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 2,
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.18)',
    })
    .addShadow('md', {
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4.65,
        boxShadow: '0px 3px 9.3px rgba(0, 0, 0, 0.2)',
    })
    .addShadow('lg', {
        elevation: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.23,
        shadowRadius: 6.27,
        boxShadow: '0px 6px 12.54px rgba(0, 0, 0, 0.23)',
    })
    .addShadow('xl', {
        elevation: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.25)',
    })
    // Colors (neutral grays, not blue-tinted)
    .setColors({
        pallet: generateDarkColorPallette(),
        surface: {
            screen: '#121212',
            primary: '#1e1e1e',
            secondary: '#1e1e1e',
            tertiary: '#2a2a2a',
            inverse: '#ffffff',
            'inverse-secondary': 'rgba(255, 255, 255, 0.9)',
            'inverse-tertiary': 'rgba(255, 255, 255, 0.7)',
        },
        text: {
            primary: '#f5f5f5',
            secondary: '#a3a3a3',
            tertiary: '#737373',
            inverse: '#121212',
            'inverse-secondary': 'rgba(18, 18, 18, 0.9)',
            'inverse-tertiary': 'rgba(18, 18, 18, 0.7)',
        },
        border: {
            primary: '#333333',
            secondary: '#404040',
            tertiary: '#525252',
            disabled: '#1e1e1e',
        },
    })
    // Sizes (reuse from light theme)
    .setSizes(lightTheme.sizes)
    // Interaction
    .setInteraction({
        focusedBackground: 'rgba(96, 165, 250, 0.15)',
        focusBorder: 'rgba(96, 165, 250, 0.4)',
        opacity: {
            hover: 0.85,
            active: 0.7,
            disabled: 0.4,
        },
    })
    .build();

// =============================================================================
// Color Palette Generator (same algorithm, different base)
// =============================================================================

// Local types to avoid circular dependency with RegisteredTheme
type BasePallet = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray' | 'orange' | 'black' | 'white';
type BaseShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

function generateDarkColorPallette() {
    const colors = {} as Record<BasePallet, Record<BaseShade, string>>;

    const baseColors: Record<BasePallet, string> = {
        red: '#ef4444',
        blue: '#3b82f6',
        green: '#22c55e',
        yellow: '#f59e0b',
        purple: '#8b5cf6',
        gray: '#6b7280',
        orange: '#f97316',
        black: '#000000',
        white: '#ffffff',
    };

    const hexToRgb = (hex: string): [number, number, number] => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    };

    const rgbToHex = (r: number, g: number, b: number): string => {
        const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const interpolate = (
        color1: [number, number, number],
        color2: [number, number, number],
        factor: number
    ): [number, number, number] => {
        return [
            color1[0] + (color2[0] - color1[0]) * factor,
            color1[1] + (color2[1] - color1[1]) * factor,
            color1[2] + (color2[2] - color1[2]) * factor,
        ];
    };

    const shades: BaseShade[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const white: [number, number, number] = [255, 255, 255];
    const black: [number, number, number] = [0, 0, 0];

    for (const [colorName, baseColor] of Object.entries(baseColors)) {
        colors[colorName as BasePallet] = {} as Record<BaseShade, string>;
        const baseRgb = hexToRgb(baseColor);

        for (const shade of shades) {
            if (shade === 500) {
                colors[colorName as BasePallet][shade] = baseColor;
            } else if (shade < 500) {
                const factor = (500 - shade) / 450;
                const interpolated = interpolate(baseRgb, white, factor);
                colors[colorName as BasePallet][shade] = rgbToHex(...interpolated);
            } else {
                const factor = (shade - 500) / 400;
                const interpolated = interpolate(baseRgb, black, factor);
                colors[colorName as BasePallet][shade] = rgbToHex(...interpolated);
            }
        }
    }

    return colors;
}
