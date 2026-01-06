import { ShadowExtensions } from './extensions';

/**
 * Base shadow variant names.
 */
type BaseShadowVariant = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Custom shadow variants added via declaration merging.
 */
type CustomShadowVariant = keyof ShadowExtensions;

/**
 * All available shadow variant names.
 *
 * @example Adding custom shadow variants
 * ```typescript
 * declare module '@idealyst/theme' {
 *   interface ShadowExtensions {
 *     '2xl': true;
 *     inner: true;
 *   }
 * }
 * ```
 */
export type ShadowVariant = BaseShadowVariant | CustomShadowVariant;

/**
 * Shadow value structure for cross-platform shadows.
 */
export type ShadowValue = {
    // Android: elevation value
    elevation: number;

    // iOS: shadow properties
    shadowColor: string;
    shadowOffset: {
        width: number;
        height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    boxShadow?: string;
} | {};

/**
 * Complete shadow system structure.
 */
export type AllShadowTypes = Record<ShadowVariant, ShadowValue>;
