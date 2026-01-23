/**
 * Transform normalization utilities.
 *
 * Converts the simplified TransformObject syntax to the React Native
 * array format used internally by both web and native implementations.
 */

import type { TransformObject, TransformProperty } from './types';

/**
 * Type guard to detect if a transform is using the new object syntax
 * vs the legacy array format.
 */
export function isTransformObject(
  transform: TransformObject | TransformProperty[] | undefined
): transform is TransformObject {
  return transform !== undefined && !Array.isArray(transform);
}

/**
 * Normalizes a TransformObject to the React Native array format.
 *
 * @example
 * normalizeTransform({ x: 10, y: 20, scale: 1.2, rotate: 45 })
 * // Returns: [{ translateX: 10 }, { translateY: 20 }, { scale: 1.2 }, { rotate: '45deg' }]
 */
export function normalizeTransform(transform: TransformObject): TransformProperty[] {
  const result: TransformProperty[] = [];

  // Perspective should come first for proper 3D transforms
  if (transform.perspective !== undefined) {
    result.push({ perspective: transform.perspective });
  }

  // Translation
  if (transform.x !== undefined) {
    result.push({ translateX: transform.x });
  }
  if (transform.y !== undefined) {
    result.push({ translateY: transform.y });
  }

  // Scale
  if (transform.scale !== undefined) {
    result.push({ scale: transform.scale });
  }
  if (transform.scaleX !== undefined) {
    result.push({ scaleX: transform.scaleX });
  }
  if (transform.scaleY !== undefined) {
    result.push({ scaleY: transform.scaleY });
  }

  // Rotation - convert number to degrees string
  if (transform.rotate !== undefined) {
    const rotation =
      typeof transform.rotate === 'number' ? `${transform.rotate}deg` : transform.rotate;
    result.push({ rotate: rotation });
  }
  if (transform.rotateX !== undefined) {
    result.push({ rotateX: transform.rotateX });
  }
  if (transform.rotateY !== undefined) {
    result.push({ rotateY: transform.rotateY });
  }
  if (transform.rotateZ !== undefined) {
    result.push({ rotateZ: transform.rotateZ });
  }

  // Skew
  if (transform.skewX !== undefined) {
    result.push({ skewX: transform.skewX });
  }
  if (transform.skewY !== undefined) {
    result.push({ skewY: transform.skewY });
  }

  return result;
}
