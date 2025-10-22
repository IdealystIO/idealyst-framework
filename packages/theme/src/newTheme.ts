import { Theme } from "./theme";

export const newTheme = {
      intents: {
        primary: {
          primary: '#3b82f6',
          contrast: '#ffffff',
        },
        success: {
          primary: '#22c55e',
          contrast: '#ffffff',
        },
        error: {
          primary: '#ef4444',
          contrast: '#ffffff',
        },
        warning: {
          primary: '#f97316',
          contrast: '#ffffff',
        },
        neutral: {
          primary: '#6b7280',
          contrast: '#ffffff',
        },
      },
      colors: generateColorPallette(),
      sizes: {
        button: {
          xs: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            minHeight: 24,
          },
          sm: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            minHeight: 32,
          },
          md: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            minHeight: 40,
          },
          lg: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            minHeight: 48,
          },
          xl: {
            paddingVertical: 12,
            paddingHorizontal: 24,
            minHeight: 56,
          }
        }
      }
    } as Theme

    function generateColorPallette() {
      const colors: Record<string, string> = {};

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
        for (const shade of shades) {
          // Simple algorithm to generate shades (for demonstration purposes)
          const shadeValue = Math.max(0, Math.min(255, parseInt(baseColor.slice(1), 16) - (shade - 500) * 2));
          const shadeHex = `#${shadeValue.toString(16).padStart(6, '0')}`;
          colors[`${colorName}-${shade}`] = shadeHex;
        }
      }

      return colors;
    }