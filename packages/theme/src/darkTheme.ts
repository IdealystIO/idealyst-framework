import { ButtonSizeValue, ColorValue, Pallet, Shade, Size } from "./theme";
import { Theme } from "./theme/index";

export const darkTheme: Theme = {
  shadows: {
    none: {},
    sm: {
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      _web: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.18)',
      },
    },
    md: {
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4.65,
      _web: {
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
      },
    },
    lg: {
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.23,
      shadowRadius: 6.27,
      _web: {
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.23)',
      },
    },
    xl: {
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 16.0,
      _web: {
        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  intents: {
    primary: {
      primary: '#60a5fa',
      contrast: '#0f172a',
      light: '#3b82f6',
      dark: '#1e3a8a',
    },
    success: {
      primary: '#34d399',
      contrast: '#0f172a',
      light: '#6ee7b7',
      dark: '#047857',
    },
    error: {
      primary: '#f87171',
      contrast: '#0f172a',
      light: '#fca5a5',
      dark: '#b91c1c',
    },
    warning: {
      primary: '#fb923c',
      contrast: '#0f172a',
      light: '#fdba74',
      dark: '#c2410c',
    },
    neutral: {
      primary: '#9ca3af',
      contrast: '#0f172a',
      light: '#d1d5db',
      dark: '#4b5563',
    },
    info: {
      primary: '#38bdf8',
      contrast: '#0f172a',
      light: '#7dd3fc',
      dark: '#0369a1',
    },
  },
  surfaces: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    inverse: '#ffffff',
    'inverse-secondary': 'rgba(255, 255, 255, 0.9)',
    'inverse-tertiary': 'rgba(255, 255, 255, 0.7)',
  },
  colors: {
    pallet: generateColorPallette(),
    surface: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      inverse: '#ffffff',
      'inverse-secondary': 'rgba(255, 255, 255, 0.9)',
      'inverse-tertiary': 'rgba(255, 255, 255, 0.7)',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      inverse: '#0f172a',
      'inverse-secondary': 'rgba(15, 23, 42, 0.9)',
      'inverse-tertiary': 'rgba(15, 23, 42, 0.7)',
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
      tertiary: '#64748b',
      disabled: '#1e293b',
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
    },
    input: {
      xs: {
        height: 28,
        paddingHorizontal: 6,
        fontSize: 12,
        iconSize: 12,
        iconMargin: 4,
      },
      sm: {
        height: 36,
        paddingHorizontal: 8,
        fontSize: 14,
        iconSize: 16,
        iconMargin: 4,
      },
      md: {
        height: 44,
        paddingHorizontal: 12,
        fontSize: 16,
        iconSize: 20,
        iconMargin: 6,
      },
      lg: {
        height: 52,
        paddingHorizontal: 16,
        fontSize: 18,
        iconSize: 24,
        iconMargin: 8,
      },
      xl: {
        height: 60,
        paddingHorizontal: 20,
        fontSize: 20,
        iconSize: 28,
        iconMargin: 10,
      }
    },
    radioButton: {
      xs: {
        radioSize: 12,
        radioDotSize: 8,
        fontSize: 12,
        gap: 6,
      },
      sm: {
        radioSize: 14,
        radioDotSize: 10,
        fontSize: 14,
        gap: 8,
      },
      md: {
        radioSize: 18,
        radioDotSize: 12,
        fontSize: 16,
        gap: 8,
      },
      lg: {
        radioSize: 22,
        radioDotSize: 16,
        fontSize: 18,
        gap: 10,
      },
      xl: {
        radioSize: 26,
        radioDotSize: 20,
        fontSize: 20,
        gap: 12,
      }
    },
    select: {
      xs: {
        paddingHorizontal: 8,
        minHeight: 28,
        fontSize: 12,
        iconSize: 16,
      },
      sm: {
        paddingHorizontal: 10,
        minHeight: 36,
        fontSize: 14,
        iconSize: 18,
      },
      md: {
        paddingHorizontal: 12,
        minHeight: 44,
        fontSize: 16,
        iconSize: 20,
      },
      lg: {
        paddingHorizontal: 16,
        minHeight: 52,
        fontSize: 18,
        iconSize: 24,
      },
      xl: {
        paddingHorizontal: 20,
        minHeight: 60,
        fontSize: 20,
        iconSize: 28,
      }
    },
    slider: {
      xs: {
        trackHeight: 2,
        thumbSize: 12,
        thumbIconSize: 8,
        markHeight: 6,
        labelFontSize: 10,
      },
      sm: {
        trackHeight: 4,
        thumbSize: 16,
        thumbIconSize: 10,
        markHeight: 8,
        labelFontSize: 11,
      },
      md: {
        trackHeight: 6,
        thumbSize: 20,
        thumbIconSize: 12,
        markHeight: 10,
        labelFontSize: 12,
      },
      lg: {
        trackHeight: 8,
        thumbSize: 24,
        thumbIconSize: 16,
        markHeight: 12,
        labelFontSize: 13,
      },
      xl: {
        trackHeight: 10,
        thumbSize: 28,
        thumbIconSize: 18,
        markHeight: 14,
        labelFontSize: 14,
      }
    },
    switch: {
      xs: {
        trackWidth: 32,
        trackHeight: 18,
        thumbSize: 14,
        thumbIconSize: 8,
        translateX: 14,
      },
      sm: {
        trackWidth: 36,
        trackHeight: 20,
        thumbSize: 16,
        thumbIconSize: 10,
        translateX: 16,
      },
      md: {
        trackWidth: 44,
        trackHeight: 24,
        thumbSize: 20,
        thumbIconSize: 12,
        translateX: 20,
      },
      lg: {
        trackWidth: 52,
        trackHeight: 28,
        thumbSize: 24,
        thumbIconSize: 14,
        translateX: 24,
      },
      xl: {
        trackWidth: 60,
        trackHeight: 32,
        thumbSize: 28,
        thumbIconSize: 16,
        translateX: 28,
      }
    },
    textarea: {
      xs: {
        fontSize: 12,
        padding: 6,
        lineHeight: 18,
        minHeight: 60,
      },
      sm: {
        fontSize: 14,
        padding: 8,
        lineHeight: 20,
        minHeight: 80,
      },
      md: {
        fontSize: 16,
        padding: 12,
        lineHeight: 24,
        minHeight: 100,
      },
      lg: {
        fontSize: 18,
        padding: 16,
        lineHeight: 28,
        minHeight: 120,
      },
      xl: {
        fontSize: 20,
        padding: 20,
        lineHeight: 32,
        minHeight: 140,
      }
    },
    avatar: {
      xs: {
        width: 24,
        height: 24,
        fontSize: 12,
      },
      sm: {
        width: 32,
        height: 32,
        fontSize: 14,
      },
      md: {
        width: 40,
        height: 40,
        fontSize: 16,
      },
      lg: {
        width: 48,
        height: 48,
        fontSize: 18,
      },
      xl: {
        width: 64,
        height: 64,
        fontSize: 24,
      }
    },
    progress: {
      xs: {
        linearHeight: 2,
        circularSize: 24,
        labelFontSize: 10,
        circularLabelFontSize: 8,
      },
      sm: {
        linearHeight: 4,
        circularSize: 32,
        labelFontSize: 12,
        circularLabelFontSize: 10,
      },
      md: {
        linearHeight: 8,
        circularSize: 48,
        labelFontSize: 14,
        circularLabelFontSize: 12,
      },
      lg: {
        linearHeight: 12,
        circularSize: 64,
        labelFontSize: 16,
        circularLabelFontSize: 14,
      },
      xl: {
        linearHeight: 16,
        circularSize: 80,
        labelFontSize: 18,
        circularLabelFontSize: 16,
      }
    },
    accordion: {
      xs: {
        headerPadding: 8,
        headerFontSize: 12,
        iconSize: 16,
        contentPadding: 8,
      },
      sm: {
        headerPadding: 12,
        headerFontSize: 14,
        iconSize: 18,
        contentPadding: 12,
      },
      md: {
        headerPadding: 16,
        headerFontSize: 16,
        iconSize: 20,
        contentPadding: 16,
      },
      lg: {
        headerPadding: 20,
        headerFontSize: 18,
        iconSize: 24,
        contentPadding: 20,
      },
      xl: {
        headerPadding: 24,
        headerFontSize: 20,
        iconSize: 28,
        contentPadding: 24,
      }
    },
    activityIndicator: {
      xs: {
        size: 16,
        borderWidth: 2,
      },
      sm: {
        size: 20,
        borderWidth: 2,
      },
      md: {
        size: 36,
        borderWidth: 3,
      },
      lg: {
        size: 48,
        borderWidth: 4,
      },
      xl: {
        size: 64,
        borderWidth: 5,
      }
    },
    breadcrumb: {
      xs: {
        fontSize: 10,
        lineHeight: 14,
        iconSize: 12,
      },
      sm: {
        fontSize: 12,
        lineHeight: 16,
        iconSize: 14,
      },
      md: {
        fontSize: 14,
        lineHeight: 20,
        iconSize: 16,
      },
      lg: {
        fontSize: 16,
        lineHeight: 24,
        iconSize: 18,
      },
      xl: {
        fontSize: 18,
        lineHeight: 28,
        iconSize: 20,
      }
    },
    list: {
      xs: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        minHeight: 28,
        iconSize: 14,
        labelFontSize: 12,
        labelLineHeight: 16,
      },
      sm: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        minHeight: 32,
        iconSize: 16,
        labelFontSize: 14,
        labelLineHeight: 20,
      },
      md: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        minHeight: 44,
        iconSize: 20,
        labelFontSize: 16,
        labelLineHeight: 24,
      },
      lg: {
        paddingVertical: 24,
        paddingHorizontal: 24,
        minHeight: 52,
        iconSize: 24,
        labelFontSize: 18,
        labelLineHeight: 28,
      },
      xl: {
        paddingVertical: 28,
        paddingHorizontal: 28,
        minHeight: 60,
        iconSize: 28,
        labelFontSize: 20,
        labelLineHeight: 32,
      }
    },
    menu: {
      xs: {
        paddingVertical: 2,
        paddingHorizontal: 6,
        iconSize: 14,
        labelFontSize: 12,
      },
      sm: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        iconSize: 16,
        labelFontSize: 14,
      },
      md: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        iconSize: 20,
        labelFontSize: 16,
      },
      lg: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        iconSize: 24,
        labelFontSize: 18,
      },
      xl: {
        paddingVertical: 20,
        paddingHorizontal: 28,
        iconSize: 28,
        labelFontSize: 20,
      }
    },
    text: {
      xs: {
        fontSize: 12,
        lineHeight: 18,
      },
      sm: {
        fontSize: 14,
        lineHeight: 21,
      },
      md: {
        fontSize: 16,
        lineHeight: 24,
      },
      lg: {
        fontSize: 18,
        lineHeight: 25.2,
      },
      xl: {
        fontSize: 24,
        lineHeight: 31.92,
      }
    },
    tabBar: {
      xs: {
        fontSize: 12,
        lineHeight: 18,
        padding: 6,
      },
      sm: {
        fontSize: 14,
        lineHeight: 20,
        padding: 8,
      },
      md: {
        fontSize: 16,
        lineHeight: 24,
        padding: 12,
      },
      lg: {
        fontSize: 18,
        lineHeight: 28,
        padding: 16,
      },
      xl: {
        fontSize: 20,
        lineHeight: 32,
        padding: 20,
      }
    },
    table: {
      xs: {
        padding: 6,
        fontSize: 12,
        lineHeight: 16,
      },
      sm: {
        padding: 8,
        fontSize: 13,
        lineHeight: 18,
      },
      md: {
        padding: 16,
        fontSize: 14,
        lineHeight: 20,
      },
      lg: {
        padding: 24,
        fontSize: 15,
        lineHeight: 22,
      },
      xl: {
        padding: 32,
        fontSize: 16,
        lineHeight: 24,
      }
    },
    tooltip: {
      xs: {
        fontSize: 11,
        padding: 4,
      },
      sm: {
        fontSize: 12,
        padding: 6,
      },
      md: {
        fontSize: 14,
        padding: 8,
      },
      lg: {
        fontSize: 16,
        padding: 10,
      },
      xl: {
        fontSize: 18,
        padding: 12,
      }
    },
    view: {
      xs: {
        padding: 4,
        spacing: 4,
      },
      sm: {
        padding: 8,
        spacing: 8,
      },
      md: {
        padding: 16,
        spacing: 16,
      },
      lg: {
        padding: 24,
        spacing: 24,
      },
      xl: {
        padding: 32,
        spacing: 32,
      }
    }
  },
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

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // Helper function to convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Helper function to interpolate between two colors
  const interpolate = (color1: [number, number, number], color2: [number, number, number], factor: number): [number, number, number] => {
    return [
      color1[0] + (color2[0] - color1[0]) * factor,
      color1[1] + (color2[1] - color1[1]) * factor,
      color1[2] + (color2[2] - color1[2]) * factor,
    ];
  };

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [0, 0, 0];

  for (const [colorName, baseColor] of Object.entries(baseColors)) {
    colors[colorName] = {} as Record<Shade, ColorValue>;
    const baseRgb = hexToRgb(baseColor);

    for (const shade of shades) {
      if (shade === 500) {
        // 500 is the base color
        colors[colorName][shade] = baseColor;
      } else if (shade < 500) {
        // Lighter shades - interpolate towards white
        // 50 is closest to white, 400 is closest to base
        const factor = (500 - shade) / 450; // 450 = 500 - 50
        const interpolated = interpolate(baseRgb, white, factor);
        colors[colorName][shade] = rgbToHex(...interpolated);
      } else {
        // Darker shades - interpolate towards black
        // 600 is closest to base, 900 is closest to black
        const factor = (shade - 500) / 400; // 400 = 900 - 500
        const interpolated = interpolate(baseRgb, black, factor);
        colors[colorName][shade] = rgbToHex(...interpolated);
      }
    }
  }

  return colors;
}
