/**
 * Skia Renderer (Native)
 *
 * GPU-accelerated renderer using @shopify/react-native-skia.
 * Provides better performance for complex charts and animations.
 *
 * TODO: Implement Skia primitives in Phase 3
 * For now, falls back to SVG renderer.
 */

import { svgRenderer } from '../svg';
import type { ChartRenderer } from '../types';

// Check if Skia is available
let skiaAvailable = false;
try {
  // Dynamic import to avoid crash if Skia not installed
  require('@shopify/react-native-skia');
  skiaAvailable = true;
} catch {
  skiaAvailable = false;
}

/**
 * Whether Skia is available on this platform
 */
export const isSkiaAvailable = skiaAvailable;

/**
 * Skia renderer - falls back to SVG until fully implemented
 *
 * TODO: Replace with actual Skia implementation:
 * - SkiaCanvas using Canvas from @shopify/react-native-skia
 * - SkiaPath using Path with Skia path API
 * - SkiaRect using RoundedRect
 * - SkiaCircle using Circle
 * - SkiaText using Text with SkFont
 * - Animated versions using useDerivedValue
 */
export const skiaRenderer: ChartRenderer = svgRenderer;

// Placeholder exports for future Skia components
// export { SkiaCanvas } from './SkiaCanvas.native';
// export { SkiaPath } from './SkiaPath.native';
// export { SkiaRect } from './SkiaRect.native';
// export { SkiaCircle } from './SkiaCircle.native';
// export { SkiaText } from './SkiaText.native';
