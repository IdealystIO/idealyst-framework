/**
 * Tests for the ThemeBuilder class
 *
 * Tests the fluent builder API for creating themes, including:
 * - Intent management (add/set)
 * - Color management (pallet, surface, text, border)
 * - Radius, shadow, size, and breakpoint management
 */

import { createTheme, fromTheme, ThemeBuilder } from '../src/builder';
import type { IntentValue, Shade, ColorValue } from '../src/theme/structures';

describe('ThemeBuilder', () => {
    const mockIntent: IntentValue = {
        primary: '#3b82f6',
        contrast: '#ffffff',
        light: '#bfdbfe',
        dark: '#1e40af',
    };

    const mockShades: Record<Shade, ColorValue> = {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
    };

    describe('createTheme', () => {
        it('should create a new ThemeBuilder instance', () => {
            const builder = createTheme();
            expect(builder).toBeInstanceOf(ThemeBuilder);
        });
    });

    describe('addIntent', () => {
        it('should add a new intent to the theme', () => {
            const theme = createTheme()
                .addIntent('primary', mockIntent)
                .build();

            expect(theme.intents.primary).toEqual(mockIntent);
        });

        it('should add multiple intents', () => {
            const successIntent: IntentValue = {
                primary: '#22c55e',
                contrast: '#ffffff',
                light: '#86efac',
                dark: '#15803d',
            };

            const theme = createTheme()
                .addIntent('primary', mockIntent)
                .addIntent('success', successIntent)
                .build();

            expect(theme.intents.primary).toEqual(mockIntent);
            expect(theme.intents.success).toEqual(successIntent);
        });
    });

    describe('setIntent', () => {
        it('should replace an existing intent', () => {
            const updatedIntent: IntentValue = {
                primary: '#6366f1',
                contrast: '#ffffff',
                light: '#a5b4fc',
                dark: '#4338ca',
            };

            const theme = createTheme()
                .addIntent('primary', mockIntent)
                .setIntent('primary', updatedIntent)
                .build();

            expect(theme.intents.primary).toEqual(updatedIntent);
        });
    });

    describe('addPalletColor', () => {
        it('should add a new pallet color with all shades', () => {
            const theme = createTheme()
                .addPalletColor('brand', mockShades)
                .build();

            expect(theme.colors.pallet.brand).toEqual(mockShades);
        });

        it('should add multiple pallet colors', () => {
            const redShades: Record<Shade, ColorValue> = {
                50: '#fef2f2',
                100: '#fee2e2',
                200: '#fecaca',
                300: '#fca5a5',
                400: '#f87171',
                500: '#ef4444',
                600: '#dc2626',
                700: '#b91c1c',
                800: '#991b1b',
                900: '#7f1d1d',
            };

            const theme = createTheme()
                .addPalletColor('brand', mockShades)
                .addPalletColor('error', redShades)
                .build();

            expect(theme.colors.pallet.brand).toEqual(mockShades);
            expect(theme.colors.pallet.error).toEqual(redShades);
        });
    });

    describe('setPalletColor', () => {
        it('should replace an existing pallet color', () => {
            const updatedShades: Record<Shade, ColorValue> = {
                50: '#fafafa',
                100: '#f4f4f5',
                200: '#e4e4e7',
                300: '#d4d4d8',
                400: '#a1a1aa',
                500: '#71717a',
                600: '#52525b',
                700: '#3f3f46',
                800: '#27272a',
                900: '#18181b',
            };

            const theme = createTheme()
                .addPalletColor('brand', mockShades)
                .setPalletColor('brand', updatedShades)
                .build();

            expect(theme.colors.pallet.brand).toEqual(updatedShades);
        });
    });

    describe('addSurfaceColor', () => {
        it('should add a new surface color', () => {
            const theme = createTheme()
                .addSurfaceColor('card', '#ffffff')
                .build();

            expect(theme.colors.surface.card).toBe('#ffffff');
        });

        it('should add multiple surface colors', () => {
            const theme = createTheme()
                .addSurfaceColor('card', '#ffffff')
                .addSurfaceColor('modal', '#f5f5f5')
                .addSurfaceColor('overlay', 'rgba(0,0,0,0.5)')
                .build();

            expect(theme.colors.surface.card).toBe('#ffffff');
            expect(theme.colors.surface.modal).toBe('#f5f5f5');
            expect(theme.colors.surface.overlay).toBe('rgba(0,0,0,0.5)');
        });
    });

    describe('setSurfaceColor', () => {
        it('should replace an existing surface color', () => {
            const theme = createTheme()
                .addSurfaceColor('card', '#ffffff')
                .setSurfaceColor('card', '#f0f0f0')
                .build();

            expect(theme.colors.surface.card).toBe('#f0f0f0');
        });
    });

    describe('addTextColor', () => {
        it('should add a new text color', () => {
            const theme = createTheme()
                .addTextColor('muted', '#6b7280')
                .build();

            expect(theme.colors.text.muted).toBe('#6b7280');
        });

        it('should add multiple text colors', () => {
            const theme = createTheme()
                .addTextColor('primary', '#000000')
                .addTextColor('secondary', '#666666')
                .addTextColor('muted', '#999999')
                .build();

            expect(theme.colors.text.primary).toBe('#000000');
            expect(theme.colors.text.secondary).toBe('#666666');
            expect(theme.colors.text.muted).toBe('#999999');
        });
    });

    describe('setTextColor', () => {
        it('should replace an existing text color', () => {
            const theme = createTheme()
                .addTextColor('primary', '#000000')
                .setTextColor('primary', '#111111')
                .build();

            expect(theme.colors.text.primary).toBe('#111111');
        });
    });

    describe('addBorderColor', () => {
        it('should add a new border color', () => {
            const theme = createTheme()
                .addBorderColor('focus', '#3b82f6')
                .build();

            expect(theme.colors.border.focus).toBe('#3b82f6');
        });

        it('should add multiple border colors', () => {
            const theme = createTheme()
                .addBorderColor('default', '#e5e7eb')
                .addBorderColor('focus', '#3b82f6')
                .addBorderColor('error', '#ef4444')
                .build();

            expect(theme.colors.border.default).toBe('#e5e7eb');
            expect(theme.colors.border.focus).toBe('#3b82f6');
            expect(theme.colors.border.error).toBe('#ef4444');
        });
    });

    describe('setBorderColor', () => {
        it('should replace an existing border color', () => {
            const theme = createTheme()
                .addBorderColor('focus', '#3b82f6')
                .setBorderColor('focus', '#6366f1')
                .build();

            expect(theme.colors.border.focus).toBe('#6366f1');
        });
    });

    describe('fromTheme', () => {
        it('should create a builder from an existing theme', () => {
            const baseTheme = createTheme()
                .addIntent('primary', mockIntent)
                .addSurfaceColor('card', '#ffffff')
                .addTextColor('primary', '#000000')
                .addBorderColor('default', '#e5e7eb')
                .build();

            const extendedTheme = fromTheme(baseTheme)
                .addIntent('secondary', {
                    primary: '#6b7280',
                    contrast: '#ffffff',
                    light: '#d1d5db',
                    dark: '#374151',
                })
                .build();

            // Should have both base and new intents
            expect(extendedTheme.intents.primary).toEqual(mockIntent);
            expect(extendedTheme.intents.secondary).toBeDefined();

            // Should preserve other values
            expect(extendedTheme.colors.surface.card).toBe('#ffffff');
            expect(extendedTheme.colors.text.primary).toBe('#000000');
            expect(extendedTheme.colors.border.default).toBe('#e5e7eb');
        });

        it('should allow overriding base theme values', () => {
            const baseTheme = createTheme()
                .addIntent('primary', mockIntent)
                .addSurfaceColor('card', '#ffffff')
                .build();

            const updatedIntent: IntentValue = {
                primary: '#6366f1',
                contrast: '#ffffff',
                light: '#a5b4fc',
                dark: '#4338ca',
            };

            const extendedTheme = fromTheme(baseTheme)
                .setIntent('primary', updatedIntent)
                .setSurfaceColor('card', '#f0f0f0')
                .build();

            expect(extendedTheme.intents.primary).toEqual(updatedIntent);
            expect(extendedTheme.colors.surface.card).toBe('#f0f0f0');
        });
    });

    describe('chaining', () => {
        it('should support method chaining for all color methods', () => {
            const theme = createTheme()
                .addIntent('primary', mockIntent)
                .addPalletColor('blue', mockShades)
                .addSurfaceColor('screen', '#ffffff')
                .addSurfaceColor('card', '#f5f5f5')
                .addTextColor('primary', '#000000')
                .addTextColor('secondary', '#666666')
                .addBorderColor('default', '#e5e7eb')
                .addBorderColor('focus', '#3b82f6')
                .addRadius('sm', 4)
                .addRadius('md', 8)
                .addShadow('sm', {
                    elevation: 2,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                })
                .build();

            expect(theme.intents.primary).toBeDefined();
            expect(theme.colors.pallet.blue).toBeDefined();
            expect(theme.colors.surface.screen).toBe('#ffffff');
            expect(theme.colors.surface.card).toBe('#f5f5f5');
            expect(theme.colors.text.primary).toBe('#000000');
            expect(theme.colors.text.secondary).toBe('#666666');
            expect(theme.colors.border.default).toBe('#e5e7eb');
            expect(theme.colors.border.focus).toBe('#3b82f6');
            expect(theme.radii.sm).toBe(4);
            expect(theme.radii.md).toBe(8);
            expect(theme.shadows.sm).toBeDefined();
        });
    });
});
