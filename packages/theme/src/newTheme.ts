import { ButtonSizeValue, ColorValue, Pallet, Theme } from "./theme";
import { Color, Shade, Size } from "./types";

export const newTheme = {
      intents: {
        primary: {
          primary: '#3b82f6',
          contrast: '#ffffff',
          light: '#bfdbfe',
          dark: '#1e40af',
        },
        success: {
          primary: '#22c55e',
          contrast: '#ffffff',
          light: '#a7f3d0',
          dark: '#165e29',
        },
        error: {
          primary: '#ef4444',
          contrast: '#ffffff',
          light: '#fca5a1',
          dark: '#9b2222',
        },
        warning: {
          primary: '#f97316',
          contrast: '#ffffff',
          light: '#ffedd5',
          dark: '#9a6a00',
        },
        neutral: {
          primary: '#6b7280',
          contrast: '#ffffff',
          light: '#e5e7eb',
          dark: '#374151',    
        },
        info: {
          primary: '#0ea5e9',
          contrast: '#ffffff',
          light: '#a5f3fc',
          dark: '#1e40af',
        },
      },
      surfaces: {
        primary: '#ffffff',
        secondary: '#f5f5f5',
        tertiary: '#e0e0e0',
        inverse: '#000000',
        'inverse-secondary': 'rgba(0, 0, 0, 0.9)',
        'inverse-tertiary': 'rgba(0, 0, 0, 0.7)',
      },
      colors: {
        pallet: generateColorPallette(),
        surface: {
          primary: '#ffffff',
          secondary: '#f5f5f5',
          tertiary: '#e0e0e0',
          inverse: '#000000',
          'inverse-secondary': 'rgba(0, 0, 0, 0.9)',
          'inverse-tertiary': 'rgba(0, 0, 0, 0.7)',
        },
        text: {
          primary: '#000000',
          secondary: '#333333',
          tertiary: '#666666',
          inverse: '#ffffff',
          'inverse-secondary': 'rgba(255, 255, 255, 0.9)',
          'inverse-tertiary': 'rgba(255, 255, 255, 0.7)',
        },
      },
      sizes: {
        button: {
          xs: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            minHeight: 24,
            fontSize: 12,
            lineHeight: 16,
            iconSize: 12,
          },
          sm: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            minHeight: 32,
            fontSize: 14,
            lineHeight: 20,
            iconSize: 14,
          },
          md: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            minHeight: 40,
            fontSize: 16,
            lineHeight: 24,
            iconSize: 16,
          },
          lg: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            minHeight: 48,
            fontSize: 18,
            lineHeight: 28,
            iconSize: 18,
          },
          xl: {
            paddingVertical: 12,
            paddingHorizontal: 24,
            minHeight: 56,
            fontSize: 20, 
            lineHeight: 32,
            iconSize: 20,
          }
        } as Record<Size, ButtonSizeValue>,
        chip: {
          xs: {
            paddingVertical: 1,
            paddingHorizontal: 6,
            minHeight: 16,
            borderRadius: 999,
            fontSize: 10,
            lineHeight: 12,
            iconSize: 10,
          },
          sm: {
            paddingVertical: 2,
            paddingHorizontal: 8,
            minHeight: 20,
            borderRadius: 999,
            fontSize: 11,
            lineHeight: 14,
            iconSize: 12,
          },
          md: {
            paddingVertical: 2,
            paddingHorizontal: 10,
            minHeight: 24,
            borderRadius: 999,
            fontSize: 12,
            lineHeight: 16,
            iconSize: 14,
          },
          lg: {
            paddingVertical: 3,
            paddingHorizontal: 12,
            minHeight: 28,
            borderRadius: 999,
            fontSize: 14,
            lineHeight: 18,
            iconSize: 16,
          },
          xl: {
            paddingVertical: 4,
            paddingHorizontal: 14,
            minHeight: 32,
            borderRadius: 999,
            fontSize: 16,
            lineHeight: 20,
            iconSize: 18,
          }
        },
        badge: {
          xs: {
            minWidth: 12,
            height: 12,
            paddingHorizontal: 2,
            fontSize: 8,
            lineHeight: 10,
            iconSize: 8,
          },
          sm: {
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            fontSize: 10,
            lineHeight: 12,
            iconSize: 10,
          },
          md: {
            minWidth: 20,
            height: 20,
            paddingHorizontal: 6,
            fontSize: 12,
            lineHeight: 14,
            iconSize: 12,
          },
          lg: {
            minWidth: 24,
            height: 24,
            paddingHorizontal: 8,
            fontSize: 14,
            lineHeight: 16,
            iconSize: 14,
          },
          xl: {
            minWidth: 28,
            height: 28,
            paddingHorizontal: 10,
            fontSize: 16,
            lineHeight: 18,
            iconSize: 16,
          }
        },
        icon: {
          xs: {
            width: 12,
            height: 12,
            fontSize: 12,
          },
          sm: {
            width: 16,
            height: 16,
            fontSize: 16,
          },
          md: {
            width: 24,
            height: 24,
            fontSize: 24,
          },
          lg: {
            width: 32,
            height: 32,
            fontSize: 32,
          },
          xl: {
            width: 48,
            height: 48,
            fontSize: 48,
          }
        }
      }
    } as Theme

    function generateColorPallette() {
      const colors = {} as Record<Pallet, Record<Shade, ColorValue>>

      const baseColors: Record<string, string> = {
        red: '#ef4444',
        blue: '#3b82f6',
        green: '#22c55e',
        yellow: '#f59e0b',
        purple: '#8b5cf6',
        pink: '#ec4899',
        gray: '#6b7280',
        indigo: '#6366f1',
        teal: '#14b8a6',
        orange: '#f97316',
      };

      const shades = [50,100,200,300,400,500,600,700,800,900];

      for (const [colorName, baseColor] of Object.entries(baseColors)) {
        colors[colorName] = {} as Record<Shade, ColorValue>;
        for (const shade of shades) {
          // Simple algorithm to generate shades (for demonstration purposes)
          const shadeValue = Math.max(0, Math.min(255, parseInt(baseColor.slice(1), 16) - (shade - 500) * 2));
          const shadeHex = `#${shadeValue.toString(16).padStart(6, '0')}`;
          colors[colorName][shade] = shadeHex;
        }
        colors[colorName] = baseColor;
      }

      return colors;
    }