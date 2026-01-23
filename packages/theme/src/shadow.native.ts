/**
 * shadow - Native implementation
 *
 * Creates cross-platform shadow styles from a simple, unified API.
 * All parameters work consistently across platforms.
 *
 * @example
 * ```tsx
 * import { View } from '@idealyst/components';
 * import { shadow } from '@idealyst/theme';
 *
 * <View style={shadow({ radius: 10, y: 4 })} />
 * <View style={shadow({ radius: 20, y: 8, color: '#3b82f6', opacity: 0.3 })} />
 * ```
 */

import { Platform } from 'react-native';

export interface ShadowOptions {
  /** Shadow radius/size - controls blur and elevation (default: 10) */
  radius?: number;
  /** Horizontal offset in pixels (default: 0) */
  x?: number;
  /** Vertical offset in pixels (default: 4) */
  y?: number;
  /** Shadow color (default: '#000000') */
  color?: string;
  /** Shadow opacity 0-1 (default: 0.15) */
  opacity?: number;
}

export interface ShadowStyle {
  // Web
  boxShadow?: string;
  // iOS
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  // Android
  elevation?: number;
}

/**
 * Approximate Android elevation from shadow radius.
 * Range is clamped to 0-24 (Android's max elevation).
 */
function radiusToElevation(radius: number): number {
  // Map radius to elevation: radius 10 ≈ elevation 3-4
  // This provides reasonable visual parity with iOS/web
  const elevation = Math.round(radius / 3);
  return Math.max(0, Math.min(24, elevation));
}

/**
 * Parse color string to RGBA components.
 * Supports: #RGB, #RRGGBB, #RRGGBBAA, rgb(), rgba()
 */
function parseColor(color: string): { r: number; g: number; b: number; a: number } {
  // Default fallback
  const fallback = { r: 0, g: 0, b: 0, a: 1 };

  // Handle rgba(r, g, b, a) or rgb(r, g, b)
  const rgbaMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    };
  }

  // Handle hex: #RGB, #RRGGBB, #RRGGBBAA
  const hex = color.replace('#', '');
  if (hex.length === 3) {
    // #RGB -> #RRGGBB
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: 1,
    };
  } else if (hex.length === 6) {
    // #RRGGBB
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  } else if (hex.length === 8) {
    // #RRGGBBAA
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }

  return fallback;
}

/**
 * Creates a cross-platform shadow style object.
 *
 * @param options - Shadow configuration
 * @returns Style object with platform-appropriate shadow properties
 */
export function shadow(options: ShadowOptions = {}): ShadowStyle {
  const {
    radius = 10,
    x = 0,
    y = 4,
    color = '#000000',
    opacity = 0.15,
  } = options;

  const parsed = parseColor(color);
  // Multiply color's alpha with opacity parameter
  const finalAlpha = parsed.a * opacity;

  if (Platform.OS === 'android') {
    // Android: elevation + shadowColor (limited control)
    // Offset (x, y) is not supported - elevation controls everything
    // Bake opacity into shadowColor as alpha channel
    return {
      elevation: radiusToElevation(radius),
      shadowColor: `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${finalAlpha})`,
    };
  }

  // iOS: Full shadow control
  return {
    shadowColor: `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`,
    shadowOffset: { width: x, height: y },
    shadowOpacity: finalAlpha,
    shadowRadius: radius / 2, // iOS shadowRadius is roughly half the CSS blur
  };
}
