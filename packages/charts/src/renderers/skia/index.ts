/**
 * Skia Renderer (Web stub)
 *
 * On web, Skia is not available - this exports the SVG renderer as a fallback.
 * The actual Skia implementation is in index.native.ts.
 */

import { svgRenderer } from '../svg';
import type { ChartRenderer } from '../types';

/**
 * On web, fall back to SVG renderer
 */
export const skiaRenderer: ChartRenderer = svgRenderer;

/**
 * Whether Skia is available on this platform
 */
export const isSkiaAvailable = false;
